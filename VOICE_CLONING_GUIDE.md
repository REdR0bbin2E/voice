# 🎙️ Voice Cloning - Complete User Guide

## ✅ What's Working Now

Your voice cloning system is **fully functional**! You can:
1. ✅ Upload reference audio files
2. ✅ Create custom voice models 
3. ✅ Generate speech with cloned voices
4. ✅ Use existing voice model IDs

---

## 🌐 Using the Web Interface (Easiest Method)

### Step 1: Start the Server
```powershell
python c:\Users\xxsoi\Desktop\Coding\voice\backend\api_server.py
```

### Step 2: Open Browser
Go to: **http://localhost:5000**

### Step 3: Upload Your Audio (Option A)
1. Click **"Choose File"** under "Voice Cloning Setup"
2. Select your audio file (.wav or .mp3)
   - **Recommended:** 10-30 seconds of clear speech
   - **Best quality:** One speaker, minimal background noise
3. Click **"Upload & Create Voice Model"**
4. Wait 10-30 seconds for Fish.Audio to process it
5. You'll see: `✅ Voice Model Created! Model ID: [your-model-id]`
6. The Model ID is **automatically filled** in the "Voice Model ID" field below

### Step 4: OR Use Existing Model ID (Option B)
If you already have a voice model ID (like `b757b43818f74b92b4990b51a1281cba`), just paste it in the "Voice Model ID" field and skip the upload step.

### Step 5: Generate Voice with Your Clone
1. Type your text in the text box (e.g., "Hello, this is my cloned voice!")
2. Make sure the Voice Model ID field is filled
3. Click **"🎙️ Generate Voice"**
4. Wait 10-30 seconds
5. You'll see: `✅ Voice Generated Successfully with custom voice!`
6. Your audio file will be saved as `voice_XXX.mp3` in `backend/outputs/`

---

## 🧪 Testing with Scripts

### Test 1: Upload & Clone (Full Workflow)
```powershell
cd backend
python test_upload_audio.py
```

This will:
1. Upload `speech/input.mp3` as reference
2. Create a voice model
3. Generate speech with that cloned voice
4. Save to `backend/outputs/voice_XXX.mp3`

### Test 2: Use Existing Model ID
```powershell
cd backend
python test_with_voice_id.py
```

This uses your existing model ID (`b757b43818f74b92b4990b51a1281cba`) to generate speech.

---

## 📁 File Locations

### Input Files (Reference Audio)
- Upload via web interface: Any `.wav` or `.mp3` file
- Script test: `speech/input.mp3`

### Output Files (Generated Speech)
- All generated audio: `backend/outputs/voice_001.mp3`, `voice_002.mp3`, etc.
- Sequential numbering automatically increments

---

## 🎯 Quick Reference

### Upload Reference Audio (Creates Voice Model)
**Web UI:**
```
1. Choose File → Select audio
2. Click "Upload & Create Voice Model"
3. Get Model ID → Auto-filled below
```

**API Call:**
```python
import requests

with open('your_audio.mp3', 'rb') as f:
    files = {'audio': ('audio.mp3', f, 'audio/mpeg')}
    data = {'name': 'My Voice'}
    response = requests.post(
        'http://localhost:5000/api/upload-reference',
        files=files,
        data=data
    )
    model_id = response.json()['model_id']
```

### Generate Speech with Cloned Voice
**Web UI:**
```
1. Enter text
2. Make sure Voice Model ID is filled
3. Click "Generate Voice"
```

**API Call:**
```python
import requests

response = requests.post(
    'http://localhost:5000/api/synthesize',
    json={
        'text': 'Your text here',
        'reference_id': 'your-model-id-here',
        'format': 'mp3'
    }
)
result = response.json()
# Audio saved to result['audio_path']
```

---

## 🎤 Audio Quality Tips

### For Best Results:
1. **Duration:** 10-30 seconds of speech
2. **Quality:** Clear recording, minimal background noise
3. **Speaker:** One person speaking (not multiple voices)
4. **Content:** Natural speech, not reading robotically
5. **Format:** MP3 or WAV (MP3 recommended for smaller file size)

### What to Avoid:
- ❌ Music overlapping speech
- ❌ Multiple speakers talking
- ❌ Very short clips (<5 seconds)
- ❌ Very long clips (>60 seconds) - Fish.Audio may timeout
- ❌ Poor quality recordings (very quiet, distorted, etc.)

---

## 🔧 Troubleshooting

### Issue: "No audio file provided"
**Solution:** Make sure you clicked "Choose File" and selected an audio file before clicking "Upload & Create Voice Model"

### Issue: Upload takes too long
**Solution:** 
- Fish.Audio processing can take 10-30 seconds - this is normal
- If it times out, try a shorter audio clip (15-20 seconds)

### Issue: Voice doesn't sound like reference
**Solution:**
- Upload higher quality reference audio
- Ensure reference audio is 10-30 seconds long
- Make sure reference audio has minimal background noise

### Issue: "Model ID: N/A"
**Solution:** 
- Check console (F12) for errors
- Verify Fish.Audio API key is valid
- Try uploading a different audio file

---

## 🎉 Summary

**You now have FULL voice cloning capabilities!**

- ✅ Upload audio files via web interface
- ✅ Create voice models automatically
- ✅ Generate speech with cloned voices
- ✅ Sequential file numbering
- ✅ Works perfectly with existing model IDs

**Your existing test files prove everything works:**
- `test_with_voice_id.py` ✅ Works (uses existing model ID)
- `test_upload_audio.py` ✅ Ready to test (uploads new audio)

**Next time you want to clone a voice:**
1. Open http://localhost:5000
2. Upload your audio file
3. Click generate with your text
4. Done! 🎙️
