"""Test API endpoint with curl"""
import requests
import json

print("🧪 Testing /api/synthesize endpoint...")

url = "http://localhost:5000/api/synthesize"
payload = {
    "text": "Hello! This is a test.",
    "format": "mp3"
}

print(f"📤 POST {url}")
print(f"📦 Payload: {json.dumps(payload, indent=2)}")

try:
    response = requests.post(url, json=payload, timeout=30)
    print(f"\n✅ Status: {response.status_code}")
    
    if response.headers.get('content-type', '').startswith('application/json'):
        data = response.json()
        print(f"📊 Response: {json.dumps(data, indent=2)}")
    else:
        print(f"⚠️  Non-JSON response")
        
except Exception as e:
    print(f"\n❌ Error: {e}")

print("\n" + "="*60)
print("Now testing with voice model ID...")
print("="*60)

payload2 = {
    "text": "Testing with voice model.",
    "format": "mp3",
    "reference_id": "b757b43818f74b92b4990b51a1281cba"
}

print(f"📦 Payload: {json.dumps(payload2, indent=2)}")

try:
    response2 = requests.post(url, json=payload2, timeout=30)
    print(f"\n✅ Status: {response2.status_code}")
    
    if response2.headers.get('content-type', '').startswith('application/json'):
        data2 = response2.json()
        print(f"📊 Response: {json.dumps(data2, indent=2)}")
        
except Exception as e:
    print(f"\n❌ Error: {e}")
