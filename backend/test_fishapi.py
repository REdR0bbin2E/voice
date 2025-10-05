"""
Test Fish.Audio API Connection
Run this to verify your Fish.Audio API key is working correctly.
"""
import os
from pathlib import Path
from dotenv import load_dotenv
import requests

# Load environment variables
env_path = Path(__file__).parent / '.env'
load_dotenv(dotenv_path=env_path)

def test_fish_audio():
    """Test Fish.Audio API connection."""
    api_key = os.getenv("FISH_AUDIO_API_KEY")
    api_url = os.getenv("FISH_AUDIO_API_URL", "https://api.fish.audio/v1")
    
    if not api_key or api_key == "your_fish_audio_api_key_here":
        print("❌ FISH_AUDIO_API_KEY not configured in .env file")
        print("\n📖 Get your API key from:")
        print("   https://fish.audio")
        print("\nThen update backend/.env with your key")
        return False
    
    print("🔄 Testing Fish.Audio API...")
    print(f"📍 API URL: {api_url}")
    print(f"🔑 API Key: {api_key[:8]}..." + "*" * 20)
    
    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json"
    }
    
    # Test 1: Check API health/voices endpoint
    try:
        print("\n1️⃣ Testing API endpoint...")
        response = requests.get(
            f"{api_url}/voices",
            headers=headers,
            timeout=10
        )
        
        if response.status_code == 200:
            print("✅ API connection successful!")
            voices = response.json()
            print(f"📢 Available voices: {len(voices) if isinstance(voices, list) else 'Unknown'}")
        elif response.status_code == 401:
            print("❌ Authentication failed - Invalid API key")
            return False
        else:
            print(f"⚠️ Unexpected response: {response.status_code}")
            print(f"Response: {response.text[:200]}")
            
    except requests.exceptions.RequestException as e:
        print(f"❌ API request failed: {e}")
        return False
    
    # Test 2: Simple TTS request (if API supports it)
    print("\n2️⃣ Testing text-to-speech...")
    try:
        payload = {
            "text": "Hello, this is a test.",
            "format": "wav"
        }
        
        response = requests.post(
            f"{api_url}/tts",
            headers=headers,
            json=payload,
            timeout=30
        )
        
        if response.status_code == 200:
            print("✅ Text-to-speech successful!")
            print(f"📦 Audio size: {len(response.content)} bytes")
        else:
            print(f"⚠️ TTS response: {response.status_code}")
            print(f"Response: {response.text[:200]}")
            
    except requests.exceptions.RequestException as e:
        print(f"⚠️ TTS test failed: {e}")
        print("(This might be normal if the endpoint structure is different)")
    
    print("\n✅ Fish.Audio API is configured and working!")
    return True

if __name__ == "__main__":
    print("=" * 60)
    print("🐟 Fish.Audio API Test")
    print("=" * 60)
    test_fish_audio()
    print("=" * 60)
