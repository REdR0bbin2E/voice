"""Test Fish.Audio API directly"""
import requests

print("🧪 Testing Fish.Audio API directly...")

API_KEY = "0d7e687ed6d74da6b1dbef82437367b8"

# Test 1: Without format parameter
print("\n1. Testing WITHOUT format parameter...")
response1 = requests.post(
    "https://api.fish.audio/v1/tts",
    headers={"Authorization": f"Bearer {API_KEY}"},
    json={"text": "Hello! This is a test."},
    stream=True,
    timeout=15
)
print(f"Status: {response1.status_code}")
print(f"Content-Type: {response1.headers.get('content-type')}")
print(f"Size: {len(response1.content)} bytes")

with open("outputs/test_no_format.mp3", "wb") as f:
    f.write(response1.content)
print("Saved to: outputs/test_no_format.mp3")

# Test 2: With format=wav
print("\n2. Testing WITH format='wav'...")
response2 = requests.post(
    "https://api.fish.audio/v1/tts",
    headers={"Authorization": f"Bearer {API_KEY}"},
    json={"text": "Hello! This is a test.", "format": "wav"},
    stream=True,
    timeout=15
)
print(f"Status: {response2.status_code}")
print(f"Content-Type: {response2.headers.get('content-type')}")
print(f"Size: {len(response2.content)} bytes")

with open("outputs/test_with_format.wav", "wb") as f:
    f.write(response2.content)
print("Saved to: outputs/test_with_format.wav")

# Check the WAV file
import wave
try:
    with wave.open("outputs/test_with_format.wav", 'rb') as w:
        print(f"\n✅ WAV file check:")
        print(f"   Channels: {w.getnchannels()}")
        print(f"   Sample rate: {w.getframerate()}")
        print(f"   Frames: {w.getnframes()}")
        print(f"   Duration: {w.getnframes()/w.getframerate():.2f} seconds")
except Exception as e:
    print(f"\n❌ Error: {e}")

print("\n✅ Test complete!")
print("Try playing the files:")
print("- outputs/test_no_format.mp3")
print("- outputs/test_with_format.wav")
