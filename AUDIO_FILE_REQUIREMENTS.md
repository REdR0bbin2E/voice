# 🎤 Audio File Requirements for Voice Cloning

## ❌ Current Issue

Your `speech/input.mp3` file is **16.3 MB** (~270+ seconds) which is **TOO LONG** for Fish.Audio.

**Fish.Audio Limit:** Audio must be **LESS THAN 270 seconds** (4.5 minutes)

## ✅ Recommended Format

For **BEST results** with voice cloning:

- **Duration:** 10-30 seconds (ideal!)
- **Maximum:** Under 270 seconds (4.5 minutes) - Fish.Audio hard limit
- **File size:** Under 10 MB (approximately)
- **Format:** MP3 or WAV
- **Quality:** Clear speech, minimal background noise
- **Content:** Natural speaking (not reading robotically)

## 🛠️ How to Prepare Audio

### Option 1: Use Free Online Tool
1. Go to: https://mp3cut.net/ or https://www.onlineconverter.com/trim-audio
2. Upload your `input.mp3`
3. Select a **15-20 second** segment with clear speech
4. Download the trimmed file
5. Upload the trimmed file to the web interface

### Option 2: Use Audacity (Free Software)
1. Download Audacity: https://www.audacityteam.org/
2. Open `input.mp3` in Audacity
3. Select a 15-20 second segment (click and drag)
4. Click File → Export → Export as MP3
5. Save the trimmed file
6. Upload to web interface

### Option 3: Use Windows Built-in (Photos/Video Editor)
1. Right-click `input.mp3` → Open with → Photos
2. Click "Edit & Create" → "Trim"
3. Select a 15-20 second segment
4. Save as new file
5. Upload to web interface

### Option 4: Use FFmpeg Command Line
```powershell
# Extract 20 seconds starting from 10 seconds in
ffmpeg -i input.mp3 -ss 10 -t 20 -c copy input_short.mp3
```

## 📏 Quick File Size Guide

Approximate durations for MP3 files:

| File Size | Approximate Duration |
|-----------|---------------------|
| 0.5 MB    | ~30 seconds ✅ PERFECT |
| 1 MB      | ~60 seconds ✅ Good |
| 2 MB      | ~120 seconds ✅ OK |
| 5 MB      | ~300 seconds ❌ Too long |
| 10+ MB    | ~600+ seconds ❌ WAY too long |

Your current file: **16.3 MB** = ~1000+ seconds ❌

## 🎯 Quick Test

**Easiest method:**
1. Record yourself speaking for 15 seconds on your phone/computer
2. Save as MP3
3. Upload to http://localhost:5000
4. Done!

Example script to record yourself:
> "Hello, this is a test of my voice. I'm creating a custom voice model for text-to-speech. This should be enough audio for the system to clone my voice accurately."

(That's about 15 seconds - perfect!)

## 🧪 Test with a Short File

After you create a 15-20 second audio file:

1. Start server: `python c:\Users\xxsoi\Desktop\Coding\voice\backend\api_server.py`
2. Open browser: http://localhost:5000
3. Click "Choose File" and select your **SHORT** audio file
4. Click "Upload & Create Voice Model"
5. Wait 10-30 seconds
6. You'll get a Model ID! ✅

## 💡 Pro Tips

**Best audio quality:**
- Speak clearly and naturally
- Use a quiet room (minimal background noise)
- Don't read like a robot - be expressive
- Keep it between 15-30 seconds
- One speaker only (don't have multiple people talking)

**Common mistakes:**
- ❌ Using music tracks
- ❌ Using podcast episodes (too long)
- ❌ Using conversations (multiple voices)
- ❌ Using very short clips (<5 seconds)
- ❌ Using your 16MB file (WAY too long!)

## 🚀 Next Steps

1. **Create/trim a 15-20 second audio file**
2. **Test it works:** Should be under 1 MB
3. **Upload via web interface**
4. **Get your Model ID**
5. **Generate voices with your cloned voice!**

Your system is fully functional - you just need a shorter audio file! 🎙️
