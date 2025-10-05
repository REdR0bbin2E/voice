"""Test API endpoint directly with Python"""
import requests
import json

print("🧪 Testing /api/synthesize endpoint...")

url = "http://localhost:5000/api/synthesize"
payload = {
    "text": "Hello! This is a test of the voice system.",
    "format": "mp3"
}

print(f"\n📤 Sending request to: {url}")
print(f"📦 Payload: {json.dumps(payload, indent=2)}")

try:
    response = requests.post(url, json=payload, timeout=30)
    print(f"\n✅ Response Status: {response.status_code}")
    print(f"📄 Response Headers: {dict(response.headers)}")
    
    if response.headers.get('content-type', '').startswith('application/json'):
        data = response.json()
        print(f"📊 Response Data: {json.dumps(data, indent=2)}")
    else:
        print(f"⚠️  Non-JSON response: {response.content[:200]}")
        
except Exception as e:
    print(f"\n❌ Error: {e}")
    import traceback
    traceback.print_exc()
