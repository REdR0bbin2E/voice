"""
Test Fish.Audio API for voice cloning capabilities
"""
import requests
import os
from dotenv import load_dotenv

load_dotenv()

api_key = os.getenv('FISH_AUDIO_API_KEY')
base_url = "https://api.fish.audio/v1"

headers = {
    "Authorization": f"Bearer {api_key}",
    "Content-Type": "application/json"
}

print("🔍 Testing Fish.Audio voice cloning API...\n")

# Test 1: Check TTS endpoint with reference audio
print("1. Testing TTS with reference_audio parameter:")
try:
    # Try sending reference audio as base64 or file
    response = requests.post(
        f"{base_url}/tts",
        headers=headers,
        json={
            "text": "Testing voice cloning",
            "reference_audio": "test",  # This probably won't work but let's see the error
        },
        timeout=10
    )
    print(f"   Status: {response.status_code}")
    print(f"   Response: {response.text[:300]}\n")
except Exception as e:
    print(f"   Error: {e}\n")

# Test 2: OPTIONS request to see supported parameters
print("2. Checking OPTIONS for /tts endpoint:")
try:
    response = requests.options(f"{base_url}/tts", headers=headers)
    print(f"   Status: {response.status_code}")
    print(f"   Headers: {dict(response.headers)}\n")
except Exception as e:
    print(f"   Error: {e}\n")

# Test 3: Try multipart form with audio file
print("3. Testing multipart/form-data with audio:")
try:
    # Create a small test audio file
    response = requests.post(
        f"{base_url}/tts",
        headers={"Authorization": f"Bearer {api_key}"},
        data={"text": "test"},
        files={"reference_audio": ("test.wav", b"RIFF", "audio/wav")},
        timeout=10
    )
    print(f"   Status: {response.status_code}")
    print(f"   Response: {response.text[:300]}\n")
except Exception as e:
    print(f"   Error: {e}\n")

# Test 4: Check for model/voice endpoints
print("4. Looking for model/voice endpoints:")
endpoints_to_test = [
    "/models",
    "/voices",
    "/model",
    "/voice",
    "/references",
    "/reference",
    "/clone",
    "/cloning"
]

for endpoint in endpoints_to_test:
    try:
        response = requests.get(f"{base_url}{endpoint}", headers=headers, timeout=5)
        if response.status_code != 404:
            print(f"   ✅ {response.status_code} - {endpoint}")
            print(f"      {response.text[:150]}")
        else:
            print(f"   ❌ 404 - {endpoint}")
    except Exception as e:
        print(f"   ❌ Error - {endpoint}: {str(e)[:50]}")

print("\n5. Checking base API for documentation:")
try:
    response = requests.get("https://api.fish.audio/", timeout=5)
    print(f"   Status: {response.status_code}")
    if response.status_code == 200:
        print(f"   Content: {response.text[:500]}")
except Exception as e:
    print(f"   Error: {e}")
