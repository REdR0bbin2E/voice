import requests
import os
from dotenv import load_dotenv

load_dotenv()

api_key = os.getenv('FISH_AUDIO_API_KEY')
print(f"API Key: {api_key[:20]}..." if api_key else "No API key found")

# Test different possible endpoints
base_urls = [
    "https://api.fish.audio/v1",
    "https://api.fish.audio",
]

endpoints = [
    "/voices",
    "/models",
    "/v1/models",
    "/tts/models"
]

headers = {
    "Authorization": f"Bearer {api_key}",
    "Content-Type": "application/json"
}

print("\n🔍 Testing Fish.Audio API endpoints...\n")

for base_url in base_urls:
    for endpoint in endpoints:
        url = f"{base_url}{endpoint}"
        try:
            response = requests.get(url, headers=headers, timeout=5)
            print(f"✅ {response.status_code} - {url}")
            if response.status_code == 200:
                print(f"   Response: {response.text[:200]}...")
        except Exception as e:
            print(f"❌ Error - {url}: {str(e)[:50]}")

# Also test the main API status
print("\n🔍 Testing base API...")
try:
    response = requests.get("https://api.fish.audio/", timeout=5)
    print(f"Status: {response.status_code}")
    print(f"Response: {response.text[:500]}")
except Exception as e:
    print(f"Error: {e}")
