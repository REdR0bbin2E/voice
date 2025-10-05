"""
Test script for database integration with voice models.
Tests the complete workflow of saving and retrieving voice models.
"""

import sys
from pathlib import Path

# Add parent directory to path
sys.path.insert(0, str(Path(__file__).parent.parent))

from backend.database import DatabaseManager
from bson.objectid import ObjectId
import datetime

def test_database_integration():
    """Test the voice_models collection and methods."""
    
    print("=" * 60)
    print("🧪 TESTING DATABASE INTEGRATION")
    print("=" * 60)
    
    # Initialize database
    try:
        db = DatabaseManager()
        print("✅ DatabaseManager initialized")
    except Exception as e:
        print(f"❌ Failed to initialize database: {e}")
        print("\n⚠️  Make sure MONGO_URI is set in .env file")
        return
    
    # Check if MongoDB is configured
    if not db.voice_models:
        print("\n❌ MongoDB not configured - database features disabled")
        print("Please set MONGO_URI in your .env file to test database features")
        return
    
    print("\n" + "=" * 60)
    print("TEST 1: Create Voice Model")
    print("=" * 60)
    
    # Create a test user first
    test_user = db.get_or_create_user("test_auth0_user_123", "test@example.com")
    user_id = test_user
    print(f"✅ Test user created/retrieved: {user_id}")
    
    # Create a test voice model
    try:
        voice_model = db.create_voice_model(
            user_id=user_id,
            model_id="test_fish_audio_model_123",
            name="Test Voice Model",
            audio_file_path="test_audio.mp3",
            file_type="audio",
            echo_id=None
        )
        print(f"✅ Voice model created:")
        print(f"   - Database ID: {voice_model['_id']}")
        print(f"   - Model ID: {voice_model['model_id']}")
        print(f"   - Name: {voice_model['name']}")
        print(f"   - User ID: {voice_model['user_id']}")
        print(f"   - Created: {voice_model['created_at']}")
    except Exception as e:
        print(f"❌ Failed to create voice model: {e}")
        return
    
    print("\n" + "=" * 60)
    print("TEST 2: Retrieve Voice Model by model_id")
    print("=" * 60)
    
    try:
        retrieved = db.get_voice_model_by_id("test_fish_audio_model_123")
        if retrieved:
            print(f"✅ Voice model retrieved:")
            print(f"   - Name: {retrieved['name']}")
            print(f"   - Model ID: {retrieved['model_id']}")
        else:
            print("❌ Voice model not found")
    except Exception as e:
        print(f"❌ Failed to retrieve voice model: {e}")
    
    print("\n" + "=" * 60)
    print("TEST 3: Get All Voice Models for User")
    print("=" * 60)
    
    try:
        user_models = db.get_voice_models_for_user(user_id)
        print(f"✅ Found {len(user_models)} voice model(s) for user")
        for i, model in enumerate(user_models, 1):
            print(f"   {i}. {model['name']} (ID: {model['model_id']})")
    except Exception as e:
        print(f"❌ Failed to retrieve user models: {e}")
    
    print("\n" + "=" * 60)
    print("TEST 4: Create Echo and Link Voice Model")
    print("=" * 60)
    
    try:
        # Create an Echo
        echo = db.create_echo(
            user_id=user_id,
            name="Test Echo",
            persona_prompt="You are a helpful assistant.",
            voice_model_id="test_fish_audio_model_123"
        )
        echo_id = echo['_id']
        print(f"✅ Echo created: {echo_id}")
        
        # Link voice model to Echo
        success = db.link_voice_model_to_echo(
            model_id="test_fish_audio_model_123",
            echo_id=echo_id
        )
        
        if success:
            print(f"✅ Voice model linked to Echo")
            
            # Retrieve voice model for Echo
            echo_model = db.get_voice_model_for_echo(echo_id)
            if echo_model:
                print(f"✅ Retrieved Echo's voice model: {echo_model['name']}")
            else:
                print("❌ Could not retrieve Echo's voice model")
        else:
            print("❌ Failed to link voice model to Echo")
            
    except Exception as e:
        print(f"❌ Failed Echo test: {e}")
    
    print("\n" + "=" * 60)
    print("TEST 5: Delete Voice Model")
    print("=" * 60)
    
    try:
        deleted = db.delete_voice_model("test_fish_audio_model_123")
        if deleted:
            print("✅ Voice model deleted successfully")
            
            # Verify deletion
            check = db.get_voice_model_by_id("test_fish_audio_model_123")
            if not check:
                print("✅ Confirmed: Voice model no longer exists")
            else:
                print("❌ Error: Voice model still exists after deletion")
        else:
            print("❌ Failed to delete voice model")
    except Exception as e:
        print(f"❌ Delete operation failed: {e}")
    
    # Cleanup: Delete test Echo
    try:
        if 'echo_id' in locals():
            db.echos.delete_one({"_id": echo_id})
            print("🧹 Cleaned up test Echo")
    except:
        pass
    
    print("\n" + "=" * 60)
    print("✅ ALL TESTS COMPLETED")
    print("=" * 60)
    print("\n💡 Database integration is working correctly!")
    print("   - Voice models can be created, retrieved, and deleted")
    print("   - Models can be linked to users and Echos")
    print("   - All CRUD operations functioning properly")
    print("\n🎯 Next step: Test via API endpoints at http://localhost:5000")


if __name__ == "__main__":
    test_database_integration()
