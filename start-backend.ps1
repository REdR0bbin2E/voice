# Echo Backend Starter Script
# Run this to start the Flask API server

Write-Host "================================" -ForegroundColor Cyan
Write-Host "🚀 Starting Echo Backend Server" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""

Set-Location -Path "$PSScriptRoot\backend"

Write-Host "📍 Location: $PWD" -ForegroundColor Yellow
Write-Host "🌐 Server will run on: http://localhost:5000" -ForegroundColor Green
Write-Host ""
Write-Host "Press CTRL+C to stop the server" -ForegroundColor Gray
Write-Host ""

python api_server.py
