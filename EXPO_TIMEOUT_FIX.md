# 🚨 CRITICAL: Expo Go iOS Timeout Fix

## Problem
When scanning the QR code with Expo Go on iOS, you get:
```
Timeout connecting to exp://10.234.127.239:8081
```

## Root Causes & Solutions

### Solution 1: Use Tunnel Mode (EASIEST - Try This First!)

Tunnel mode routes traffic through Expo's servers, bypassing network/firewall issues:

```powershell
npx expo start --tunnel
```

**Why this works:**
- Bypasses Windows Firewall
- Works across different networks
- No port forwarding needed
- Slightly slower but most reliable

**Then scan the new QR code on your phone!**

---

### Solution 2: Allow Node.js Through Windows Firewall

Your Windows Firewall might be blocking Metro from accepting connections.

**Steps:**

1. **Open Windows Defender Firewall:**
   - Press `Win + R`
   - Type `wf.msc` and press Enter

2. **Create Inbound Rule:**
   - Click "Inbound Rules" → "New Rule"
   - Select "Program" → Next
   - Browse to: `C:\Program Files\nodejs\node.exe`
   - Select "Allow the connection"
   - Check all profiles (Domain, Private, Public)
   - Name it "Node.js Metro Bundler"
   - Finish

3. **Restart Metro:**
   ```powershell
   npx expo start
   ```

---

### Solution 3: Check Same Wi-Fi Network

**Verify both devices are on the same network:**

```powershell
# On PC, check your IP:
ipconfig

# Look for "IPv4 Address" under your Wi-Fi adapter
# Should match 10.234.127.239
```

**On iPhone:**
- Settings → Wi-Fi → Tap the (i) next to your network
- IP Address should be `10.234.127.x` (same subnet)

**If on different networks:**
- Connect both to the same Wi-Fi
- Or use `--tunnel` mode

---

### Solution 4: Manually Enter URL in Expo Go

Instead of scanning QR:

1. Open **Expo Go** app on iPhone
2. Tap **"Enter URL manually"**
3. Enter: `exp://10.234.127.239:8081`
4. Tap **"Connect"**

---

### Solution 5: Use Development Build Instead

If Expo Go keeps failing:

```powershell
# Build a development client (takes 5-10 min first time)
npx expo run:ios

# Or for Android:
npx expo run:android
```

This creates a standalone development app that doesn't rely on Expo Go.

---

### Solution 6: Check Backend URL for Mobile

When your app runs on your phone, `localhost:5000` won't work!

**Update `.env` for mobile testing:**

```env
# Instead of localhost, use your PC's IP:
BACKEND_API_URL=http://10.234.127.239:5000

# Keep this for Fish.Audio:
FISH_AUDIO_API_KEY=0d7e687ed6d74da6b1dbef82437367b8
```

**Then restart Metro:**
```powershell
npx expo start -c
```

---

## Quick Troubleshooting Checklist

- [ ] **Try tunnel mode first:** `npx expo start --tunnel`
- [ ] **Check firewall:** Allow Node.js through Windows Firewall
- [ ] **Verify same Wi-Fi:** Both devices on same network
- [ ] **Update backend URL:** Use PC IP instead of localhost in `.env`
- [ ] **Clear cache:** `npx expo start -c`
- [ ] **Try manual URL:** Enter `exp://10.234.127.239:8081` in Expo Go

---

## Recommended Steps (In Order)

### 1. **FIRST: Try Tunnel Mode** ⭐
```powershell
npx expo start --tunnel
```
This will work 99% of the time!

### 2. **If tunnel is too slow, fix firewall:**
- Add Node.js to Windows Firewall (see Solution 2)
- Restart Metro: `npx expo start`

### 3. **Update backend URL for mobile:**
```powershell
# Edit .env file:
# Change: BACKEND_API_URL=http://localhost:5000
# To:     BACKEND_API_URL=http://10.234.127.239:5000

npx expo start -c
```

---

## Testing Backend from Phone

Once Expo Go connects, test if backend is accessible:

**In your app**, try calling:
```
http://10.234.127.239:5000/health
```

If it fails, you need to:
1. Start backend with `0.0.0.0` instead of `localhost`
2. Allow Python through Windows Firewall (same as Node.js steps above)

---

## Alternative: Test Web First

While debugging mobile connection:

```powershell
npx expo start --web
```

This opens in your browser at `http://localhost:8081` - perfect for UI testing!

---

## Common Error Messages

| Error | Solution |
|-------|----------|
| "Connection timeout" | Use `--tunnel` mode |
| "Could not connect to Metro" | Check Windows Firewall |
| "Network request failed" | Update backend URL to use PC IP |
| "Unable to resolve host" | Verify same Wi-Fi network |
| "ERR_CONNECTION_REFUSED" | Backend not running or firewalled |

---

## 🎯 TL;DR - Do This Now

```powershell
# 1. Start Metro with tunnel (fixes 99% of issues)
npx expo start --tunnel

# 2. Scan the NEW QR code with Expo Go on iPhone

# 3. If that works but backend fails, update .env:
#    BACKEND_API_URL=http://10.234.127.239:5000

# 4. Restart with cache clear:
npx expo start --tunnel -c
```

**That's it!** Tunnel mode should fix your connection issue immediately! 🚀
