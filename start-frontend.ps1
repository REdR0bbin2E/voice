# Echo Frontend Starter Script
# Run this to start the Expo development server

Write-Host "================================" -ForegroundColor Cyan
Write-Host "📱 Starting Echo Frontend (Expo)" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""

Set-Location -Path "$PSScriptRoot"

Write-Host "📍 Location: $PWD" -ForegroundColor Yellow
Write-Host "🌐 Metro bundler will run on: http://localhost:8081" -ForegroundColor Green
Write-Host ""
Write-Host "After starting:" -ForegroundColor Gray
Write-Host "  - Press 'w' to open in web browser" -ForegroundColor Gray
Write-Host "  - Press 'a' to open Android emulator" -ForegroundColor Gray
Write-Host "  - Press 'i' to open iOS simulator" -ForegroundColor Gray
Write-Host "  - Press 'r' to reload" -ForegroundColor Gray
Write-Host ""

npm start
