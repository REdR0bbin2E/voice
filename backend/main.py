from fastapi import FastAPI, HTTPException, Depends, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List
import os
from bson import ObjectId
import google.generativeai as genai
from database import DatabaseManager

# Initialize FastAPI app
app = FastAPI(title="Echo API", version="1.0.0")

# Configure CORS for React Native frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize database manager
db_manager = DatabaseManager()

# Configure Gemini AI
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

# Pydantic models for request/response
class CreateEchoRequest(BaseModel):
    name: str
    personality: str
    cherished_memory: str

class ChatRequest(BaseModel):
    message: str

class ChatResponse(BaseModel):
    response: str
    echo_name: str

class EchoResponse(BaseModel):
    id: str
    name: str
    created_at: str

# Health check endpoint
@app.get("/")
async def root():
    return {"message": "Echo API is running"}

# Create Echo endpoint
@app.post("/create-echo", response_model=EchoResponse)
async def create_echo(
    auth0_id: str,
    email: str,
    echo_data: CreateEchoRequest
):
    try:
        # Get or create user
        user = db_manager.get_or_create_user(auth0_id, email)
        
        # Create persona prompt from user input
        persona_prompt = f"""You are an AI persona of {echo_data.name}. 
        Personality: {echo_data.personality}
        Cherished memory: {echo_data.cherished_memory}
        
        Respond as this person would, drawing from their personality and the memory shared. 
        Be warm, authentic, and true to their character. Keep responses conversational and personal."""
        
        # For now, we'll use a placeholder voice_model_id
        # This will be replaced when Bradley's voice cloning is ready
        voice_model_id = "placeholder_voice_model"
        
        # Create the echo
        echo = db_manager.create_echo(
            user_id=user["_id"],
            name=echo_data.name,
            persona_prompt=persona_prompt,
            voice_model_id=voice_model_id
        )
        
        return EchoResponse(
            id=str(echo["_id"]),
            name=echo["name"],
            created_at=echo["created_at"].isoformat()
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to create echo: {str(e)}")

# Chat endpoint
@app.post("/chat", response_model=ChatResponse)
async def chat(
    auth0_id: str,
    message_data: ChatRequest
):
    try:
        # Get user
        user = db_manager.users.find_one({"auth0_user_id": auth0_id})
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        
        # Get user's echo
        echo = db_manager.get_echo_for_user(user["_id"])
        if not echo:
            raise HTTPException(status_code=404, detail="No echo found for this user")
        
        # Add user message to history
        db_manager.add_message_to_history(echo["_id"], "user", message_data.message)
        
        # Get conversation history
        history = db_manager.get_message_history(echo["_id"], limit=10)
        
        # Prepare conversation context for Gemini
        conversation_context = f"{echo['persona_prompt']}\n\n"
        conversation_context += "Recent conversation:\n"
        for msg in history[-5:]:  # Last 5 messages for context
            role = "User" if msg["role"] == "user" else echo["name"]
            conversation_context += f"{role}: {msg['content']}\n"
        
        conversation_context += f"User: {message_data.message}\n"
        conversation_context += f"{echo['name']}:"
        
        # Generate response using Gemini
        model = genai.GenerativeModel('gemini-pro')
        response = model.generate_content(conversation_context)
        
        # Extract the response text
        response_text = response.text.strip()
        
        # Add assistant response to history
        db_manager.add_message_to_history(echo["_id"], "assistant", response_text)
        
        return ChatResponse(
            response=response_text,
            echo_name=echo["name"]
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Chat failed: {str(e)}")

# Get user's echo info
@app.get("/echo-info")
async def get_echo_info(auth0_id: str):
    try:
        # Get user
        user = db_manager.users.find_one({"auth0_user_id": auth0_id})
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        
        # Get user's echo
        echo = db_manager.get_echo_for_user(user["_id"])
        if not echo:
            raise HTTPException(status_code=404, detail="No echo found for this user")
        
        return {
            "id": str(echo["_id"]),
            "name": echo["name"],
            "created_at": echo["created_at"].isoformat()
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get echo info: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)