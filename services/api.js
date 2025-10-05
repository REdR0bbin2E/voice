/**
 * API Service Layer for Echo Voice Application
 * Handles all backend communication with environment-based configuration
 */

import Constants from 'expo-constants';

// Get API URL from environment configuration
const API_URL = Constants.expoConfig?.extra?.backendApiUrl || 'http://localhost:5000';

/**
 * Base fetch wrapper with error handling
 */
async function apiRequest(endpoint, options = {}) {
  const url = `${API_URL}${endpoint}`;
  
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  };

  try {
    const response = await fetch(url, { ...defaultOptions, ...options });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || `Request failed with status ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`API Request failed: ${endpoint}`, error);
    throw error;
  }
}

/**
 * User Management API
 */
export const UserAPI = {
  /**
   * Get or create a user by Auth0 ID
   */
  async getOrCreateUser(auth0Id, email) {
    return apiRequest(`/api/users/${auth0Id}`, {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  },

  /**
   * Get user by Auth0 ID
   */
  async getUser(auth0Id) {
    return apiRequest(`/api/users/${auth0Id}`);
  },
};

/**
 * Echo Management API
 */
export const EchoAPI = {
  /**
   * Create a new Echo
   */
  async createEcho(userId, name, personaPrompt, voiceModelId) {
    return apiRequest('/api/echo', {
      method: 'POST',
      body: JSON.stringify({
        user_id: userId,
        name,
        persona_prompt: personaPrompt,
        voice_model_id: voiceModelId,
      }),
    });
  },
};

/**
 * Conversation API
 */
export const ConversationAPI = {
  /**
   * Get conversation history
   */
  async getHistory(echoId, limit = 10) {
    return apiRequest(`/api/conversation/${echoId}?limit=${limit}`);
  },

  /**
   * Add message to conversation
   */
  async addMessage(echoId, role, content) {
    return apiRequest(`/api/conversation/${echoId}`, {
      method: 'POST',
      body: JSON.stringify({ role, content }),
    });
  },
};

/**
 * Voice Synthesis API
 */
export const VoiceAPI = {
  /**
   * Synthesize speech from text
   */
  async synthesize(text, options = {}) {
    return apiRequest('/api/synthesize', {
      method: 'POST',
      body: JSON.stringify({
        text,
        reference_id: options.referenceId,
        voice_id: options.voiceId,
        format: options.format || 'wav',
      }),
    });
  },

  /**
   * Get available voices
   */
  async getVoices() {
    return apiRequest('/api/voices');
  },

  /**
   * Upload reference audio for voice cloning
   */
  async uploadReference(audioFile, name) {
    const formData = new FormData();
    formData.append('audio', audioFile);
    if (name) {
      formData.append('name', name);
    }

    return apiRequest('/api/upload-reference', {
      method: 'POST',
      headers: {
        // Let browser set Content-Type with boundary for multipart
      },
      body: formData,
    });
  },
};

/**
 * Health Check
 */
export const HealthAPI = {
  async check() {
    return apiRequest('/health');
  },
};

// Default export with all APIs
export default {
  User: UserAPI,
  Echo: EchoAPI,
  Conversation: ConversationAPI,
  Voice: VoiceAPI,
  Health: HealthAPI,
};
