"""
Voice Service Client for Fish.Audio API
Integrates Fish.Audio's paid API service for text-to-speech synthesis.
"""
import os
import requests
from pathlib import Path
from typing import Optional
from backend.config import Config


class VoiceServiceWrapper:
    """Wrapper around Fish.Audio API for text-to-speech synthesis."""
    
    def __init__(self):
        """Initialize the voice service with API configuration from environment."""
        self.api_key = Config.FISH_AUDIO_API_KEY
        self.api_url = Config.FISH_AUDIO_API_URL
        
        if not self.api_key:
            raise ValueError("FISH_AUDIO_API_KEY not found in environment variables")
        
        self.headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json"
        }
    
    def synthesize(
        self,
        text: str,
        output_path: str = None,
        reference_id: str = None,
        voice_id: str = None,
        format: str = "wav",
        **kwargs
    ) -> Path:
        """
        Synthesize speech from text using Fish.Audio API.
        
        Args:
            text: The text to synthesize
            output_path: Path to save the generated audio (optional)
            reference_id: Reference audio ID from Fish.Audio (optional)
            voice_id: Voice model ID to use (optional)
            format: Audio format (wav, mp3, etc.)
            **kwargs: Additional parameters for Fish.Audio API
            
        Returns:
            Path to the generated audio file
        """
        if output_path is None:
            # Create outputs directory if it doesn't exist
            outputs_dir = Path("outputs")
            outputs_dir.mkdir(exist_ok=True)
            output_path = outputs_dir / "generated.wav"
        else:
            output_path = Path(output_path)
            output_path.parent.mkdir(parents=True, exist_ok=True)
        
        # Prepare API request payload
        payload = {
            "text": text,
            "format": format,
            **kwargs
        }
        
        if reference_id:
            payload["reference_id"] = reference_id
        if voice_id:
            payload["voice_id"] = voice_id
        
        # Make API request to Fish.Audio
        try:
            response = requests.post(
                f"{self.api_url}/tts",
                headers=self.headers,
                json=payload,
                stream=True
            )
            response.raise_for_status()
            
            # Save audio file
            with open(output_path, 'wb') as f:
                for chunk in response.iter_content(chunk_size=8192):
                    f.write(chunk)
            
            return output_path
            
        except requests.exceptions.RequestException as e:
            raise RuntimeError(f"Fish.Audio API request failed: {str(e)}")
    
    def get_available_voices(self):
        """
        Get list of available voices from Fish.Audio API.
        
        Note: Fish.Audio API may not have a public voices endpoint.
        This returns a placeholder response.
        
        Returns:
            Dict with placeholder voice information
        """
        # Fish.Audio API doesn't seem to have a public /voices endpoint
        # Return a helpful message instead of crashing
        return {
            "message": "Fish.Audio uses reference audio for voice cloning",
            "note": "Upload your own reference audio using the upload_reference_audio() method",
            "default_voice": "System default (no reference audio)",
            "documentation": "https://fish.audio/docs"
        }
    
    def upload_reference_audio(self, audio_file_path: str, name: str = None):
        """
        Upload a reference audio file to Fish.Audio for voice cloning.
        
        Args:
            audio_file_path: Path to the audio file to upload
            name: Optional name for the reference audio
            
        Returns:
            Reference audio ID
        """
        audio_path = Path(audio_file_path)
        if not audio_path.exists():
            raise FileNotFoundError(f"Audio file not found: {audio_file_path}")
        
        files = {
            'audio': (audio_path.name, open(audio_path, 'rb'), 'audio/wav')
        }
        
        data = {}
        if name:
            data['name'] = name
        
        try:
            response = requests.post(
                f"{self.api_url}/references",
                headers={
                    "Authorization": f"Bearer {self.api_key}"
                },
                files=files,
                data=data
            )
            response.raise_for_status()
            result = response.json()
            return result.get('reference_id')
        except requests.exceptions.RequestException as e:
            raise RuntimeError(f"Failed to upload reference audio: {str(e)}")
