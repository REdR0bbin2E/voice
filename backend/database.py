import os
import datetime
# MongoDB disabled - not needed for voice routing
# import certifi
# from pymongo import MongoClient
# from bson.Any import Any
from typing import Optional, Any
from dotenv import load_dotenv
from config import Config

# Load environment variables from .env file
load_dotenv()

class DatabaseManager:
    def __init__(self):
        """
        Initializes the database connection (DISABLED - MongoDB not needed).
        """
        print("⚠️  MongoDB disabled - database features not needed for voice routing")
        self.client = None
        self.db = None
        self.users = None
        self.echos = None
        self.messages = None
        self.voice_models = None
    
    def get_or_create_user(self, auth0_user_id: str, email: str) -> Any:
        self.messages = self.db.messages
        
        print("DatabaseManager initialized. Connection successful.")
    
    def get_or_create_user(self, auth0_id: str, email: str) -> dict:
        """
        Finds a user by their Auth0 ID. If they don't exist, creates them.
        Returns the user document.
        """
        user = self.users.find_one({"auth0_user_id": auth0_id})
        
        if user:
            return user
        else:
            new_user = {
                "auth0_user_id": auth0_id,
                "email": email,
                "created_at": datetime.datetime.now(datetime.timezone.utc)
            }
            self.users.insert_one(new_user)
            return new_user
        
    def create_echo(self, user_id: Any, name: str, persona_prompt: str, voice_model_id: str) -> dict:
        """
        Creates a new Echo document for a given user.
        """
        new_echo = {
            "user_id": user_id,
            "name": name,
            "persona_prompt": persona_prompt,
            "voice_model_id": voice_model_id,
            "created_at": datetime.datetime.now(datetime.timezone.utc)
        }
        result = self.echos.insert_one(new_echo)
        # Find and return the full document we just created
        return self.echos.find_one({"_id": result.inserted_id})
    
    def get_echo_for_user(self, user_id: Any) -> dict:
        """Retrieves the Echo associated with a given user."""
        return self.echos.find_one({"user_id": user_id})

    def add_message_to_history(self, echo_id: Any, role: str, content: str):
        """
        Adds a new message to an Echo's conversation history.
        'role' can be 'user' or 'assistant'.
        """
        new_message = {
            "echo_id": echo_id,
            "role": role,
            "content": content,
            "created_at": datetime.datetime.now(datetime.timezone.utc)
        }
        self.messages.insert_one(new_message)

    def get_message_history(self, echo_id: Any, limit: int = 10) -> list:
        """
        Retrieves the last N messages for a conversation, in chronological order.
        """
        # Find messages, sort by newest first, limit the count
        messages_cursor = self.messages.find({"echo_id": echo_id}).sort("created_at", -1).limit(limit)
        
        # Convert cursor to a list
        messages = list(messages_cursor)
        
        # Reverse the list to get chronological order (oldest to newest)
        return messages[::-1]
    
    # ========== VOICE MODEL MANAGEMENT ==========
    
    def create_voice_model(self, user_id: Any, model_id: str, name: str, 
                          audio_file_path: str, file_type: str = 'audio', 
                          echo_id: Any = None) -> dict:
        """
        Saves a voice model to the database with its associated metadata.
        
        Args:
            user_id: The Any of the user who owns this voice model
            model_id: The Fish.Audio model ID (reference_id) returned from API
            name: Display name for this voice model
            audio_file_path: Path to the reference audio/video file
            file_type: 'audio' or 'video'
            echo_id: Optional - link this voice model to a specific Echo
            
        Returns:
            The created voice model document
        """
        if not self.voice_models:
            raise RuntimeError("MongoDB not configured - cannot save voice model")
        
        new_model = {
            "user_id": user_id,
            "model_id": model_id,  # Fish.Audio model ID
            "name": name,
            "audio_file_path": audio_file_path,
            "file_type": file_type,  # 'audio' or 'video'
            "echo_id": echo_id,  # Optional: link to an Echo
            "created_at": datetime.datetime.now(datetime.timezone.utc)
        }
        
        result = self.voice_models.insert_one(new_model)
        return self.voice_models.find_one({"_id": result.inserted_id})
    
    def get_voice_model_by_id(self, model_id: str) -> dict:
        """
        Retrieves a voice model by its Fish.Audio model_id.
        
        Args:
            model_id: The Fish.Audio model ID
            
        Returns:
            The voice model document or None
        """
        if not self.voice_models:
            return None
        
        return self.voice_models.find_one({"model_id": model_id})
    
    def get_voice_models_for_user(self, user_id: Any) -> list:
        """
        Retrieves all voice models created by a specific user.
        
        Args:
            user_id: The Any of the user
            
        Returns:
            List of voice model documents
        """
        if not self.voice_models:
            return []
        
        return list(self.voice_models.find({"user_id": user_id}).sort("created_at", -1))
    
    def get_voice_model_for_echo(self, echo_id: Any) -> dict:
        """
        Retrieves the voice model associated with a specific Echo.
        
        Args:
            echo_id: The Any of the Echo
            
        Returns:
            The voice model document or None
        """
        if not self.voice_models:
            return None
        
        return self.voice_models.find_one({"echo_id": echo_id})
    
    def link_voice_model_to_echo(self, model_id: str, echo_id: Any) -> bool:
        """
        Links an existing voice model to an Echo.
        
        Args:
            model_id: The Fish.Audio model ID
            echo_id: The Any of the Echo
            
        Returns:
            True if successful, False otherwise
        """
        if not self.voice_models:
            return False
        
        result = self.voice_models.update_one(
            {"model_id": model_id},
            {"$set": {"echo_id": echo_id}}
        )
        
        return result.modified_count > 0
    
    def delete_voice_model(self, model_id: str) -> bool:
        """
        Deletes a voice model from the database.
        
        Args:
            model_id: The Fish.Audio model ID
            
        Returns:
            True if deleted, False otherwise
        """
        if not self.voice_models:
            return False
        
        result = self.voice_models.delete_one({"model_id": model_id})
        return result.deleted_count > 0
