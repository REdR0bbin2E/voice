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
    """
    try:
        if 'audio' not in request.files:
            return jsonify({"error": "No audio file provided"}), 400
        
        audio_file = request.files['audio']
        name = request.form.get('name', 'Reference Audio')
        
        # Save temporarily
        temp_path = Path("temp") / audio_file.filename
        temp_path.parent.mkdir(exist_ok=True)
        audio_file.save(str(temp_path))
        
        # Upload to Fish.Audio
        reference_id = voice_service.upload_reference_audio(str(temp_path), name)
        
        # Clean up temp file
        temp_path.unlink()
        
        return jsonify({
            "success": True,
            "reference_id": reference_id,
            "message": "Reference audio uploaded successfully"
        }), 201
        
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


if __name__ == '__main__':
    print("=" * 60)
    print("🚀 Starting Echo Backend API Server")
    print("=" * 60)
    print(f"📍 Server URL: http://{Config.API_HOST}:{Config.API_PORT}")
    print(f"🔧 Fish.Audio API: {Config.FISH_AUDIO_API_URL}")
    print(f"✅ MongoDB: {'Connected' if Config.MONGO_URI and Config.MONGO_URI != 'your_mongodb_connection_string_here' else '⚠️  Not configured'}")
    print("=" * 60)
    print("\n💡 Press CTRL+C to stop the server\n")
    
    try:
        app.run(
            host=Config.API_HOST,
            port=Config.API_PORT,
            debug=True,
            use_reloader=False,  # Disable reloader to prevent socket issues on Windows
            threaded=True
        )
    except KeyboardInterrupt:
        print("\n\n👋 Server stopped by user")
    except Exception as e:
        print(f"\n❌ Server error: {e}")
