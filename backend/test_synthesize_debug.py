"""Debug script to test voice synthesis"""
from voice_service import VoiceServiceWrapper
from pathlib import Path

print("🧪 Testing voice synthesis...")

# Initialize service
service = VoiceServiceWrapper()

# Test basic synthesis
print("\n1. Testing basic synthesis (default voice)...")
result = service.synthesize(
    text="Hello! This is a test of the Echo voice system.",
    format="wav"
)

print(f"Result: {result}")
print(f"Audio path: {result['audio_path']}")

# Check file
audio_path = Path(result['audio_path'])
print(f"File exists: {audio_path.exists()}")
print(f"File size: {audio_path.stat().st_size} bytes")

# Check WAV file
import wave
try:
    with wave.open(str(audio_path), 'rb') as w:
        print(f"✅ Valid WAV file:")
        print(f"   Channels: {w.getnchannels()}")
        print(f"   Sample width: {w.getsampwidth()}")
        print(f"   Framerate: {w.getframerate()}")
        print(f"   Frames: {w.getnframes()}")
        print(f"   Duration: {w.getnframes()/w.getframerate():.2f} seconds")
except Exception as e:
    print(f"❌ Error reading WAV file: {e}")

print("\n✅ Test complete!")
