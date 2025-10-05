"""
Test if Fish.Audio requires creating a voice model first
"""
import requests
import os
from pathlib import Path
from dotenv import load_dotenv

load_dotenv()

api_key = os.getenv('FISH_AUDIO_API_KEY')
base_url = "https://api.fish.audio/v1"

headers = {
    "Authorization": f"Bearer {api_key}",
    "Content-Type": "application/json"
}

print("🔍 Testing Fish.Audio API endpoints for voice models...\n")

# Test 1: Check if there's a models endpoint
print("1. GET /models")
try:
    response = requests.get(f"{base_url}/models", headers=headers, timeout=10)
    print(f"   Status: {response.status_code}")
    if response.status_code == 200:
        print(f"   Response: {response.json()}")
    else:
        print(f"   Error: {response.text[:200]}")
except Exception as e:
    print(f"   Error: {e}")

print("\n2. GET /model")
try:
    response = requests.get(f"{base_url}/model", headers=headers, timeout=10)
    print(f"   Status: {response.status_code}")
    if response.status_code == 200:
        print(f"   Response: {response.json()}")
    else:
        print(f"   Error: {response.text[:200]}")
except Exception as e:
    print(f"   Error: {e}")

# Test if we can check account/quota info
print("\n3. GET /account or /user")
for endpoint in ["/account", "/user", "/me", "/quota", "/credits"]:
    try:
        response = requests.get(f"{base_url}{endpoint}", headers=headers, timeout=5)
        if response.status_code != 404:
            print(f"   ✅ {endpoint}: Status {response.status_code}")
            if response.status_code == 200:
                print(f"      {response.text[:200]}")
    except:
        pass

# Test POST to see if we can create a voice model
print("\n4. Trying to create a voice model")
ref_file = Path("references/Speak  English with me   Improve your English speaking with me.mp3")
if ref_file.exists():
    try:
        with open(ref_file, 'rb') as f:
            files = {
                'audio': (ref_file.name, f, 'audio/mpeg')
            }
            data = {
                'name': 'Test Voice Clone',
                'description': 'Testing voice cloning'
            }
            
            for endpoint in ["/models", "/voices", "/model/create", "/voice/create"]:
                response = requests.post(
                    f"{base_url}{endpoint}",
                    headers={"Authorization": f"Bearer {api_key}"},
                    files=files,
                    data=data,
                    timeout=10
                )
                if response.status_code != 404:
                    print(f"   POST {endpoint}: Status {response.status_code}")
                    print(f"      {response.text[:200]}")
    except Exception as e:
        print(f"   Error: {e}")

print("\n" + "="*60)
print("💡 Fish.Audio might require:")
print("   1. Web UI to create voice models")
print("   2. Different API tier/plan for voice cloning")
print("   3. Pre-created voice model IDs from their website")
