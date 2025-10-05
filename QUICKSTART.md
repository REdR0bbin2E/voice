# 🚀 Quick Start Guide - Echo Voice App

## ✅ Current Status

Your Echo Voice App backend is **WORKING**! Here's what's configured:

- ✅ **Fish.Audio API**: Connected and working
- ✅ **Backend Server**: Running successfully  
- ⚠️ **MongoDB**: Not yet configured (optional for now)

## 🎯 What You Can Do RIGHT NOW

### 1. Start the Backend Server

```powershell
cd backend
python api_server.py
```

You should see:
```
🚀 Starting Echo Backend API Server
📍 Server URL: http://0.0.0.0:5000
✅ Fish.Audio API: https://api.fish.audio/v1
⚠️  MongoDB: Not configured
```

**The server is working even without MongoDB!** Voice synthesis works fine.

### 2. Test the Server

Open a **new PowerShell window** and run:

```powershell
cd backend
python test_server.py
```

This will test:
- ✅ Health check
- ✅ Voice synthesis (should create audio!)
- ⚠️ Voices endpoint (might fail - that's OK)

### 3. Test Voice Synthesis Directly

```powershell
cd backend
python test_fishapi.py
```

This creates a real audio file using your Fish.Audio API!

## 📊 MongoDB Setup (Optional - for User/Echo features)

MongoDB is only needed for:
- Saving user profiles
- Storing Echo configurations  
- Conversation history

**Voice synthesis works WITHOUT MongoDB.**

### To Set Up MongoDB (5 minutes):

1. **Read the guide:**
   ```powershell
   # Open this file:
   backend/MONGODB_SETUP.md
   ```

2. **Quick steps:**
   - Go to https://www.mongodb.com/cloud/atlas/register
   - Create FREE account
   - Create FREE M0 cluster
   - Create database user + password
   - Whitelist IP: `0.0.0.0/0`
   - Copy connection string
   - Update `backend/.env`:
     ```env
     MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/echo_db?retryWrites=true&w=majority
     ```

3. **Test MongoDB:**
   ```powershell
   python test_mongodb.py
   ```

## 🐛 Troubleshooting

### "Socket error" or "WinError 10038"

**FIXED!** ✅ The server now uses `use_reloader=False` to prevent this Windows issue.

If you still see it:
1. Press CTRL+C to stop the server
2. Wait 5 seconds
3. Run `python api_server.py` again

### "Can't connect to server"

Make sure the server is running:
```powershell
# Terminal 1: Run server
cd backend
python api_server.py

# Terminal 2: Test server
cd backend
python test_server.py
```

### "MongoDB not working"

MongoDB is optional! Voice synthesis works without it. But if you want it:
1. See `backend/MONGODB_SETUP.md`
2. Make sure you replaced `<password>` in the connection string
3. Wait 2-3 minutes after creating cluster
4. Whitelist IP: 0.0.0.0/0

## 📱 Next Steps: Frontend

Once backend is running, start the frontend:

```powershell
# In the root directory
npm install
npm start
```

The frontend will connect to `http://localhost:5000` automatically.

## 🎮 API Endpoints Available

With server running on `http://localhost:5000`:

### Health Check
```
GET /health
```

### Synthesize Speech
```
POST /api/synthesize
Body: {"text": "Hello world", "format": "wav"}
```

### Get Voices (if available)
```
GET /api/voices
```

### Upload Reference Audio
```
POST /api/upload-reference
FormData: audio file + name
```

## 📝 Summary

**You're all set!** 🎉

- ✅ Fish.Audio API working
- ✅ Backend server running  
- ✅ Voice synthesis functional
- ⚠️ MongoDB optional (set up later if needed)

**To use your app:**
1. Keep backend running: `python api_server.py`
2. Start frontend: `npm start`
3. Start building features!

## 🆘 Need Help?

Run these test scripts to diagnose:
- `python test_fishapi.py` - Test Fish.Audio API
- `python test_mongodb.py` - Test MongoDB (if set up)
- `python test_server.py` - Test full server

All test scripts show clear error messages and solutions.
