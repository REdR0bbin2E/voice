"""Simple test of voice synthesis"""
import sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).parent))

from voice_service import VoiceServiceWrapper

print("🧪 Testing voice synthesis...")

service = VoiceServiceWrapper()
print("✅ Service initialized")

# Test 1: Default voice
print("\n1. Testing default voice...")
result = service.synthesize(
    text="Hello! This is a test.",
    format="mp3"
)
print(f"Result: {result}")

# Check file
if result.get('audio_path'):
    path = Path(result['audio_path'])
    print(f"File exists: {path.exists()}")
    print(f"File size: {path.stat().st_size if path.exists() else 0} bytes")

print("\n✅ Test complete!")
