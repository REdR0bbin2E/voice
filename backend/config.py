import os
from pathlib import Path
from dotenv import load_dotenv

# Load environment variables from .env file in the backend directory
env_path = Path(__file__).parent / '.env'
load_dotenv(dotenv_path=env_path)

class Config:
    """Configuration class for backend services."""
    
    # MongoDB Configuration
    MONGO_URI = os.getenv("MONGO_URI")
    
    # Fish.Audio API Configuration (paid service)
    FISH_AUDIO_API_KEY = os.getenv("FISH_AUDIO_API_KEY")
    FISH_AUDIO_API_URL = os.getenv("FISH_AUDIO_API_URL", "https://api.fish.audio/v1")
    
    # API Server Configuration
    API_HOST = os.getenv("API_HOST", "0.0.0.0")
    API_PORT = int(os.getenv("API_PORT", 5000))
    
    @classmethod
    def validate(cls):
        """Validate required environment variables are set."""
        errors = []
        warnings = []
        
        # Check MongoDB
        if not cls.MONGO_URI or cls.MONGO_URI == "your_mongodb_connection_string_here":
            warnings.append("⚠️  MONGO_URI not configured - database features will not work")
        
        # Check Fish.Audio API Key
        if not cls.FISH_AUDIO_API_KEY or cls.FISH_AUDIO_API_KEY == "your_fish_audio_api_key_here":
            errors.append("❌ FISH_AUDIO_API_KEY is required")
        
        if warnings:
            for warning in warnings:
                print(warning)
        
        if errors:
            raise ValueError(
                "\n".join(errors) +
                f"\n\nPlease update your .env file in the backend directory.\n"
                f"You can use .env.example as a template."
            )
        
        return True

# Validate on import (optional - comment out if you want manual validation)
# Config.validate()
