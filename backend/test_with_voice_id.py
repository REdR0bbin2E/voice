"""Test voice synthesis WITH voice model ID"""
import sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).parent))

from voice_service import VoiceServiceWrapper

print("🧪 Testing voice synthesis with voice model ID...")

service = VoiceServiceWrapper()

# Test with your model ID
MODEL_ID = "b757b43818f74b92b4990b51a1281cba"

print(f"\n1. Testing with voice model ID: {MODEL_ID[:20]}...")
result = service.synthesize(
    text="Hello! This is a test with a custom voice model.",
    reference_id=MODEL_ID,
    format="mp3"
)
print(f"Result: {result}")

# Check file
if result.get('audio_path'):
    path = Path(result['audio_path'])
    print(f"File exists: {path.exists()}")
    print(f"File size: {path.stat().st_size if path.exists() else 0} bytes")
    print(f"File path: {path}")

print("\n✅ Test complete! Listen to the file to check if voice is cloned.")
