"""
Voice Service Client for Fish.Audio API
Integrates Fish.Audio's paid API service for text-to-speech synthesis.
"""
import os
import requests
from pathlib import Path
from typing import Optional
from datetime import datetime
from config import Config


class VoiceServiceWrapper:
    """Wrapper around Fish.Audio API for text-to-speech synthesis."""
    
    def __init__(self):
        """Initialize the voice service with API configuration from environment."""
        self.api_key = Config.FISH_AUDIO_API_KEY
        self.api_url = Config.FISH_AUDIO_API_URL
        
        if not self.api_key:
            raise ValueError("FISH_AUDIO_API_KEY not found in environment variables")
        
        # Create output directory for generated audio files (absolute path)
        backend_dir = Path(__file__).parent
        self.output_dir = backend_dir / "outputs"
        self.output_dir.mkdir(exist_ok=True)
        
        self.headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json"
        }
    
    def _get_next_voice_number(self) -> int:
        """Get the next sequential voice number."""
        # Check for both .wav and .mp3 files
        voice_files = list(self.output_dir.glob("voice_*.*"))
        if not voice_files:
            return 1
        
        # Extract numbers from filenames
        numbers = []
        for f in voice_files:
            try:
                num = int(f.stem.split('_')[1])
                numbers.append(num)
            except (IndexError, ValueError):
                continue
        
        return max(numbers) + 1 if numbers else 1
    
    def synthesize(
        self,
        text: str,
        output_path: str = None,
        reference_id: str = None,
        voice_id: str = None,
        format: str = "mp3",  # Use MP3 by default (Fish.Audio's WAV export is broken)
        **kwargs
    ) -> Path:
        """
        Synthesize speech from text using Fish.Audio API.
        
        Args:
            text: The text to synthesize
            output_path: Path to save the generated audio (optional)
            reference_id: Reference audio ID from Fish.Audio (optional)
            voice_id: Voice model ID to use (optional)
            format: Audio format (mp3 recommended, wav has issues)
            **kwargs: Additional parameters for Fish.Audio API
            
        Returns:
            Path to the generated audio file
        """
        if output_path is None:
            # Generate sequential numbered filename (use MP3 extension)
            voice_num = self._get_next_voice_number()
            file_ext = "mp3" if format == "mp3" else format
            output_path = self.output_dir / f"voice_{voice_num:03d}.{file_ext}"
        else:
            output_path = Path(output_path)
            output_path.parent.mkdir(parents=True, exist_ok=True)
        
        # Prepare API request payload
        # NOTE: Don't send format parameter - Fish.Audio WAV export is broken
        # API defaults to MP3 which works correctly
        payload = {
            "text": text,
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
            
            return {
                "audio_path": str(output_path),
                "audio_url": f"/outputs/{Path(output_path).name}",
                "message": "Speech synthesized successfully"
            }
            
        except requests.exceptions.RequestException as e:
            raise RuntimeError(f"Fish.Audio API request failed: {str(e)}")
    
    def get_available_voices(self):
        """
        Get list of voice models from Fish.Audio API.
        
        Returns:
            Dict with models list
        """
        try:
            response = requests.get(
                "https://api.fish.audio/model",
                headers={
                    "Authorization": f"Bearer {self.api_key}"
                },
                timeout=10
            )
            response.raise_for_status()
            
            models = response.json()
            return {
                "models": models,
                "count": len(models) if isinstance(models, list) else 0
            }
            
        except requests.exceptions.RequestException:
            return {
                "message": "Fish.Audio voice models",
                "note": "Upload reference audio to create voice models"
            }
    
    def upload_reference_audio(self, audio_file_path: str, name: str = None):
        """
        Upload reference audio to Fish.Audio and create a voice model.
        
        Args:
            audio_file_path: Path to audio file or bytes
            name: Optional name for the voice model
            
        Returns:
            Dict with model_id (reference_id)
        """
        # Handle file path or bytes
        if isinstance(audio_file_path, (str, Path)):
            audio_path = Path(audio_file_path)
            if not audio_path.exists():
                raise FileNotFoundError(f"Audio file not found: {audio_file_path}")
            file_to_upload = audio_path
        else:
            # Save bytes to temp file
            import uuid
            temp_dir = Path("temp")
            temp_dir.mkdir(exist_ok=True)
            file_to_upload = temp_dir / f"{uuid.uuid4().hex}.wav"
            file_to_upload.write_bytes(audio_file_path)
        
        try:
            with open(file_to_upload, 'rb') as audio_file:
                files = {
                    'voices': (file_to_upload.name, audio_file, 
                              'audio/mpeg' if file_to_upload.suffix == '.mp3' else 'audio/wav')
                }
                data = {
                    'type': 'tts',
                    'train_mode': 'fast',
                    'title': name or f'Voice Model {datetime.now().strftime("%Y%m%d_%H%M%S")}',
                    'texts': 'Reference audio for voice cloning'
                }
                
                response = requests.post(
                    "https://api.fish.audio/model",
                    headers={"Authorization": f"Bearer {self.api_key}"},
                    files=files,
                    data=data,
                    timeout=60
                )
                response.raise_for_status()
                
                result = response.json()
                model_id = result.get('id') or result.get('_id')
                
                return {
                    "model_id": model_id,
                    "reference_id": model_id,
                    "message": f"Voice model created! ID: {model_id}"
                }
                
        except requests.exceptions.RequestException as e:
            raise RuntimeError(f"Failed to create voice model: {str(e)}")
        finally:
            if not isinstance(audio_file_path, (str, Path)) and file_to_upload.exists():
                file_to_upload.unlink()
