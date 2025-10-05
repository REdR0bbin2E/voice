export default ({ config }) => ({
  ...config,
  extra: {
    backendApiUrl: process.env.BACKEND_API_URL || 'http://localhost:5000',
    fishAudioApiUrl: process.env.FISH_AUDIO_API_URL || 'https://api.fish.audio/v1',
    auth0Domain: process.env.AUTH0_DOMAIN || '',
    auth0ClientId: process.env.AUTH0_CLIENT_ID || '',
  },
});
