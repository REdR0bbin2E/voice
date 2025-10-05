"""
Test the running Echo API Server
Make sure api_server.py is running first!
"""
import requests
import json

API_URL = "http://localhost:5000"

def test_health():
    """Test health endpoint."""
    print("\n🏥 Testing /health endpoint...")
    try:
        response = requests.get(f"{API_URL}/health", timeout=5)
        if response.status_code == 200:
            print("✅ Server is healthy!")
            print(f"   Response: {response.json()}")
            return True
        else:
            print(f"❌ Unexpected status: {response.status_code}")
            return False
    except requests.exceptions.ConnectionError:
        print("❌ Cannot connect to server. Is it running?")
        print("   Run: python api_server.py")
        return False
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

def test_voices():
    """Test get voices endpoint."""
    print("\n🎤 Testing /api/voices endpoint...")
    try:
        response = requests.get(f"{API_URL}/api/voices", timeout=10)
        print(f"   Status: {response.status_code}")
        if response.status_code == 200:
            print("✅ Voices endpoint working!")
            data = response.json()
            print(f"   Response: {json.dumps(data, indent=2)[:200]}...")
        else:
            print(f"   Response: {response.text[:200]}")
    except Exception as e:
        print(f"⚠️  Error: {e}")

def test_synthesize():
    """Test speech synthesis endpoint."""
    print("\n🗣️ Testing /api/synthesize endpoint...")
    try:
        payload = {
            "text": "Hello from Echo! This is a test.",
            "format": "wav"
        }
        response = requests.post(
            f"{API_URL}/api/synthesize",
            json=payload,
            timeout=30
        )
        print(f"   Status: {response.status_code}")
        if response.status_code == 200:
            print("✅ Speech synthesis working!")
            data = response.json()
            print(f"   Response: {json.dumps(data, indent=2)}")
        else:
            print(f"   Response: {response.text[:200]}")
    except Exception as e:
        print(f"⚠️  Error: {e}")

if __name__ == "__main__":
    print("=" * 60)
    print("🧪 Testing Echo API Server")
    print("=" * 60)
    
    if test_health():
        test_voices()
        test_synthesize()
    
    print("\n" + "=" * 60)
    print("✅ Tests complete!")
    print("=" * 60)
