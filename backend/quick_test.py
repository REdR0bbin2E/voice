"""
Quick Test Script - Test Voice Synthesis with Fish.Audio API
Run this while the backend server is running to test voice synthesis!
"""
import requests
import json
from pathlib import Path

API_URL = "http://localhost:5000"

def test_synthesis():
    """Test voice synthesis endpoint."""
    print("=" * 60)
    print("🎤 Testing Voice Synthesis")
    print("=" * 60)
    print()
    
    # Test 1: Health check
    print("1️⃣ Testing server health...")
    try:
        response = requests.get(f"{API_URL}/health", timeout=5)
        if response.status_code == 200:
            print("   ✅ Server is healthy!")
            print(f"   Response: {response.json()}")
        else:
            print(f"   ❌ Health check failed: {response.status_code}")
            return
    except requests.exceptions.ConnectionError:
        print("   ❌ Cannot connect to server!")
        print("   Make sure backend is running: python api_server.py")
        return
    
    print()
    
    # Test 2: Synthesize speech
    print("2️⃣ Testing voice synthesis...")
    print("   Text: 'Hello! This is a test of the Echo voice system.'")
    
    payload = {
        "text": "Hello! This is a test of the Echo voice system.",
        "format": "wav"
    }
    
    try:
        response = requests.post(
            f"{API_URL}/api/synthesize",
            json=payload,
            timeout=30
        )
        
        print(f"   Status: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print("   ✅ Voice synthesis successful!")
            print(f"   Audio saved to: {data.get('audio_path')}")
            print(f"   Message: {data.get('message')}")
            
            # Check if file exists
            audio_path = Path(data.get('audio_path'))
            if audio_path.exists():
                file_size = audio_path.stat().st_size
                print(f"   📦 File size: {file_size:,} bytes ({file_size/1024:.1f} KB)")
                print()
                print("=" * 60)
                print("🎉 SUCCESS! Audio file created!")
                print("=" * 60)
                print()
                print(f"📁 Check the file at: {audio_path.absolute()}")
                print()
                print("You can play it with:")
                print(f"   - Windows Media Player")
                print(f"   - VLC")
                print(f"   - Or any audio player")
            else:
                print("   ⚠️  File not found at expected location")
        else:
            print(f"   ❌ Synthesis failed!")
            print(f"   Response: {response.text}")
            
    except requests.exceptions.Timeout:
        print("   ⏱️  Request timed out (this can happen on first request)")
        print("   Try running the test again")
    except Exception as e:
        print(f"   ❌ Error: {e}")
    
    print()
    print("=" * 60)

if __name__ == "__main__":
    test_synthesis()
