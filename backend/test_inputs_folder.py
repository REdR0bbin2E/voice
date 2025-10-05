"""
Test voice cloning workflow with file from backend/inputs folder
This will:
1. Upload reference audio from backend/inputs
2. Get voice model ID
3. Generate speech with the cloned voice
"""
import requests
from pathlib import Path

API_URL = "http://localhost:5000"

def test_voice_cloning():
    print("🎤 Testing Voice Cloning Workflow")
    print("=" * 60)
    
    # Use file from backend/inputs
    audio_file = Path("c:/Users/xxsoi/Desktop/Coding/voice/backend/inputs/Countdown & Encouragement 18.mp3")
    
    if not audio_file.exists():
        print(f"❌ Audio file not found: {audio_file}")
        print("   Please make sure the file exists in backend/inputs/")
        return
    
    file_size_mb = audio_file.stat().st_size / (1024 * 1024)
    print(f"\n📁 Using: {audio_file.name}")
    print(f"   Size: {file_size_mb:.2f} MB")
    
    if file_size_mb > 10:
        print(f"   ⚠️  Warning: File is large ({file_size_mb:.1f}MB)")
        print(f"   Fish.Audio may reject if audio is >270 seconds")
    
    # Step 1: Upload reference audio
    print(f"\n📤 Step 1: Uploading reference audio...")
    try:
        with open(audio_file, 'rb') as f:
            files = {'audio': (audio_file.name, f, 'audio/mpeg')}
            data = {'name': 'Countdown Voice Test'}
            
            response = requests.post(
                f"{API_URL}/api/upload-reference",
                files=files,
                data=data,
                timeout=120  # Longer timeout for upload
            )
        
        if response.status_code == 201:
            result = response.json()
            print(f"   ✅ Upload successful!")
            print(f"   Model ID: {result.get('model_id')}")
            print(f"   Reference ID: {result.get('reference_id')}")
            model_id = result.get('model_id')
        else:
            print(f"   ❌ Upload failed: {response.status_code}")
            print(f"   Error: {response.text}")
            return
    except requests.exceptions.Timeout:
        print(f"   ❌ Upload timed out - file may be too large or server is slow")
        return
    except Exception as e:
        print(f"   ❌ Error: {e}")
        return
    
    # Step 2: Generate speech with the cloned voice
    print(f"\n🎙️ Step 2: Generating speech with cloned voice...")
    try:
        payload = {
            "text": "Hello! This is a test of voice cloning with the countdown encouragement voice. The system is working perfectly now!",
            "reference_id": model_id,
            "format": "mp3"
        }
        
        response = requests.post(
            f"{API_URL}/api/synthesize",
            json=payload,
            timeout=60
        )
        
        if response.status_code == 200:
            result = response.json()
            print(f"   ✅ Voice generation successful!")
            print(f"   File: {result.get('audio_path')}")
            print(f"   Message: {result.get('message')}")
            
            # Get filename
            audio_path = result.get('audio_path', '')
            filename = audio_path.split('\\')[-1].split('/')[-1]
            
            print(f"\n🎉 SUCCESS!")
            print(f"   Generated file: backend/outputs/{filename}")
            print(f"   Using voice model: {model_id}")
        else:
            print(f"   ❌ Voice generation failed: {response.status_code}")
            print(f"   Error: {response.text}")
    except Exception as e:
        print(f"   ❌ Error: {e}")
    
    print("\n" + "=" * 60)
    print("✅ Test complete!")
    print("   Check backend/outputs/ for the generated audio file.")

if __name__ == "__main__":
    print("\n⚠️  Make sure the server is running:")
    print("   python c:\\Users\\xxsoi\\Desktop\\Coding\\voice\\backend\\api_server.py\n")
    
    try:
        test_voice_cloning()
    except Exception as e:
        print(f"❌ Test failed: {e}")
