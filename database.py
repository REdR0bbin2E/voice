import os
import datetime
from pymongo import MongoClient
from bson.objectid import ObjectId
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

class DatabaseManager:
    def __init__(self):
        """
        Initializes the database connection.
        """
        mongo_uri = os.getenv("MONGO_URI")
        if not mongo_uri:
            raise Exception("MONGO_URI not found in environment variables!")
        
        # Establish the connection
        self.client = MongoClient(mongo_uri)
        
        # Select the database
        self.db = self.client['echo_db']
        
        # Get references to the collections we will use
        self.users = self.db.users
        self.echos = self.db.echos
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
        
    def create_echo(self, user_id: ObjectId, name: str, persona_prompt: str, voice_model_id: str) -> dict:
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
    
    def get_echo_for_user(self, user_id: ObjectId) -> dict:
        """Retrieves the Echo associated with a given user."""
        return self.echos.find_one({"user_id": user_id})

    def add_message_to_history(self, echo_id: ObjectId, role: str, content: str):
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

    def get_message_history(self, echo_id: ObjectId, limit: int = 10) -> list:
        """
        Retrieves the last N messages for a conversation, in chronological order.
        """
        # Find messages, sort by newest first, limit the count
        messages_cursor = self.messages.find({"echo_id": echo_id}).sort("created_at", -1).limit(limit)
        
        # Convert cursor to a list
        messages = list(messages_cursor)
        
        # Reverse the list to get chronological order (oldest to newest)
        return messages[::-1]