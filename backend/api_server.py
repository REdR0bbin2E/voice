"""
Backend API Server for Echo Voice Application
Provides endpoints for voice synthesis, user management, and conversation history.
"""
from flask import Flask, request, jsonify, send_from_directory, render_template
from flask_cors import CORS
import os
import sys
from pathlib import Path

# Add parent directory to path to import modules
sys.path.insert(0, str(Path(__file__).parent.parent))

from backend.config import Config
from backend.database import DatabaseManager
from backend.voice_service import VoiceServiceWrapper

# Initialize Flask app
app = Flask(__name__)
CORS(app)  # Enable CORS for React Native frontend

# Initialize services
try:
    Config.validate()
    db = DatabaseManager()
    voice_service = VoiceServiceWrapper()
    print("✅ All services initialized successfully")
except Exception as e:
    print(f"❌ Error initializing services: {e}")
    print("Please check your .env file and ensure all required variables are set.")
    sys.exit(1)


@app.route('/', methods=['GET'])
def index():
    """Serve the interactive test page."""
    return render_template('index.html')


@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint."""
    return jsonify({"status": "healthy", "service": "echo-backend"}), 200


@app.route('/api/synthesize', methods=['POST'])
def synthesize_speech():
    """
    Synthesize speech from text using Fish.Audio API.
    
    Request body:
    {
        "text": "Text to synthesize",
        "reference_id": "reference_audio_id" (optional),
        "voice_id": "voice_model_id" (optional),
        "format": "wav" (optional, default: wav)
    }
    """
    try:
        data = request.json
        text = data.get('text')
        
        if not text:
            return jsonify({"error": "Text is required"}), 400
        
        # Generate speech using Fish.Audio API
        output_path = voice_service.synthesize(
            text=text,
            reference_id=data.get('reference_id'),
            voice_id=data.get('voice_id'),
            format=data.get('format', 'wav')
        )
        
        return jsonify({
            "success": True,
            "audio_path": str(output_path),
            "message": "Speech synthesized successfully"
        }), 200
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/api/voices', methods=['GET'])
def get_voices():
    """Get list of available voices from Fish.Audio."""
    try:
        voices = voice_service.get_available_voices()
        return jsonify({"voices": voices}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/api/upload-reference', methods=['POST'])
def upload_reference():
    """
    Upload a reference audio file for voice cloning.
    
    Expects multipart/form-data with:
    - audio: audio file
    - name: optional name for the reference
    - user_id: optional user ID to link the voice model (recommended)
    - echo_id: optional echo ID to link the voice model
    - file_type: 'audio' or 'video' (default: 'audio')
    """
    try:
        if 'audio' not in request.files:
            return jsonify({"error": "No audio file provided"}), 400
        
        audio_file = request.files['audio']
        name = request.form.get('name', 'Reference Audio')
        user_id = request.form.get('user_id')  # Optional
        echo_id = request.form.get('echo_id')  # Optional
        file_type = request.form.get('file_type', 'audio')
        
        # Save temporarily
        temp_path = Path("temp") / audio_file.filename
        temp_path.parent.mkdir(exist_ok=True)
        audio_file.save(str(temp_path))
        
        # Upload to Fish.Audio
        result = voice_service.upload_reference_audio(str(temp_path), name)
        
        # Extract model_id from result (voice_service returns a dict)
        model_id = result.get('model_id') or result.get('reference_id') if isinstance(result, dict) else result
        
        # Save to database if user_id provided and MongoDB is configured
        db_record = None
        if user_id and db.voice_models:
            try:
                from bson.objectid import ObjectId
                user_obj_id = ObjectId(user_id)
                echo_obj_id = ObjectId(echo_id) if echo_id else None
                
                db_record = db.create_voice_model(
                    user_id=user_obj_id,
                    model_id=model_id,
                    name=name,
                    audio_file_path=audio_file.filename,  # Original filename
                    file_type=file_type,
                    echo_id=echo_obj_id
                )
                
                # Convert ObjectIds to strings for JSON response
                if db_record:
                    db_record['_id'] = str(db_record['_id'])
                    db_record['user_id'] = str(db_record['user_id'])
                    if db_record.get('echo_id'):
                        db_record['echo_id'] = str(db_record['echo_id'])
                    db_record['created_at'] = db_record['created_at'].isoformat()
                    
            except Exception as db_error:
                print(f"Warning: Could not save to database: {db_error}")
                # Continue anyway - Fish.Audio upload was successful
        
        # Clean up temp file
        temp_path.unlink()
        
        response = {
            "success": True,
            "model_id": model_id,
            "reference_id": model_id,
            "message": "Reference audio uploaded successfully"
        }
        
        if db_record:
            response["database_record"] = db_record
            response["message"] += " and saved to database"
        
        return jsonify(response), 201
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/api/users/<auth0_id>', methods=['GET', 'POST'])
def manage_user(auth0_id):
    """Get or create a user by Auth0 ID."""
    try:
        if request.method == 'POST':
            data = request.json
            email = data.get('email')
            if not email:
                return jsonify({"error": "Email is required"}), 400
            
            user = db.get_or_create_user(auth0_id, email)
            return jsonify({"user": str(user)}), 200
        else:
            # GET request
            user = db.users.find_one({"auth0_user_id": auth0_id})
            if user:
                user['_id'] = str(user['_id'])
                return jsonify({"user": user}), 200
            else:
                return jsonify({"error": "User not found"}), 404
                
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/api/echo', methods=['POST'])
def create_echo():
    """Create a new Echo for a user."""
    try:
        data = request.json
        user_id = data.get('user_id')
        name = data.get('name')
        persona_prompt = data.get('persona_prompt')
        voice_model_id = data.get('voice_model_id')
        
        if not all([user_id, name, persona_prompt, voice_model_id]):
            return jsonify({"error": "Missing required fields"}), 400
        
        from bson.objectid import ObjectId
        echo = db.create_echo(ObjectId(user_id), name, persona_prompt, voice_model_id)
        echo['_id'] = str(echo['_id'])
        echo['user_id'] = str(echo['user_id'])
        
        return jsonify({"echo": echo}), 201
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/api/conversation/<echo_id>', methods=['GET', 'POST'])
def manage_conversation(echo_id):
    """Get conversation history or add a new message."""
    try:
        from bson.objectid import ObjectId
        echo_obj_id = ObjectId(echo_id)
        
        if request.method == 'POST':
            data = request.json
            role = data.get('role')
            content = data.get('content')
            
            if not role or not content:
                return jsonify({"error": "Role and content are required"}), 400
            
            db.add_message_to_history(echo_obj_id, role, content)
            return jsonify({"success": True, "message": "Message added"}), 201
        else:
            # GET request
            limit = request.args.get('limit', 10, type=int)
            messages = db.get_message_history(echo_obj_id, limit)
            
            # Convert ObjectIds to strings
            for msg in messages:
                msg['_id'] = str(msg['_id'])
                msg['echo_id'] = str(msg['echo_id'])
            
            return jsonify({"messages": messages}), 200
            
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/api/voice-models', methods=['GET'])
def get_voice_models():
    """
    Get all voice models for a user.
    
    Query parameters:
    - user_id: User's ObjectId (required)
    """
    try:
        user_id = request.args.get('user_id')
        if not user_id:
            return jsonify({"error": "user_id is required"}), 400
        
        from bson.objectid import ObjectId
        user_obj_id = ObjectId(user_id)
        
        models = db.get_voice_models_for_user(user_obj_id)
        
        # Convert ObjectIds to strings
        for model in models:
            model['_id'] = str(model['_id'])
            model['user_id'] = str(model['user_id'])
            if model.get('echo_id'):
                model['echo_id'] = str(model['echo_id'])
            if model.get('created_at'):
                model['created_at'] = model['created_at'].isoformat()
        
        return jsonify({"voice_models": models, "count": len(models)}), 200
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/api/voice-models/<model_id>', methods=['GET', 'DELETE'])
def manage_voice_model(model_id):
    """
    Get or delete a specific voice model by model_id.
    
    GET: Retrieve voice model details
    DELETE: Remove voice model from database
    """
    try:
        if request.method == 'DELETE':
            success = db.delete_voice_model(model_id)
            if success:
                return jsonify({"success": True, "message": "Voice model deleted"}), 200
            else:
                return jsonify({"error": "Voice model not found or could not be deleted"}), 404
        else:
            # GET request
            model = db.get_voice_model_by_id(model_id)
            if not model:
                return jsonify({"error": "Voice model not found"}), 404
            
            # Convert ObjectIds to strings
            model['_id'] = str(model['_id'])
            model['user_id'] = str(model['user_id'])
            if model.get('echo_id'):
                model['echo_id'] = str(model['echo_id'])
            if model.get('created_at'):
                model['created_at'] = model['created_at'].isoformat()
            
            return jsonify({"voice_model": model}), 200
            
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/api/echo/<echo_id>/voice-model', methods=['GET'])
def get_echo_voice_model(echo_id):
    """Get the voice model associated with a specific Echo."""
    try:
        from bson.objectid import ObjectId
        echo_obj_id = ObjectId(echo_id)
        
        model = db.get_voice_model_for_echo(echo_obj_id)
        if not model:
            return jsonify({"error": "No voice model found for this Echo"}), 404
        
        # Convert ObjectIds to strings
        model['_id'] = str(model['_id'])
        model['user_id'] = str(model['user_id'])
        if model.get('echo_id'):
            model['echo_id'] = str(model['echo_id'])
        if model.get('created_at'):
            model['created_at'] = model['created_at'].isoformat()
        
        return jsonify({"voice_model": model}), 200
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == '__main__':
    print("=" * 60)
    print("🚀 Starting Echo Backend API Server")
    print("=" * 60)
    print(f"📍 Server URL: http://{Config.API_HOST}:{Config.API_PORT}")
    print(f"🔧 Fish.Audio API: {Config.FISH_AUDIO_API_URL}")
    print(f"💾 MongoDB: ⚠️ Disabled (not needed for voice routing)")
    print("=" * 60)
    print("\n💡 Press CTRL+C to stop the server\n")
    
    try:
        app.run(
            host=Config.API_HOST,
            port=Config.API_PORT,
            debug=False,
            use_reloader=False,
            threaded=True
        )
    except KeyboardInterrupt:
        print("\n\n👋 Server stopped by user")
    except Exception as e:
        print(f"\n❌ Server error: {e}")
