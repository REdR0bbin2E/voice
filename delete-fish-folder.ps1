# Force Delete Fish Folder Script
# Run this script as Administrator if needed

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "🗑️  Force Delete Fish Folder" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$fishPath = "C:\Users\xxsoi\Desktop\Coding\voice\fish"

# Check if folder exists
if (!(Test-Path $fishPath)) {
    Write-Host "✅ Fish folder already deleted!" -ForegroundColor Green
    Write-Host ""
    Write-Host "You can now run: npm start" -ForegroundColor Cyan
    exit 0
}

Write-Host "📁 Found fish folder at: $fishPath" -ForegroundColor Yellow
Write-Host ""

# Step 1: Kill any processes that might be using it
Write-Host "1️⃣ Checking for processes using the folder..." -ForegroundColor Yellow

$processes = @("python", "node", "watchman", "metro")
foreach ($proc in $processes) {
    $running = Get-Process -Name $proc -ErrorAction SilentlyContinue
    if ($running) {
        Write-Host "   Stopping $proc processes..." -ForegroundColor Gray
        Stop-Process -Name $proc -Force -ErrorAction SilentlyContinue
        Start-Sleep -Milliseconds 500
    }
}

Write-Host "   ✅ Processes checked" -ForegroundColor Green
Write-Host ""

# Step 2: Take ownership
Write-Host "2️⃣ Taking ownership of folder..." -ForegroundColor Yellow
takeown /f "$fishPath" /r /d y 2>&1 | Out-Null
Write-Host "   ✅ Ownership taken" -ForegroundColor Green
Write-Host ""

# Step 3: Grant full permissions
Write-Host "3️⃣ Granting full permissions..." -ForegroundColor Yellow
icacls "$fishPath" /grant "${env:USERNAME}:F" /t /c /q 2>&1 | Out-Null
Write-Host "   ✅ Permissions granted" -ForegroundColor Green
Write-Host ""

# Step 4: Remove attributes
Write-Host "4️⃣ Removing file attributes..." -ForegroundColor Yellow
Get-ChildItem -Path "$fishPath" -Recurse -Force -ErrorAction SilentlyContinue | ForEach-Object {
    try {
        $_.Attributes = 'Normal'
    } catch {}
}
Write-Host "   ✅ Attributes removed" -ForegroundColor Green
Write-Host ""

# Step 5: Delete folder
Write-Host "5️⃣ Deleting folder..." -ForegroundColor Yellow
Start-Sleep -Seconds 1

try {
    Remove-Item -Path "$fishPath" -Recurse -Force -ErrorAction Stop
    Write-Host "   ✅ Folder deleted successfully!" -ForegroundColor Green
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Green
    Write-Host "✅ SUCCESS! Fish folder removed!" -ForegroundColor Green
    Write-Host "========================================" -ForegroundColor Green
    Write-Host ""
    Write-Host "Next steps:" -ForegroundColor Cyan
    Write-Host "  1. Run: npm start" -ForegroundColor White
    Write-Host "  2. Your Expo app should now start without errors!" -ForegroundColor White
    Write-Host ""
}
catch {
    Write-Host "   ❌ Still locked by another process" -ForegroundColor Red
    Write-Host ""
    Write-Host "🔧 Manual solution:" -ForegroundColor Yellow
    Write-Host "   1. Close VS Code completely" -ForegroundColor White
    Write-Host "   2. Close all PowerShell/terminal windows" -ForegroundColor White
    Write-Host "   3. Open File Explorer" -ForegroundColor White
    Write-Host "   4. Navigate to: C:\Users\xxsoi\Desktop\Coding\voice" -ForegroundColor White
    Write-Host "   5. Right-click 'fish' folder → Delete" -ForegroundColor White
    Write-Host "   6. If prompted, choose 'Do this for all items' and Continue" -ForegroundColor White
    Write-Host "   7. Restart VS Code and run: npm start" -ForegroundColor White
    Write-Host ""
}
