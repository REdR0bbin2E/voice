import requests
import os
from dotenv import load_dotenv

load_dotenv()

api_key = os.getenv('FISH_AUDIO_API_KEY')

headers = {
    "Authorization": f"Bearer {api_key}",
}

# Try the TTS endpoint that we know works
print("Testing TTS endpoint (the one that works):")
try:
    response = requests.post(
        "https://api.fish.audio/v1/tts",
        headers={**headers, "Content-Type": "application/json"},
        json={"text": "test", "format": "wav"},
        timeout=10
    )
    print(f"Status: {response.status_code}")
    print(f"Headers: {dict(response.headers)}")
    if response.status_code != 200:
        print(f"Error: {response.text[:500]}")
except Exception as e:
    print(f"Error: {e}")

# Check if there's API documentation endpoint
print("\n\nChecking for docs/schema:")
for endpoint in ["/", "/docs", "/api", "/api/docs", "/openapi.json", "/v1", "/v1/docs"]:
    try:
        url = f"https://api.fish.audio{endpoint}"
        response = requests.get(url, headers=headers, timeout=5)
        if response.status_code != 404:
            print(f"\n✅ {response.status_code} - {url}")
            print(f"Content-Type: {response.headers.get('content-type')}")
            print(f"Response: {response.text[:300]}")
    except:
        pass
