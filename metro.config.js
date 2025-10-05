// metro.config.js
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Exclude problematic directories from Metro's file watcher
// This prevents Metro from trying to crawl:
// - WSL Python venvs (with symlinks like .venv/lib64 that Windows can't stat)
// - Backend Python files
// - Docker-related directories
// - Any other non-React Native code
config.resolver.blockList = [
  // Exclude fish folder and all subfolders (if it exists)
  /fish[\/\\].*/i,
  /fish[\/\\]fish-speech[\/\\].*/i,
  /fish[\/\\]fish-speech[\/\\]\.venv[\/\\].*/i,
  
  // Exclude backend folder (Python code)
  /backend[\/\\].*/i,
  
  // Exclude Python virtual environments anywhere
  /\.venv[\/\\].*/i,
  /venv[\/\\].*/i,
  /env[\/\\].*/i,
  
  // Exclude common Python cache/build directories
  /__pycache__[\/\\].*/i,
  /\.pytest_cache[\/\\].*/i,
  /\.mypy_cache[\/\\].*/i,
  
  // Exclude Docker-related files
  /\.docker[\/\\].*/i,
  
  // Exclude other common problematic directories
  /\.git[\/\\].*/i,
  /node_modules[\/\\].*[\/\\]\.venv[\/\\].*/i,
];

// Keep watch scope tight to the React Native app only
config.watchFolders = [__dirname];

// Optional: Increase Metro's tolerance for file system errors
config.resolver.platforms = ['ios', 'android', 'web'];

module.exports = config;
