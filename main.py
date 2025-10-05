import os
import httpx  # pip install httpx
from typing import Optional, List, Dict
from pydantic import BaseModel
from fastapi import FastAPI
from bson.objectid import ObjectId

from database import DatabaseManager

# ------------- TTS helper (kept from your version) -------------
FISHSPEECH_URL = os.getenv("FISHSPEECH_URL", "").strip()

async def synthesize_tts(text: str, voice_model_id: str | None) -> str | None:
    """
    Calls FishSpeech TTS service. Returns an audio URL (preferred) or None on failure.
    Expected FishSpeech JSON: { "audio_url": "https://..." }
    Adjust the payload/keys to whatever Bradley exposes.
    """
    if not FISHSPEECH_URL:
        return None

    payload = {
        "text": text,
        "voice_model_id": voice_model_id or ""  # tie to user's Echo voice
    }

    try:
        async with httpx.AsyncClient(timeout=60) as client:
            r = await client.post(FISHSPEECH_URL, json=payload)
            r.raise_for_status()
            data = r.json()
            return data.get("audio_url")  # agree on this contract with Bradley
    except Exception:
        return None

# ------------- FastAPI app -------------
app = FastAPI(title="Echo API")

@app.get("/")
def health():
    return {"ok": True, "service": "echo-api"}

# ------------- DB wiring -------------
db = DatabaseManager()  # uses MONGO_URI from your .env

# ------------- Schemas -------------
class CreateEchoRequest(BaseModel):
    # use Auth0 id or email in user_id for now
    user_id: str
    name: str
    personality: str
    memory: str = ""
    voice_model_id: str = ""

class CreateEchoResponse(BaseModel):
    ok: bool
    echo_id: str

class ChatRequest(BaseModel):
    user_id: str
    echo_id: str
    message: str
    tts: bool = True

class ChatResponse(BaseModel):
    echo_id: str
    text: str
    audio_url: Optional[str] = None

# ------------- Endpoints -------------
@app.post("/create-echo", response_model=CreateEchoResponse)
async def create_echo(body: CreateEchoRequest):
    # 1) ensure user exists (Auth0 id or email)
    email = body.user_id if "@" in body.user_id else ""
    user = db.get_or_create_user(auth0_id=body.user_id, email=email)

    # 2) build persona_prompt from personality + memory (matches your db schema)
    persona_prompt = (
        f"You are {body.name}. "
        f"Traits: {body.personality}. "
        f"Memory: {body.memory}"
    )

    # 3) create echo
    echo_doc = db.create_echo(
        user_id=user["_id"],
        name=body.name,
        persona_prompt=persona_prompt,
        voice_model_id=body.voice_model_id
    )

    return CreateEchoResponse(ok=True, echo_id=str(echo_doc["_id"]))

@app.post("/chat", response_model=ChatResponse)
async def chat(req: ChatRequest):
    # verify echo belongs to user
    email = req.user_id if "@" in req.user_id else ""
    user = db.get_or_create_user(auth0_id=req.user_id, email=email)

    try:
        echo_oid = ObjectId(req.echo_id)
    except Exception:
        return ChatResponse(echo_id=req.echo_id, text="invalid echo_id", audio_url=None)

    echo_doc = db.echos.find_one({"_id": echo_oid, "user_id": user["_id"]})
    if not echo_doc:
        return ChatResponse(echo_id=req.echo_id, text="echo not found", audio_url=None)

    # record user message
    db.add_message_to_history(echo_oid, role="user", content=req.message)

    # placeholder response using stored persona_prompt (swap to Gemini later)
    system = echo_doc.get("persona_prompt", "")
    text_reply = f"{system} | I hear you said: {req.message}"

    # record assistant message
    db.add_message_to_history(echo_oid, role="assistant", content=text_reply)

    audio_url = None
    if req.tts:
        audio_url = await synthesize_tts(text_reply, echo_doc.get("voice_model_id") or "")

    return ChatResponse(echo_id=req.echo_id, text=text_reply, audio_url=audio_url)


# -------------------------------
# /create-echo and /chat using MongoDB (DatabaseManager)
# -------------------------------
from typing import Optional
from pydantic import BaseModel
from bson.objectid import ObjectId
from database import DatabaseManager

db = DatabaseManager()  # uses MONGO_URI from .env

class CreateEchoRequest(BaseModel):
    user_id: str          # Auth0 id or email
    name: str
    personality: str
    memory: str = ""
    voice_model_id: str = ""

class CreateEchoResponse(BaseModel):
    ok: bool
    echo_id: str

class ChatRequest(BaseModel):
    user_id: str
    echo_id: str
    message: str
    tts: bool = True

class ChatResponse(BaseModel):
    echo_id: str
    text: str
    audio_url: Optional[str] = None

@app.post("/create-echo", response_model=CreateEchoResponse)
async def create_echo(body: CreateEchoRequest):
    # ensure user exists (use email if provided)
    email = body.user_id if "@" in body.user_id else ""
    user = db.get_or_create_user(auth0_id=body.user_id, email=email)

    persona_prompt = (
        f"You are {body.name}. "
        f"Traits: {body.personality}. "
        f"Memory: {body.memory}"
    )

    echo_doc = db.create_echo(
        user_id=user["_id"],
        name=body.name,
        persona_prompt=persona_prompt,
        voice_model_id=body.voice_model_id,
    )

    return CreateEchoResponse(ok=True, echo_id=str(echo_doc["_id"]))

@app.post("/chat", response_model=ChatResponse)
async def chat(req: ChatRequest):
    # look up user and echo ownership
    email = req.user_id if "@" in req.user_id else ""
    user = db.get_or_create_user(auth0_id=req.user_id, email=email)

    try:
        echo_oid = ObjectId(req.echo_id)
    except Exception:
        return ChatResponse(echo_id=req.echo_id, text="invalid echo_id", audio_url=None)

    echo_doc = db.echos.find_one({"_id": echo_oid, "user_id": user["_id"]})
    if not echo_doc:
        return ChatResponse(echo_id=req.echo_id, text="echo not found", audio_url=None)

    # save user message
    db.add_message_to_history(echo_oid, role="user", content=req.message)

    # placeholder reply using stored persona_prompt (Gemini later)
    system = echo_doc.get("persona_prompt", "")
    text_reply = f"{system} | I hear you said: {req.message}"

    # save assistant message
    db.add_message_to_history(echo_oid, role="assistant", content=text_reply)

    audio_url = None
    if req.tts:
        audio_url = await synthesize_tts(text_reply, echo_doc.get("voice_model_id") or "")

    return ChatResponse(echo_id=req.echo_id, text=text_reply, audio_url=audio_url)
