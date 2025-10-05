# 🚨 IMPORTANT: Fish Folder Issue

## The Problem

Expo Metro bundler is trying to watch the `fish/` folder, which contains Python virtual environments with permission issues. This causes the error:

```
Error: EACCES: permission denied, lstat 'C:\Users\xxsoi\Desktop\Coding\voice\fish\fish-speech\.venv\lib64'
```

## The Solution

Since you're using **Fish.Audio's paid API** instead of the local Fish Speech model, you don't need the `fish/` folder at all.

### Option 1: Delete the Fish Folder (Recommended)

1. **Close all terminals** running in the voice directory
2. **Open File Explorer** and navigate to:
   ```
   C:\Users\xxsoi\Desktop\Coding\voice
   ```
3. **Delete the `fish` folder**
   - Right-click on `fish` folder
   - Select "Delete"
   - If it asks for admin permission, click "Continue"
   - If any files are in use, close VS Code and try again

4. **Restart Expo:**
   ```powershell
   npm start
   ```

### Option 2: Move the Fish Folder

If you want to keep it as a backup:

1. **Cut** the `fish` folder (Ctrl+X in File Explorer)
2. **Paste** it somewhere else (like `C:\Users\xxsoi\Desktop\fish-backup`)
3. **Restart Expo:**
   ```powershell
   npm start
   ```

### Option 3: Force Delete with PowerShell (Admin)

Run PowerShell as **Administrator**:

```powershell
cd C:\Users\xxsoi\Desktop\Coding\voice
Remove-Item -Path fish -Recurse -Force
```

## After Deleting the Fish Folder

Your project will work perfectly without it because:

- ✅ Voice synthesis uses **Fish.Audio API** (cloud service)
- ✅ No local model needed
- ✅ No Docker needed
- ✅ No 16GB RAM needed
- ✅ Expo will start without errors

## Then Run

```powershell
npm start
```

Should work perfectly! 🎉

## Why This Happened

The `fish/` folder contains:
- Local Fish Speech model (not used)
- Python virtual environments with symlinks
- Permission-restricted files

Since we're using the **Fish.Audio cloud API**, we don't need any of this.

## Need Help?

If you can't delete it:
1. Close VS Code completely
2. Close all PowerShell terminals
3. Open File Explorer as Administrator
4. Delete the folder manually
5. Restart VS Code
6. Run `npm start`
