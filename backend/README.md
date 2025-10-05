# Echo Backend API

Backend API server for the Echo voice application using Fish.Audio's paid API service.

## Setup

### 1. Install Dependencies

```bash
pip install -r requirements.txt
```

### 2. Configure Environment Variables

Create a `.env` file in the `backend/` directory:

```bash
cp .env.example .env
```

Then edit `.env` and add your credentials:

```env
# MongoDB Configuration
MONGO_URI=your_mongodb_connection_string_here

# Fish.Audio API Configuration (paid service)
FISH_AUDIO_API_KEY=your_fish_audio_api_key_here
FISH_AUDIO_API_URL=https://api.fish.audio/v1

# API Server Configuration
API_HOST=0.0.0.0
API_PORT=5000
```

### 3. Run the Server

```bash
python api_server.py
```

The server will start on `http://localhost:5000`

## API Endpoints

### Health Check
- `GET /health` - Check if the server is running

### Voice Synthesis
- `POST /api/synthesize` - Synthesize speech from text
- `GET /api/voices` - Get available voices
- `POST /api/upload-reference` - Upload reference audio for voice cloning

### User Management
- `GET /api/users/<auth0_id>` - Get user by Auth0 ID
- `POST /api/users/<auth0_id>` - Create user

### Echo Management
- `POST /api/echo` - Create a new Echo

### Conversation
- `GET /api/conversation/<echo_id>` - Get conversation history
- `POST /api/conversation/<echo_id>` - Add message to conversation

## Notes

- This backend uses **Fish.Audio's paid API service** instead of running the local Fish Speech model
- The `fish/` folder is ignored and not required for this setup
- All API keys should be stored in the `.env` file and never committed to git
