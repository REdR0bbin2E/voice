# 🗄️ Database Integration Guide

## Overview
The Echo backend now includes **complete database integration** for voice cloning models. This allows you to:
- 📝 Save voice model metadata to MongoDB
- 🔗 Link voice models to users and Echos
- 📊 Retrieve all voice models for a user
- 🔍 Query voice models by Echo or model_id
- 🗑️ Delete voice models from the database

## Database Schema

### Voice Models Collection
```javascript
{
  "_id": ObjectId("..."),              // MongoDB document ID
  "user_id": ObjectId("..."),          // User who created this model
  "model_id": "fish_audio_model_id",   // Fish.Audio API model ID (reference_id)
  "name": "My Custom Voice",           // Display name for the voice
  "audio_file_path": "recording.mp3",  // Original audio filename
  "file_type": "audio",                // "audio" or "video"
  "echo_id": ObjectId("..."),          // Optional: linked Echo
  "created_at": ISODate("...")         // Timestamp
}
```

### Relationships
- **User → Voice Models**: 1-to-Many (one user can have multiple voice models)
- **Echo → Voice Model**: 1-to-1 (each Echo can have one voice model)
- **Voice Model → Audio File**: 1-to-1 (each model tracks its source audio)

## API Endpoints

### 1. Upload Voice Model with Database Save
**POST** `/api/upload-reference`

Creates a voice model on Fish.Audio AND saves it to MongoDB.

**Request:**
```http
POST /api/upload-reference
Content-Type: multipart/form-data

audio: <file>                    # Required: Audio file
name: "My Voice"                 # Optional: Model name
user_id: "507f1f77bcf86cd799439011"  # Optional: User ObjectId
echo_id: "507f1f77bcf86cd799439012"  # Optional: Echo ObjectId
file_type: "audio"               # Optional: "audio" or "video"
```

**Response (with database save):**
```json
{
  "success": true,
  "model_id": "fish_audio_id_here",
  "reference_id": "fish_audio_id_here",
  "message": "Reference audio uploaded successfully and saved to database",
  "database_record": {
    "_id": "507f1f77bcf86cd799439013",
    "user_id": "507f1f77bcf86cd799439011",
    "model_id": "fish_audio_id_here",
    "name": "My Voice",
    "audio_file_path": "recording.mp3",
    "file_type": "audio",
    "echo_id": null,
    "created_at": "2024-01-15T10:30:00.000Z"
  }
}
```

**Response (without user_id - no database save):**
```json
{
  "success": true,
  "model_id": "fish_audio_id_here",
  "reference_id": "fish_audio_id_here",
  "message": "Reference audio uploaded successfully"
}
```

---

### 2. Get All Voice Models for a User
**GET** `/api/voice-models?user_id={user_id}`

Retrieves all voice models created by a specific user.

**Request:**
```http
GET /api/voice-models?user_id=507f1f77bcf86cd799439011
```

**Response:**
```json
{
  "voice_models": [
    {
      "_id": "507f1f77bcf86cd799439013",
      "user_id": "507f1f77bcf86cd799439011",
      "model_id": "fish_audio_id_1",
      "name": "My First Voice",
      "audio_file_path": "voice1.mp3",
      "file_type": "audio",
      "echo_id": null,
      "created_at": "2024-01-15T10:30:00.000Z"
    },
    {
      "_id": "507f1f77bcf86cd799439014",
      "user_id": "507f1f77bcf86cd799439011",
      "model_id": "fish_audio_id_2",
      "name": "My Second Voice",
      "audio_file_path": "voice2.wav",
      "file_type": "audio",
      "echo_id": "507f1f77bcf86cd799439012",
      "created_at": "2024-01-15T11:45:00.000Z"
    }
  ],
  "count": 2
}
```

---

### 3. Get Specific Voice Model
**GET** `/api/voice-models/{model_id}`

Retrieves details for a specific voice model by its Fish.Audio model_id.

**Request:**
```http
GET /api/voice-models/fish_audio_id_1
```

**Response:**
```json
{
  "voice_model": {
    "_id": "507f1f77bcf86cd799439013",
    "user_id": "507f1f77bcf86cd799439011",
    "model_id": "fish_audio_id_1",
    "name": "My Custom Voice",
    "audio_file_path": "recording.mp3",
    "file_type": "audio",
    "echo_id": null,
    "created_at": "2024-01-15T10:30:00.000Z"
  }
}
```

---

### 4. Delete Voice Model
**DELETE** `/api/voice-models/{model_id}`

Removes a voice model from the database (does NOT delete from Fish.Audio).

**Request:**
```http
DELETE /api/voice-models/fish_audio_id_1
```

**Response:**
```json
{
  "success": true,
  "message": "Voice model deleted"
}
```

---

### 5. Get Voice Model for an Echo
**GET** `/api/echo/{echo_id}/voice-model`

Retrieves the voice model associated with a specific Echo.

**Request:**
```http
GET /api/echo/507f1f77bcf86cd799439012/voice-model
```

**Response:**
```json
{
  "voice_model": {
    "_id": "507f1f77bcf86cd799439014",
    "user_id": "507f1f77bcf86cd799439011",
    "model_id": "fish_audio_id_2",
    "name": "Echo's Voice",
    "audio_file_path": "echo_voice.mp3",
    "file_type": "audio",
    "echo_id": "507f1f77bcf86cd799439012",
    "created_at": "2024-01-15T11:45:00.000Z"
  }
}
```

---

## Database Methods (Python)

### DatabaseManager Class Methods

```python
from backend.database import DatabaseManager
from bson.objectid import ObjectId

db = DatabaseManager()

# 1. Create/Save Voice Model
voice_model = db.create_voice_model(
    user_id=ObjectId("507f1f77bcf86cd799439011"),
    model_id="fish_audio_id_here",
    name="My Custom Voice",
    audio_file_path="recording.mp3",
    file_type="audio",
    echo_id=None  # Optional
)

# 2. Get Voice Model by Fish.Audio model_id
model = db.get_voice_model_by_id("fish_audio_id_here")

# 3. Get All Voice Models for a User
user_models = db.get_voice_models_for_user(
    ObjectId("507f1f77bcf86cd799439011")
)

# 4. Get Voice Model for an Echo
echo_model = db.get_voice_model_for_echo(
    ObjectId("507f1f77bcf86cd799439012")
)

# 5. Link Voice Model to Echo
success = db.link_voice_model_to_echo(
    model_id="fish_audio_id_here",
    echo_id=ObjectId("507f1f77bcf86cd799439012")
)

# 6. Delete Voice Model
deleted = db.delete_voice_model("fish_audio_id_here")
```

---

## Complete Workflow Examples

### Example 1: Create Voice Model with Database Save

**Step 1: Upload audio file**
```bash
curl -X POST http://localhost:5000/api/upload-reference \
  -F "audio=@my_voice.mp3" \
  -F "name=My Custom Voice" \
  -F "user_id=507f1f77bcf86cd799439011"
```

**Response:**
```json
{
  "success": true,
  "model_id": "abc123xyz",
  "reference_id": "abc123xyz",
  "message": "Reference audio uploaded successfully and saved to database",
  "database_record": {
    "_id": "507f1f77bcf86cd799439013",
    "user_id": "507f1f77bcf86cd799439011",
    "model_id": "abc123xyz",
    ...
  }
}
```

**Step 2: Use the model_id to generate speech**
```bash
curl -X POST http://localhost:5000/api/synthesize \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Hello! This is my custom voice.",
    "reference_id": "abc123xyz"
  }'
```

---

### Example 2: Create Echo with Voice Model

**Step 1: Upload audio and get model_id**
```python
# (Same as Example 1)
model_id = "abc123xyz"
```

**Step 2: Create Echo linked to voice model**
```bash
curl -X POST http://localhost:5000/api/echo \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "507f1f77bcf86cd799439011",
    "name": "My Echo",
    "persona_prompt": "You are a helpful assistant.",
    "voice_model_id": "abc123xyz"
  }'
```

**Step 3: Link voice model to Echo in database**
```bash
curl -X PATCH http://localhost:5000/api/voice-models/abc123xyz \
  -H "Content-Type: application/json" \
  -d '{"echo_id": "507f1f77bcf86cd799439012"}'
```

---

### Example 3: Retrieve User's Voice Models

**Get all models for a user:**
```bash
curl http://localhost:5000/api/voice-models?user_id=507f1f77bcf86cd799439011
```

**Response:**
```json
{
  "voice_models": [
    {
      "_id": "507f1f77bcf86cd799439013",
      "model_id": "abc123xyz",
      "name": "My Custom Voice",
      ...
    },
    {
      "_id": "507f1f77bcf86cd799439014",
      "model_id": "def456uvw",
      "name": "Another Voice",
      ...
    }
  ],
  "count": 2
}
```

---

## Web Interface Usage

1. **Open the test page:** http://localhost:5000

2. **Enter User ID (optional):**
   - If you have a MongoDB user ObjectId, paste it in the "User ID" field
   - This enables database tracking

3. **Upload audio file:**
   - Click "Choose File" and select a 10-30 second audio clip
   - Click "Upload & Create Voice Model"

4. **Response will show:**
   - ✅ Voice Model Created!
   - Model ID: `abc123xyz`
   - 💾 Saved to database! (if user_id was provided)

5. **Generate speech:**
   - The model_id is auto-filled
   - Enter text and click "Generate Voice"

---

## MongoDB Configuration

### Enable Database Features

**1. Create `.env` file in `backend/` folder:**
```env
FISH_AUDIO_API_KEY=your_api_key_here
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/echo_db?retryWrites=true&w=majority
```

**2. Collections Created:**
- `users` - User accounts
- `echos` - Echo instances
- `messages` - Conversation history
- `voice_models` - Voice cloning models ✨ NEW

### Without MongoDB (Optional Mode)

If `MONGO_URI` is not configured:
- ✅ Voice cloning still works (Fish.Audio only)
- ❌ Database features disabled (no model tracking)
- ⚠️ Warning message shown on server start

---

## Benefits of Database Integration

### Before (Fish.Audio Only)
- ✅ Upload audio → Get model_id
- ❌ No tracking of who owns which model
- ❌ Can't list user's models
- ❌ Can't link models to Echos
- ❌ Lose model_id if not saved manually

### After (With Database)
- ✅ Upload audio → Get model_id → Saved to DB
- ✅ Track ownership (user_id)
- ✅ List all models for a user
- ✅ Link models to Echos
- ✅ Query models by Echo
- ✅ Persistent storage (never lose model_ids)
- ✅ Reuse models across sessions

---

## Testing the Integration

### Test 1: Upload with Database Save

**Input:**
```bash
# Create a test user first (if using MongoDB)
curl -X POST http://localhost:5000/api/users/test_user_123 \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com"}'

# Upload audio with user_id
curl -X POST http://localhost:5000/api/upload-reference \
  -F "audio=@test_audio.mp3" \
  -F "name=Test Voice" \
  -F "user_id=YOUR_USER_OBJECTID_HERE"
```

**Expected Output:**
```json
{
  "success": true,
  "model_id": "...",
  "message": "Reference audio uploaded successfully and saved to database",
  "database_record": { ... }
}
```

### Test 2: Retrieve Models

**Input:**
```bash
curl http://localhost:5000/api/voice-models?user_id=YOUR_USER_OBJECTID_HERE
```

**Expected Output:**
```json
{
  "voice_models": [ ... ],
  "count": 1
}
```

---

## Error Handling

### MongoDB Not Configured
```json
{
  "success": true,
  "model_id": "abc123xyz",
  "message": "Reference audio uploaded successfully"
  // No database_record field
}
```

### Invalid User ID
```python
# Raises: RuntimeError: MongoDB not configured - cannot save voice model
```

### Voice Model Not Found
```json
{
  "error": "Voice model not found"
}
```

---

## Next Steps

1. **Authentication Integration:**
   - Replace manual user_id with Auth0 tokens
   - Automatically extract user_id from JWT

2. **Frontend Integration:**
   - Update React Native app to use new endpoints
   - Display user's voice models in UI
   - Allow Echo creation with voice selection

3. **File Storage:**
   - Save original audio files to cloud storage (AWS S3, etc.)
   - Store full file URLs instead of just filenames

4. **Voice Model Management:**
   - Add update/edit functionality
   - Bulk delete operations
   - Voice model sharing between users

---

## Summary

✅ **What's Working:**
- Voice model creation on Fish.Audio
- Database storage of model metadata
- User → Voice Models relationship
- Echo → Voice Model linking
- Complete CRUD operations via API
- Web interface with database integration

🔧 **Configuration:**
- Requires MongoDB URI in `.env` (optional)
- Graceful degradation if DB not configured
- Fish.Audio API still works independently

📊 **Collections:**
- `voice_models` - Tracks all voice cloning models
- Links to `users` and `echos` collections

🎯 **Next Task:**
- Integrate with React Native frontend
- Add authentication layer
- Implement cloud file storage
