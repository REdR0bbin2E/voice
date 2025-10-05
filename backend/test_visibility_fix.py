"""
Quick test to verify the visibility:private fix works
"""
import requests
from pathlib import Path
import sys
sys.path.insert(0, str(Path(__file__).parent.parent))

from backend.config import Config

Config.validate()

print("🧪 Testing Fish.Audio Model Creation with visibility:private")
print("=" * 60)

audio_file = Path("c:/Users/xxsoi/Desktop/Coding/voice/backend/inputs/Countdown & Encouragement 18.mp3")

if not audio_file.exists():
    print(f"❌ File not found: {audio_file}")
    exit(1)

print(f"📁 File: {audio_file.name}")
print(f"   Size: {audio_file.stat().st_size / (1024*1024):.2f} MB")

print("\n📤 Uploading with visibility:private...")

try:
    with open(audio_file, 'rb') as f:
        files = {'voices': (audio_file.name, f, 'audio/mpeg')}
        data = {
            'type': 'tts',
            'train_mode': 'fast',
            'title': 'Test Private Voice Model',
            'texts': 'Reference audio for voice cloning',
            'visibility': 'private'  # THIS IS THE FIX!
        }
        
        response = requests.post(
            "https://api.fish.audio/model",
            headers={"Authorization": f"Bearer {Config.FISH_AUDIO_API_KEY}"},
            files=files,
            data=data,
            timeout=60
        )
        
        print(f"\n📥 Response: {response.status_code}")
        
        if response.status_code in [200, 201]:
            result = response.json()
            model_id = result.get('id') or result.get('_id')
            print(f"✅ SUCCESS! Model created!")
            print(f"   Model ID: {model_id}")
            print(f"\n🎉 The fix works! You can now upload audio files via the web interface!")
        else:
            print(f"❌ Failed: {response.status_code}")
            print(f"   Response: {response.text[:300]}")
            
except Exception as e:
    print(f"❌ Error: {e}")

print("\n" + "=" * 60)
