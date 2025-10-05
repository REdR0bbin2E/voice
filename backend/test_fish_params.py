"""
Test different parameter names for voice cloning with Fish.Audio
"""
import requests
import os
from pathlib import Path
from dotenv import load_dotenv

load_dotenv()

api_key = os.getenv('FISH_AUDIO_API_KEY')
base_url = "https://api.fish.audio/v1"

# Get reference audio
ref_file = Path("references/Speak  English with me   Improve your English speaking with me.mp3")

if not ref_file.exists():
    print(f"❌ Reference file not found: {ref_file}")
    exit(1)

print(f"📁 Using reference: {ref_file.name}\n")

# Test different parameter names
test_params = [
    ("reference_audio", "Reference audio"),
    ("reference", "Reference"),
    ("voice_sample", "Voice sample"),
    ("audio_reference", "Audio reference"),
    ("sample_audio", "Sample audio"),
    ("clone_audio", "Clone audio"),
    ("voice", "Voice"),
]

for param_name, description in test_params:
    print(f"Testing parameter: '{param_name}' ({description})")
    
    try:
        with open(ref_file, 'rb') as f:
            files = {
                param_name: (ref_file.name, f, 'audio/mpeg')
            }
            data = {
                'text': 'Testing voice cloning with different parameters.',
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
            print(f"   Size: {len(response.content)} bytes")
            
            if response.status_code == 200:
                # Save to test
                output = Path(f"outputs/test_{param_name}.wav")
                output.write_bytes(response.content)
                print(f"   ✅ Saved to: {output}")
            else:
                print(f"   ❌ Error: {response.text[:200]}")
                
    except Exception as e:
        print(f"   ❌ Exception: {e}")
    
    print()

print("\n" + "="*60)
print("🎧 Listen to the generated files and compare them!")
print("   If they all sound the same, Fish.Audio might not support")
print("   reference-based voice cloning via API.")
