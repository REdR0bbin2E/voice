# Echo Voice App 🎙️

AI-powered voice assistant app with personality using Fish.Audio's text-to-speech API.

## ✅ Setup Complete!

All dependencies are installed and configured. You're ready to start developing!

## 🚀 Quick Start

### Option 1: Start Everything (Easiest)

Double-click or run:
```powershell
.\start-all.ps1
```

This opens both backend and frontend in separate windows.

### Option 2: Start Separately

**Backend (Terminal 1):**
```powershell
.\start-backend.ps1
# OR manually:
cd backend
python api_server.py
```

**Frontend (Terminal 2):**
```powershell
.\start-frontend.ps1
# OR manually:
npm start
```

## 📚 Documentation

- **[INSTALLATION.md](INSTALLATION.md)** - What's installed and how to run
- **[QUICKSTART.md](QUICKSTART.md)** - Quick start guide with troubleshooting
- **[SETUP_GUIDE.md](SETUP_GUIDE.md)** - Complete setup and API documentation
- **[backend/MONGODB_SETUP.md](backend/MONGODB_SETUP.md)** - MongoDB setup (optional)

## 🎯 Current Status

| Component | Status | Notes |
|-----------|--------|-------|
| **Backend** | ✅ Ready | Flask API on :5000 |
| **Fish.Audio API** | ✅ Working | Voice synthesis ready |
| **Frontend** | ✅ Ready | Expo/React Native |
| **MongoDB** | ⚠️ Optional | Not configured yet |

## 🛠️ Tech Stack

### Backend
- **Flask** - Python web framework
- **Fish.Audio API** - Text-to-speech service (paid API)
- **MongoDB** - Database (optional)
- **Python 3.13**

### Frontend
- **React Native** - Mobile framework
- **Expo** - Development platform
- **TypeScript/JavaScript** - Programming languages

## 📡 API Endpoints

- `GET /health` - Health check
- `POST /api/synthesize` - Generate speech
- `GET /api/voices` - Get available voices
- `POST /api/upload-reference` - Upload voice sample

See [SETUP_GUIDE.md](SETUP_GUIDE.md) for complete API documentation.

## 🧪 Testing

```powershell
cd backend

# Test Fish.Audio API
python test_fishapi.py

# Test MongoDB (if configured)
python test_mongodb.py

# Test running server
python test_server.py
```

## 🔑 Environment Variables

All API keys and secrets are in `.env` files (not committed to git):

- **Root `.env`** - Frontend configuration
- **`backend/.env`** - Backend configuration

See `.env.example` files for templates.

## 🆘 Need Help?

1. Check [QUICKSTART.md](QUICKSTART.md) for common issues
2. Run test scripts in `backend/` folder
3. Make sure both servers are running

## 📁 Project Structure

```
voice/
├── backend/           # Flask API server
│   ├── api_server.py  # Main server
│   ├── config.py      # Configuration
│   ├── voice_service.py # Fish.Audio client
│   └── database.py    # MongoDB (optional)
├── app/              # React Native app
│   ├── (tabs)/       # Tab navigation
│   └── _layout.tsx   # Root layout
├── services/         # Frontend API client
│   └── api.js        # Backend API wrapper
└── start-*.ps1       # Convenience scripts
```

## 🎉 You're All Set!

Run `.\start-all.ps1` to start both servers and begin developing!
