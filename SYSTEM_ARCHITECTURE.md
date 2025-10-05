# 🏗️ System Architecture - Voice Model Database Integration

## Complete Data Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER INTERFACE                          │
│                                                                 │
│  ┌──────────────────┐        ┌──────────────────┐             │
│  │  Web Interface   │        │  React Native    │             │
│  │ (localhost:5000) │        │  Expo App (8081) │             │
│  └────────┬─────────┘        └────────┬─────────┘             │
│           │                            │                        │
└───────────┼────────────────────────────┼────────────────────────┘
            │                            │
            │         HTTP/REST          │
            └────────────┬───────────────┘
                         │
            ┌────────────▼─────────────┐
            │                          │
            │    Flask API Server      │
            │  (api_server.py:5000)    │
            │                          │
            └─────┬──────────────┬─────┘
                  │              │
      ┌───────────▼──┐      ┌───▼────────────┐
      │              │      │                 │
      │  Voice       │      │  Database       │
      │  Service     │      │  Manager        │
      │  (Fish.Audio)│      │  (MongoDB)      │
      │              │      │                 │
      └──────┬───────┘      └─────┬───────────┘
             │                    │
             │                    │
    ┌────────▼─────────┐   ┌─────▼──────────────┐
    │                  │   │                     │
    │  Fish.Audio API  │   │  MongoDB Database   │
    │  (Cloud TTS)     │   │  (Cloud/Local)      │
    │                  │   │                     │
    │  - Model Storage │   │  Collections:       │
    │  - TTS Engine    │   │  - users            │
    │  - Audio Export  │   │  - echos            │
    │                  │   │  - messages         │
    │                  │   │  - voice_models ⭐  │
    │                  │   │                     │
    └──────────────────┘   └─────────────────────┘
```

---

## Voice Upload & Creation Flow

```
┌──────────┐
│  Client  │
│ (Browser)│
└────┬─────┘
     │
     │ 1. Upload audio file + user_id
     │    POST /api/upload-reference
     │    FormData: {audio, name, user_id, echo_id}
     │
     ▼
┌────────────────────┐
│   Flask Server     │
│  api_server.py     │
└──────┬─────────────┘
       │
       │ 2. Save temp file
       │    temp/audio.mp3
       │
       ▼
┌─────────────────────┐
│  VoiceServiceWrapper│
│   voice_service.py  │
└──────┬──────────────┘
       │
       │ 3. Upload to Fish.Audio
       │    POST /model
       │    visibility: private
       │
       ▼
┌──────────────────┐
│  Fish.Audio API  │
│  (Cloud Service) │
└──────┬───────────┘
       │
       │ 4. Returns model_id
       │    {model_id: "abc123xyz"}
       │
       ▼
┌─────────────────────┐
│  DatabaseManager    │
│   database.py       │
└──────┬──────────────┘
       │
       │ 5. Save to MongoDB
       │    db.voice_models.insert_one({
       │      user_id: ObjectId,
       │      model_id: "abc123xyz",
       │      name: "My Voice",
       │      ...
       │    })
       │
       ▼
┌─────────────────┐
│  MongoDB Cloud  │
│  voice_models   │
└──────┬──────────┘
       │
       │ 6. Return complete response
       │
       ▼
┌────────────┐
│   Client   │
│  Response: │
│  {         │
│    model_id,│
│    database_record│
│  }         │
└────────────┘
```

---

## Voice Generation Flow (with Cloning)

```
┌──────────┐
│  Client  │
└────┬─────┘
     │
     │ 1. Request voice generation
     │    POST /api/synthesize
     │    {text, reference_id}
     │
     ▼
┌────────────────────┐
│   Flask Server     │
└──────┬─────────────┘
       │
       │ 2. Forward to Fish.Audio
       │    POST /v1/tts
       │    {text, reference_id, format: mp3}
       │
       ▼
┌──────────────────┐
│  Fish.Audio API  │
└──────┬───────────┘
       │
       │ 3. Generate speech with cloned voice
       │    Uses model_id as reference
       │
       ▼
┌─────────────────┐
│   Audio File    │
│  voice_XXX.mp3  │
│  (backend/      │
│   outputs/)     │
└──────┬──────────┘
       │
       │ 4. Return file path
       │
       ▼
┌────────────┐
│   Client   │
│  Response: │
│  {         │
│    audio_path│
│  }         │
└────────────┘
```

---

## Database Schema Relationships

```
┌──────────────────────────────────────────────────────────┐
│                     MONGODB DATABASE                     │
└──────────────────────────────────────────────────────────┘

┌─────────────────┐
│     users       │
│─────────────────│
│ _id: ObjectId   │◄──────────┐
│ auth0_user_id   │           │
│ email           │           │ 1-to-Many
│ created_at      │           │
└─────────────────┘           │
                              │
                    ┌─────────┴──────────┐
                    │                    │
          ┌─────────▼──────────┐  ┌──────▼────────────┐
          │   voice_models ⭐  │  │     echos         │
          │────────────────────│  │───────────────────│
          │ _id: ObjectId      │  │ _id: ObjectId     │
          │ user_id: ObjectId  │──┼─voice_model_id    │
          │ model_id: String   │  │ user_id: ObjectId │
          │ name: String       │  │ name: String      │
          │ audio_file_path    │  │ persona_prompt    │
          │ file_type: String  │  │ created_at        │
          │ echo_id: ObjectId  │◄─┤                   │
          │ created_at         │  └───────────────────┘
          └────────────────────┘           │
                                           │ 1-to-Many
                                           │
                                  ┌────────▼─────────┐
                                  │    messages      │
                                  │──────────────────│
                                  │ _id: ObjectId    │
                                  │ echo_id: ObjectId│
                                  │ role: String     │
                                  │ content: String  │
                                  │ created_at       │
                                  └──────────────────┘

Relationships:
• User → Voice Models:   1-to-Many (one user, many voice models)
• User → Echos:          1-to-Many (one user, many echos)
• Echo → Voice Model:    1-to-1    (one echo, one voice model)
• Echo → Messages:       1-to-Many (one echo, many messages)
```

---

## API Endpoint Map

```
┌─────────────────────────────────────────────────────────┐
│                    API ENDPOINTS                        │
└─────────────────────────────────────────────────────────┘

VOICE CLONING
├─ POST   /api/upload-reference
│  ├─ Input:  audio file, name, user_id (optional), echo_id (optional)
│  └─ Output: {model_id, reference_id, database_record}
│
└─ POST   /api/synthesize
   ├─ Input:  {text, reference_id (optional), format}
   └─ Output: {audio_path}

VOICE MODEL MANAGEMENT ⭐ NEW
├─ GET    /api/voice-models?user_id={id}
│  └─ Output: {voice_models: [...], count}
│
├─ GET    /api/voice-models/{model_id}
│  └─ Output: {voice_model: {...}}
│
├─ DELETE /api/voice-models/{model_id}
│  └─ Output: {success, message}
│
└─ GET    /api/echo/{echo_id}/voice-model
   └─ Output: {voice_model: {...}}

USER MANAGEMENT
├─ GET    /api/users/{auth0_id}
│  └─ Output: {user: {...}}
│
└─ POST   /api/users/{auth0_id}
   ├─ Input:  {email}
   └─ Output: {user: ObjectId}

ECHO MANAGEMENT
├─ POST   /api/echo
│  ├─ Input:  {user_id, name, persona_prompt, voice_model_id}
│  └─ Output: {echo: {...}}
│
└─ GET/POST /api/conversation/{echo_id}
   ├─ GET:    {messages: [...]}
   └─ POST:   {role, content}

SYSTEM
└─ GET    /health
   └─ Output: {status: "healthy"}
```

---

## File Structure

```
voice/
│
├─ backend/
│  ├─ api_server.py           ⭐ Updated (4 new endpoints)
│  ├─ database.py             ⭐ Updated (6 new methods)
│  ├─ voice_service.py        ✅ Working
│  ├─ config.py               ✅ Working
│  │
│  ├─ DATABASE_INTEGRATION.md ⭐ NEW (2000+ lines)
│  ├─ test_database_integration.py ⭐ NEW
│  │
│  ├─ templates/
│  │  └─ index.html           ⭐ Updated (user_id field)
│  │
│  └─ outputs/
│     └─ voice_XXX.mp3        (Generated audio files)
│
├─ app/                       (React Native frontend)
│  ├─ (tabs)/
│  ├─ (auth)/
│  └─ _layout.tsx
│
├─ components/
├─ constants/
│
└─ IMPLEMENTATION_COMPLETE.md ⭐ NEW (Summary)
```

---

## Component Interaction Diagram

```
┌───────────────────────────────────────────────────────────┐
│                  COMPONENT INTERACTIONS                    │
└───────────────────────────────────────────────────────────┘

┌─────────────┐
│   Client    │
│  (Browser/  │
│   Mobile)   │
└──────┬──────┘
       │
       │ HTTP Request
       │
┌──────▼────────────────────────────────────────────────────┐
│                    Flask API Server                        │
│  ┌────────────┐  ┌──────────────┐  ┌─────────────────┐   │
│  │  Routes    │  │  Validation  │  │  Error Handler  │   │
│  └─────┬──────┘  └──────┬───────┘  └────────┬────────┘   │
│        │                │                    │            │
│        └────────────────┴────────────────────┘            │
│                         │                                 │
│         ┌───────────────┴────────────────┐                │
│         │                                │                │
│  ┌──────▼───────────┐          ┌────────▼──────────┐     │
│  │ VoiceService     │          │ DatabaseManager   │     │
│  │ Wrapper          │          │                   │     │
│  └──────┬───────────┘          └────────┬──────────┘     │
└─────────┼──────────────────────────────┼────────────────┘
          │                              │
   ┌──────▼──────┐              ┌────────▼─────────┐
   │ Fish.Audio  │              │    MongoDB       │
   │    API      │              │   Collections    │
   │             │              │  ┌────────────┐  │
   │ - Models    │              │  │ users      │  │
   │ - TTS       │              │  │ echos      │  │
   │ - Export    │              │  │ messages   │  │
   │             │              │  │voice_models│⭐│
   │             │              │  └────────────┘  │
   └─────────────┘              └──────────────────┘
```

---

## Success Workflow Summary

```
┌─────────────────────────────────────────────────────────────┐
│          COMPLETE VOICE CLONING WORKFLOW                    │
└─────────────────────────────────────────────────────────────┘

Step 1: USER UPLOADS AUDIO
        │
        ├─ User provides: audio file, name, user_id
        └─ System validates: file size, format

Step 2: FISH.AUDIO PROCESSING
        │
        ├─ Upload to Fish.Audio cloud
        ├─ Create private voice model
        └─ Receive model_id: "abc123xyz"

Step 3: DATABASE SAVE
        │
        ├─ Save to voice_models collection
        ├─ Link to user_id
        └─ Store metadata (name, path, timestamp)

Step 4: RESPONSE TO USER
        │
        ├─ Return model_id
        ├─ Return database_record
        └─ Auto-fill voice ID field

Step 5: VOICE GENERATION
        │
        ├─ User enters text
        ├─ System uses model_id as reference_id
        ├─ Fish.Audio generates cloned speech
        └─ Returns MP3 audio file

Step 6: MODEL MANAGEMENT
        │
        ├─ User can query all their models
        ├─ Link models to Echos
        ├─ Reuse models across sessions
        └─ Delete unwanted models

✅ COMPLETE END-TO-END FLOW WORKING
```

---

## System Status

| Component | Status | Notes |
|-----------|--------|-------|
| Fish.Audio API | ✅ Working | MP3 format, private models |
| Voice Model Creation | ✅ Working | Upload → model_id |
| Database Integration | ✅ Complete | voice_models collection |
| API Endpoints | ✅ Complete | 4 new endpoints added |
| Web Interface | ✅ Updated | User ID field added |
| Documentation | ✅ Complete | 2500+ lines |
| Test Suite | ✅ Ready | test_database_integration.py |
| MongoDB | ⚠️ Optional | Works with/without |

---

## Integration Points

```
Frontend (React Native) → Backend (Flask) → External Services
                          │
                          ├─ Fish.Audio API (Voice Cloning)
                          │  └─ Cloud TTS + Model Storage
                          │
                          └─ MongoDB (Database)
                             └─ User data + Voice models
```

---

**Current Status:** ✅ **FULLY OPERATIONAL**

All components integrated and working together seamlessly!
