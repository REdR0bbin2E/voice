# 🚀 Expo Go - Quick Start Guide

## ✅ Metro Bundler is Running!

Your Metro bundler is healthy and ready. Now you just need to connect a device!

---

## 📱 Option 1: Physical Device with Expo Go (Easiest!)

### Steps:

1. **Download Expo Go app:**
   - iOS: App Store → Search "Expo Go"
   - Android: Google Play Store → Search "Expo Go"

2. **Make sure your phone and PC are on the same Wi-Fi network**

3. **Start the Expo dev server:**
   ```powershell
   npx expo start
   ```

4. **Scan the QR code:**
   - **iOS**: Open Camera app → Point at QR code → Tap notification
   - **Android**: Open Expo Go app → Tap "Scan QR code" → Scan the QR in terminal

### If QR scanning doesn't work:

```powershell
# Use tunnel mode (works even on different networks)
npx expo start --tunnel
```

This creates a secure tunnel through Expo's servers - slower but more reliable.

---

## 🌐 Option 2: Web (Instant Testing!)

Test in your browser immediately:

```powershell
npx expo start
# Then press 'w' when prompted
# Or run directly:
npx expo start --web
```

Your app will open at `http://localhost:8081` in your default browser.

**Note:** Web won't have all native features (haptics, etc.) but great for UI testing!

---

## 🤖 Option 3: Android Emulator

### If you have Android Studio:

1. **Open Android Studio → Device Manager → Create/Start a virtual device**

2. **Verify ADB sees it:**
   ```powershell
   adb devices
   # Should show: emulator-5554 device
   ```

3. **Launch on emulator:**
   ```powershell
   npx expo start
   # Press 'a' when prompted
   # Or:
   npx expo start --android
   ```

### First time setup (slower):
```powershell
npx expo run:android
```
This builds and installs the dev APK (~2-5 min).

---

## 🍎 Option 4: iOS Simulator (Mac Only)

If you're on macOS with Xcode installed:

```powershell
npx expo start
# Press 'i' when prompted
# Or:
npx expo start --ios
```

---

## 🔥 Quick Commands Reference

| Command | Description |
|---------|-------------|
| `npx expo start` | Start dev server (shows QR code) |
| `npx expo start --web` | Open in web browser |
| `npx expo start --tunnel` | Use tunnel (for network issues) |
| `npx expo start -c` | Clear cache and start |
| `npx expo start --android` | Launch on Android device/emulator |
| `npx expo start --ios` | Launch on iOS simulator (Mac only) |

### Interactive Commands (after `npx expo start`):
- Press `w` → Open web
- Press `a` → Open Android
- Press `i` → Open iOS
- Press `r` → Reload app
- Press `m` → Toggle menu
- Press `?` → Show all commands

---

## ⚙️ Current Configuration

Your project is configured with:
- ✅ Metro bundler: Running on port 8081
- ✅ Backend API: http://localhost:5000
- ✅ Fish.Audio API: Configured
- ✅ Environment: `.env` loaded
- ✅ Metro config: Ignoring `backend/`, `.venv/`, `fish/`

---

## 🐛 Troubleshooting

### "Can't connect to Metro"
```powershell
# Check firewall allows Node.js on port 8081
# Or use tunnel mode:
npx expo start --tunnel
```

### "No devices found"
```powershell
# For Android:
adb devices

# If empty, restart emulator or enable USB debugging on phone
```

### "QR code doesn't scan"
```powershell
# Use tunnel mode:
npx expo start --tunnel

# Or manually enter the URL in Expo Go:
# exp://10.234.127.239:8081 (shown in terminal)
```

### App won't load / blank screen
```powershell
# Clear all caches:
npx expo start -c

# Restart Metro:
# Ctrl+C to stop, then:
npx expo start
```

### Metro crashes again
```powershell
# Verify .venv is not in root:
Test-Path .venv  # Should be False

# If True, move it:
Move-Item .venv backend/.venv -Force
```

---

## 🎯 Recommended: Start with Expo Go on Your Phone

**Easiest path:**
1. Install Expo Go app on your phone
2. Connect phone to same Wi-Fi as PC
3. Run `npx expo start`
4. Scan QR code with phone camera (iOS) or Expo Go app (Android)
5. App should load in seconds!

**Fallback if Wi-Fi is problematic:**
```powershell
npx expo start --tunnel
```

---

## 📝 What You Should See

When you start Expo:
```
Starting project at C:\Users\xxsoi\Desktop\Coding\voice
Starting Metro Bundler
Waiting on http://localhost:8081

› Press a │ Open Android
› Press w │ Open web
› Press r │ Reload app
› Press m │ Toggle menu

› QR code here ▼
```

Scan the QR and your **Echo** app should launch on your device! 🎉

---

## 🔗 Next Steps After App Loads

Once the app is running on your device:

1. **Test the UI** - Navigate through tabs
2. **Test backend connection** - Verify it can reach http://localhost:5000
3. **Test voice synthesis** - Try generating audio via Fish.Audio API

If backend connection fails (common on physical devices), you may need to:
- Use your PC's local IP instead of `localhost` in `.env`
- Or run backend and frontend on the same network with proper IP configuration
