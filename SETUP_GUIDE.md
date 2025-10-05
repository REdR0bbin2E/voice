# Echo Voice App - Setup Guide

## ✅ What's Been Configured

Your project is now set up to use **Fish.Audio's paid API service** instead of the local Fish Speech model. The entire `fish/` folder is ignored and not needed.

## 📁 Files Created/Modified

### Environment Configuration Files

1. **`.env.example`** (root) - Template for frontend environment variables
2. **`backend/.env.example`** - Template for backend environment variables
3. **`.gitignore`** - Updated to ignore `fish/` folder and `.env` files

### Backend Files

1. **`backend/config.py`** - Configuration management using Fish.Audio API
2. **`backend/voice_service.py`** - Fish.Audio API client wrapper
3. **`backend/api_server.py`** - Flask API server with voice synthesis endpoints
4. **`backend/README.md`** - Backend setup instructions

### Frontend Files

1. **`app.config.js`** - Expo configuration for environment variables
2. **`services/api.js`** - API service layer for frontend

## 🚀 Setup Instructions

### 1. Backend Setup

#### Install Python Dependencies

```bash
cd backend
pip install flask flask-cors pymongo python-dotenv requests
```

#### Create Backend `.env` File

```bash
cd backend
copy .env.example .env
```

Edit `backend/.env` with your actual credentials:

```env
# MongoDB Configuration
MONGO_URI=mongodb+srv://your-username:your-password@cluster.mongodb.net/echo_db?retryWrites=true&w=majority

# Fish.Audio API Configuration
FISH_AUDIO_API_KEY=your_actual_fish_audio_api_key_here
FISH_AUDIO_API_URL=https://api.fish.audio/v1

# API Server Configuration
API_HOST=0.0.0.0
API_PORT=5000
```

#### Run the Backend

```bash
cd backend
python api_server.py
```

The server will start on `http://localhost:5000`

### 2. Frontend Setup

#### Create Root `.env` File

```bash
copy .env.example .env
```

Edit `.env` with your values:

```env
BACKEND_API_URL=http://localhost:5000
FISH_AUDIO_API_URL=https://api.fish.audio/v1
AUTH0_DOMAIN=your-auth0-domain.auth0.com
AUTH0_CLIENT_ID=your_auth0_client_id
```

#### Update app.json (if needed)

The project now uses `app.config.js` which reads from environment variables.

#### Run the Frontend

```bash
npm install
npm start
```

## 🔑 API Keys You Need

1. **Fish.Audio API Key** - Get from [fish.audio](https://fish.audio)
   - This is your PAID API key
   - Add to `backend/.env` as `FISH_AUDIO_API_KEY`

2. **MongoDB URI** - Get from [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
   - Create a free cluster
   - Get connection string
   - Add to `backend/.env` as `MONGO_URI`

3. **Auth0 Credentials** (if using authentication)
   - Domain and Client ID from Auth0 dashboard
   - Add to root `.env`

## 📡 API Endpoints

### Voice Synthesis
- `POST /api/synthesize` - Generate speech from text
  ```json
  {
    "text": "Hello world",
    "voice_id": "optional_voice_id",
    "reference_id": "optional_reference_id",
    "format": "wav"
  }
  ```

- `GET /api/voices` - Get available voices

- `POST /api/upload-reference` - Upload reference audio for voice cloning

### User Management
- `GET /api/users/<auth0_id>` - Get user
- `POST /api/users/<auth0_id>` - Create user with email

### Echo Management
- `POST /api/echo` - Create new Echo

### Conversation
- `GET /api/conversation/<echo_id>?limit=10` - Get history
- `POST /api/conversation/<echo_id>` - Add message

## 🎯 Using the API in Frontend

Import the API service:

```javascript
import API from '../services/api';

// Synthesize speech
const result = await API.Voice.synthesize("Hello world", {
  voiceId: "some-voice-id",
  format: "wav"
});

// Get available voices
const voices = await API.Voice.getVoices();

// Create user
const user = await API.User.getOrCreateUser(auth0Id, email);
```

## ⚠️ Important Notes

1. **Fish Folder is Ignored** ✅
   - The entire `fish/` directory is in `.gitignore`
   - You don't need Docker or 16GB RAM
   - Everything runs through Fish.Audio's cloud API

2. **No TypeScript Needed** ✅
   - Frontend uses JavaScript (`.js` files)
   - TypeScript is optional and only in devDependencies

3. **Environment Files Never Committed** ✅
   - All `.env` files are in `.gitignore`
   - Only `.env.example` files are committed as templates

4. **API Key is for Fish.Audio Paid Service** ✅
   - Not Hugging Face token
   - Get your key from fish.audio dashboard

## 🧪 Testing

### Test Backend Health

```bash
curl http://localhost:5000/health
```

Should return: `{"status": "healthy", "service": "echo-backend"}`

### Test Voice Synthesis

```bash
curl -X POST http://localhost:5000/api/synthesize \
  -H "Content-Type: application/json" \
  -d '{"text": "Hello world", "format": "wav"}'
```

## 📝 Next Steps

1. ✅ Get your Fish.Audio API key
2. ✅ Set up MongoDB database
3. ✅ Create `.env` files from examples
4. ✅ Run backend: `python backend/api_server.py`
5. ✅ Run frontend: `npm start`
6. ✅ Start building your Echo voice features!

## 🆘 Troubleshooting

### "FISH_AUDIO_API_KEY not found"
- Make sure you created `backend/.env`
- Check that the key is set correctly

### "Import flask could not be resolved"
- Run `pip install flask flask-cors`

### "MongoDB connection failed"
- Check your `MONGO_URI` in `backend/.env`
- Ensure IP is whitelisted in MongoDB Atlas

### Frontend can't connect to backend
- Ensure backend is running on port 5000
- Check `BACKEND_API_URL` in root `.env`
