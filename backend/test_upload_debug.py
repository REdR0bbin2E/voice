"""
Debug script to test Fish.Audio model creation API
This will help us see what the API expects
"""
import requests
import json
from pathlib import Path
import sys
import os

# Add parent directory to path
sys.path.insert(0, str(Path(__file__).parent.parent))

from backend.config import Config

Config.validate()
API_KEY = Config.FISH_AUDIO_API_KEY

print("🔍 Testing Fish.Audio Model Creation API")
print("=" * 60)

# Test file
audio_file = Path("c:/Users/xxsoi/Desktop/Coding/voice/speech/input.mp3")
if not audio_file.exists():
    print(f"❌ Audio file not found: {audio_file}")
    exit(1)

print(f"📁 Using audio file: {audio_file}")
print(f"   Size: {audio_file.stat().st_size} bytes")
print()

# Test 1: Try with 'audio' field (common API pattern)
print("🧪 Test 1: Using 'audio' field name...")
try:
    with open(audio_file, 'rb') as f:
        files = {'audio': (audio_file.name, f, 'audio/mpeg')}
        data = {
            'type': 'tts',
            'train_mode': 'fast',
            'title': 'Test Voice Model',
            'texts': 'Reference audio for voice cloning'
        }
        
        response = requests.post(
            "https://api.fish.audio/model",
            headers={"Authorization": f"Bearer {API_KEY}"},
            files=files,
            data=data,
            timeout=60
        )
        
        print(f"   Status: {response.status_code}")
        print(f"   Response: {response.text[:200]}")
        
        if response.status_code == 200 or response.status_code == 201:
            print("   ✅ SUCCESS with 'audio' field!")
            result = response.json()
            print(f"   Model ID: {result.get('id') or result.get('_id')}")
        else:
            print("   ❌ Failed with 'audio' field")
except Exception as e:
    print(f"   ❌ Error: {e}")

print()

# Test 2: Try with 'voices' field (current implementation)
print("🧪 Test 2: Using 'voices' field name...")
try:
    with open(audio_file, 'rb') as f:
        files = {'voices': (audio_file.name, f, 'audio/mpeg')}
        data = {
            'type': 'tts',
            'train_mode': 'fast',
            'title': 'Test Voice Model',
            'texts': 'Reference audio for voice cloning'
        }
        
        response = requests.post(
            "https://api.fish.audio/model",
            headers={"Authorization": f"Bearer {API_KEY}"},
            files=files,
            data=data,
            timeout=60
        )
        
        print(f"   Status: {response.status_code}")
        print(f"   Response: {response.text[:200]}")
        
        if response.status_code == 200 or response.status_code == 201:
            print("   ✅ SUCCESS with 'voices' field!")
            result = response.json()
            print(f"   Model ID: {result.get('id') or result.get('_id')}")
        else:
            print("   ❌ Failed with 'voices' field")
except Exception as e:
    print(f"   ❌ Error: {e}")

print()

# Test 3: Try minimal request
print("🧪 Test 3: Minimal request (just audio file)...")
try:
    with open(audio_file, 'rb') as f:
        files = {'audio': (audio_file.name, f, 'audio/mpeg')}
        data = {'title': 'Test Voice'}
        
        response = requests.post(
            "https://api.fish.audio/model",
            headers={"Authorization": f"Bearer {API_KEY}"},
            files=files,
            data=data,
            timeout=60
        )
        
        print(f"   Status: {response.status_code}")
        print(f"   Response: {response.text[:200]}")
        
        if response.status_code == 200 or response.status_code == 201:
            print("   ✅ SUCCESS with minimal request!")
            result = response.json()
            print(f"   Model ID: {result.get('id') or result.get('_id')}")
        else:
            print("   ❌ Failed with minimal request")
except Exception as e:
    print(f"   ❌ Error: {e}")

print()
print("=" * 60)
print("🏁 Debug test complete!")
