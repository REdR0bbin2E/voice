# 🎓 School Wi-Fi Connection Guide

## The Problem
Your school Wi-Fi has **client isolation** enabled, which blocks device-to-device communication. This is why:
- ✅ Metro bundler runs fine on your laptop
- ✅ QR code appears
- ❌ Your phone can't connect to `exp://10.234.127.239:8081`

## ✅ Solutions (In Order of Easiest)

### Solution 1: Use Your Phone's Hotspot (EASIEST!)

This creates a private network where both devices can talk:

1. **On your phone:**
   - Enable Personal Hotspot
   - Note the password

2. **On your laptop:**
   - Connect to your phone's hotspot Wi-Fi
   - Keep your phone connected to its own hotspot

3. **Start Metro:**
   ```powershell
   npx expo start
   ```

4. **Scan QR code with Expo Go**

**Why this works:** No client isolation on your own hotspot!

---

### Solution 2: Test in Web Browser First

While debugging mobile connection, you can develop in the browser:

```powershell
npx expo start --web
```

- Opens at `http://localhost:8081`
- Perfect for UI testing
- Backend calls will work (same machine)
- No network issues!

---

### Solution 3: Tunnel Mode (Requires Expo Account)

Tunnel routes through Expo's servers, bypassing school network:

```powershell
# First time only - login to Expo
npx expo login

# Then start with tunnel
npx expo start --tunnel
```

**Note:** Tunnel requires installing `@expo/ngrok` globally and can be slower.

---

### Solution 4: Manual URL Entry

If QR scanning fails but you have connectivity:

1. Open **Expo Go** on your phone
2. Tap **"Enter URL manually"**
3. Get the URL from Metro terminal (looks like `exp://10.234.127.239:8081`)
4. Type it in and tap **"Connect"**

---

## 🧪 Testing Connectivity

### Test 1: Web Build (No network needed)
```powershell
npx expo start --web
```
Should open browser immediately ✅

### Test 2: Can phone reach laptop?

**From your phone's browser**, try opening:
```
http://10.234.127.239:8081
```

**Results:**
- ✅ **Loads a page** → Network works, firewall might be blocking Expo
- ❌ **Timeout/error** → School Wi-Fi has client isolation (use hotspot!)

### Test 3: Backend reachable from phone?

**From your phone's browser**, try:
```
http://10.234.127.239:5000/health
```

**Results:**
- ✅ **Shows {"status": "healthy"}** → Backend accessible from phone!
- ❌ **Timeout** → Windows Firewall blocking Python (see fix below)

---

## 🔧 Windows Firewall Fix (If Needed)

If phone can't reach backend even on hotspot:

### Allow Python Through Firewall:

1. Press `Win + R`, type `wf.msc`, Enter
2. Click **"Inbound Rules"** → **"New Rule"**
3. Select **"Program"** → Next
4. Browse to Python: `C:\Users\xxsoi\AppData\Local\Programs\Python\Python3XX\python.exe`
5. Select **"Allow the connection"**
6. Check all three: Domain, Private, Public
7. Name it **"Python Flask Backend"**
8. Click Finish

### Allow Node.js Through Firewall:

Same steps but for: `C:\Program Files\nodejs\node.exe`

---

## 📱 Current Configuration

Your `.env` is now configured for mobile:

```env
BACKEND_API_URL=http://10.234.127.239:5000  # Uses PC's IP
FISH_AUDIO_API_KEY=0d7e687ed6d74da6b1dbef82437367b8
```

**Backend listens on:**
- `0.0.0.0:5000` (accepts connections from any device)

---

## 🎯 Recommended Workflow

### For Development on School Wi-Fi:

**Option A: Use Web Build**
```powershell
npx expo start --web
```
- Fast
- No network issues
- Great for UI/logic development
- Can test backend calls

**Option B: Use Phone Hotspot**
```powershell
# 1. Enable hotspot on phone
# 2. Connect laptop to phone's hotspot
# 3. Start Metro:
npx expo start

# 4. Scan QR with Expo Go
```

### For Final Testing:

Use your phone's hotspot or home Wi-Fi to test the full mobile experience.

---

## 🐛 Common Issues

| Issue | Solution |
|-------|----------|
| "Connection timeout" | Use phone hotspot OR web mode |
| "Can't connect to Metro" | School Wi-Fi blocks it - use hotspot |
| QR scan does nothing | Manually enter URL in Expo Go |
| Backend unreachable | Allow Python through Windows Firewall |
| Tunnel won't install | Use phone hotspot instead (easier) |

---

## 🚀 Quick Start (Right Now)

**Best option for school Wi-Fi:**

```powershell
# Test in web browser (works immediately!)
npx expo start --web
```

**To test on your phone:**

```powershell
# 1. Enable phone hotspot
# 2. Connect laptop to your phone's hotspot  
# 3. Run:
npx expo start

# 4. Scan QR code - should work instantly!
```

---

## 📊 What's Fixed

- ✅ Backend URL updated to use PC IP (`10.234.127.239:5000`)
- ✅ Backend configured to accept remote connections (`0.0.0.0`)
- ✅ Voice API endpoint corrected (doesn't have `/voices`)
- ✅ Metro bundler healthy
- ✅ All dependencies installed

**Only issue:** School Wi-Fi blocks device-to-device connections

**Solution:** Use phone hotspot or web mode! 🎉
