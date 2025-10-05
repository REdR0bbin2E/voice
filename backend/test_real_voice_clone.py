"""
Test real voice cloning with an actual audio file
"""
import requests
import os
from pathlib import Path
from dotenv import load_dotenv

load_dotenv()

api_key = os.getenv('FISH_AUDIO_API_KEY')
base_url = "https://api.fish.audio/v1"

# Find a reference audio file
ref_dir = Path("references")
if ref_dir.exists():
    audio_files = list(ref_dir.glob("*.mp3")) + list(ref_dir.glob("*.wav"))
    if audio_files:
        ref_file = audio_files[0]
        print(f"📁 Using reference audio: {ref_file.name}\n")
        
        # Test 1: Send with reference_audio
        print("Test 1: Sending reference_audio as multipart file")
        try:
            with open(ref_file, 'rb') as f:
                files = {
                    'reference_audio': (ref_file.name, f, 'audio/mpeg' if ref_file.suffix == '.mp3' else 'audio/wav')
                }
                data = {
                    'text': 'Hello! This is a test of voice cloning.',
                    'format': 'wav'
                }
                
                response = requests.post(
                    f"{base_url}/tts",
                    headers={"Authorization": f"Bearer {api_key}"},
                    files=files,
                    data=data,
                    timeout=30
                )
                
                print(f"   Status: {response.status_code}")
                print(f"   Content-Type: {response.headers.get('content-type')}")
                print(f"   Content-Length: {len(response.content)} bytes")
                
                if response.status_code == 200:
                    # Save the output
                    output_path = Path("outputs/test_clone.wav")
                    output_path.parent.mkdir(exist_ok=True)
                    output_path.write_bytes(response.content)
                    print(f"   ✅ Audio saved to: {output_path}")
                    print(f"   🎧 Play this file to verify voice cloning worked!")
                else:
                    print(f"   ❌ Error: {response.text}")
        except Exception as e:
            print(f"   ❌ Exception: {e}")
        
        print("\n" + "="*60 + "\n")
        
        # Test 2: WITHOUT reference_audio (for comparison)
        print("Test 2: Without reference_audio (default voice)")
        try:
            data = {
                'text': 'Hello! This is a test of voice cloning.',
                'format': 'wav'
            }
            
            response = requests.post(
                f"{base_url}/tts",
                headers={
                    "Authorization": f"Bearer {api_key}",
                    "Content-Type": "application/json"
                },
                json=data,
                timeout=30
            )
            
            print(f"   Status: {response.status_code}")
            print(f"   Content-Length: {len(response.content)} bytes")
            
            if response.status_code == 200:
                output_path = Path("outputs/test_default.wav")
                output_path.write_bytes(response.content)
                print(f"   ✅ Audio saved to: {output_path}")
                print(f"   🎧 Compare this with test_clone.wav!")
        except Exception as e:
            print(f"   ❌ Exception: {e}")
            
    else:
        print("❌ No audio files found in references/ directory")
        print("   Upload an audio file first!")
else:
    print("❌ references/ directory not found")
    print("   Upload an audio file first!")
