"""
Test script to verify audio upload and voice cloning functionality
This demonstrates the complete workflow:
1. Upload reference audio
2. Get voice model ID
3. Use that ID to generate speech with cloned voice
"""
import requests

API_URL = "http://localhost:5000"

def test_upload_and_clone():
    print("🧪 Testing Voice Cloning Upload Workflow\n")
    print("=" * 60)
    
    # Step 1: Upload reference audio
    print("\n📤 Step 1: Uploading reference audio...")
    audio_file_path = "C:\\Users\\xxsoi\\Desktop\\Coding\\voice\\backend\\inputs\\Countdown & Encouragement 18.mp3"
    
    with open(audio_file_path, 'rb') as f:
        files = {'audio': (audio_file_path.split('\\')[-1], f, 'audio/mpeg')}
        data = {'name': 'Test Voice Upload'}
        
        response = requests.post(
            f"{API_URL}/api/upload-reference",
            files=files,
            data=data
        )
    
    if response.status_code == 201:
        result = response.json()
        print(f"✅ Upload successful!")
        print(f"   Model ID: {result.get('model_id')}")
        print(f"   Reference ID: {result.get('reference_id')}")
        model_id = result.get('model_id')
    else:
        print(f"❌ Upload failed: {response.status_code}")
        print(f"   Error: {response.text}")
        return
    
    # Step 2: Generate speech with the cloned voice
    print(f"\n🎤 Step 2: Generating speech with cloned voice...")
    payload = {
        "text": "This is a test of the voice cloning system. My voice should sound like the uploaded audio.",
        "reference_id": model_id,
        "format": "mp3"
    }
    
    response = requests.post(
        f"{API_URL}/api/synthesize",
        json=payload
    )
    
    if response.status_code == 200:
        result = response.json()
        print(f"✅ Voice generation successful!")
        print(f"   File: {result.get('audio_path')}")
        print(f"   Message: {result.get('message')}")
    else:
        print(f"❌ Voice generation failed: {response.status_code}")
        print(f"   Error: {response.text}")
    
    print("\n" + "=" * 60)
    print("🎉 Test complete! Check the backend/outputs/ folder for the generated audio.")

if __name__ == "__main__":
    try:
        test_upload_and_clone()
    except FileNotFoundError:
        print("❌ Error: Audio file not found!")
        print("   Please make sure you have an audio file at:")
        print("   C:\\Users\\xxsoi\\Desktop\\Coding\\voice\\backend\\inputs\\Countdown & Encouragement 18.mp3")
    except Exception as e:
        print(f"❌ Error: {e}")
