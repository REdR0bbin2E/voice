"""
Test MongoDB Connection
Run this to verify your MongoDB setup is working correctly.
"""
import os
from pathlib import Path
from dotenv import load_dotenv
from pymongo import MongoClient

# Load environment variables
env_path = Path(__file__).parent / '.env'
load_dotenv(dotenv_path=env_path)

def test_mongodb():
    """Test MongoDB connection."""
    mongo_uri = os.getenv("MONGO_URI")
    
    if not mongo_uri or mongo_uri == "your_mongodb_connection_string_here":
        print("❌ MONGO_URI not configured in .env file")
        print("\n📖 Follow these steps:")
        print("1. Open MONGODB_SETUP.md for instructions")
        print("2. Create a free MongoDB Atlas account")
        print("3. Get your connection string")
        print("4. Update backend/.env with your MONGO_URI")
        return False
    
    print("🔄 Testing MongoDB connection...")
    print(f"📍 URI: {mongo_uri.split('@')[1] if '@' in mongo_uri else 'invalid'}")
    
    try:
        # Create client with timeout
        client = MongoClient(mongo_uri, serverSelectionTimeoutMS=5000)
        
        # Test connection
        client.admin.command('ping')
        
        # Get database
        db = client['echo_db']
        
        # Create test collections if they don't exist
        collections = db.list_collection_names()
        
        print("\n✅ MongoDB connection successful!")
        print(f"📊 Database: echo_db")
        print(f"📁 Collections: {', '.join(collections) if collections else 'None yet (will be created automatically)'}")
        
        # Test write operation
        test_collection = db['test']
        result = test_collection.insert_one({"test": "Hello from Echo!"})
        test_collection.delete_one({"_id": result.inserted_id})
        
        print("✅ Write test successful!")
        
        client.close()
        return True
        
    except Exception as e:
        print(f"\n❌ MongoDB connection failed!")
        print(f"Error: {e}")
        print("\n📖 Troubleshooting:")
        print("1. Check your connection string in backend/.env")
        print("2. Make sure you replaced <password> with your actual password")
        print("3. Verify you whitelisted your IP (0.0.0.0/0) in MongoDB Atlas")
        print("4. Wait a few minutes if you just created the cluster")
        print("\n📚 See MONGODB_SETUP.md for detailed instructions")
        return False

if __name__ == "__main__":
    print("=" * 60)
    print("🧪 MongoDB Connection Test")
    print("=" * 60)
    test_mongodb()
    print("=" * 60)
