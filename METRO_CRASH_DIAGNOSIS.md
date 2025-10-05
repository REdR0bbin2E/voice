# Metro/Expo Crash - Final Diagnosis

## Summary
Even after:
- ✅ Removing `.venv` from root (moved to `backend/.venv`)
- ✅ Creating `metro.config.js` to exclude Python/backend folders
- ✅ Updating `.watchmanconfig`
- ✅ Creating `.env` file
- ✅ Deleting `fish` folder completely

Metro **still crashes immediately** after "warning: Bundler cache is empty, rebuilding".

## What We Know
- Node v22.20.0, npm 10.9.3, Expo 54.0.10
- No visible error message - just exits with code 1
- Happens in both normal and `--web` mode
- Crashes before any actual bundling occurs

## Likely Root Causes

### 1. **Node.js v22 Incompatibility** (Most Likely)
Node v22 is very new and Expo SDK 54 might not fully support it yet.

**Solution:**
```powershell
# Install Node v20 (LTS) using nvm-windows
nvm install 20
nvm use 20

# Then try again
npx expo start --clear
```

### 2. **Corrupted node_modules**
The crash happens during Metro initialization, which could indicate corrupted packages.

**Solution:**
```powershell
Remove-Item -Recurse -Force node_modules
Remove-Item package-lock.json
npm install
npx expo start --clear
```

### 3. **React Compiler Issue**
The log shows "React Compiler enabled" - this is experimental and might be unstable.

**Solution:**
Edit `app.json` or `app.config.js` and disable React Compiler:
```json
{
  "experiments": {
    "reactCompiler": false
  }
}
```

### 4. **TypeScript/Metro Build Error**
Metro might be silently failing during the TypeScript compilation phase.

**Solution:**
```powershell
# Try running TypeScript compiler separately
npx tsc --noEmit

# Check for errors
```

### 5. **Windows-Specific Metro Bug**
Metro on Windows has had issues with file system permissions and path handling.

**Solution:**
```powershell
# Try running as Administrator
# Right-click PowerShell and "Run as Administrator"
npx expo start --clear
```

## Recommended Next Steps (In Order)

### Step 1: Disable React Compiler (Quickest Test)
```powershell
# Edit app.config.js and add/modify:
```

### Step 2: Check TypeScript
```powershell
npx tsc --noEmit
```

### Step 3: Reinstall Dependencies
```powershell
Remove-Item -Recurse -Force node_modules
Remove-Item package-lock.json
npm install
```

### Step 4: Downgrade to Node v20
```powershell
nvm install 20
nvm use 20
npm install
npx expo start --clear
```

### Step 5: Try Minimal Expo App
```powershell
# Create a fresh Expo app to test if it's project-specific
cd ..
npx create-expo-app test-app
cd test-app
npx expo start
```

## Meanwhile: Backend is READY!

While we debug Expo, your **backend is fully functional**:

```powershell
cd backend
python api_server.py
```

Then open: **http://localhost:5000**

You can:
- ✅ Test all API endpoints
- ✅ Generate voice synthesis
- ✅ Verify Fish.Audio integration
- ✅ Play generated audio files

The frontend (Expo) issue is completely separate from the backend!
