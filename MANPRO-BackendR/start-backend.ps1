# Script untuk menjalankan Backend Server
# Untuk Windows PowerShell

Write-Host "================================" -ForegroundColor Cyan
Write-Host "  MANPRO Backend Server" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""

# Cek apakah .env file ada
$envExists = Test-Path ".env"
if (-not $envExists) {
    Write-Host "ERROR: .env file tidak ditemukan!" -ForegroundColor Red
    Write-Host "Silakan buat file .env terlebih dahulu." -ForegroundColor Yellow
    Write-Host ""
    Read-Host "Press Enter to exit"
    exit 1
}

# Cek apakah node_modules ada
$modulesExist = Test-Path "node_modules"
if (-not $modulesExist) {
    Write-Host "Installing dependencies..." -ForegroundColor Yellow
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Failed to install dependencies!" -ForegroundColor Red
        Read-Host "Press Enter to exit"
        exit 1
    }
}

Write-Host "Starting server..." -ForegroundColor Green
Write-Host ""

# Start server
node server.js

# If server stops, show error message
Write-Host ""
Write-Host "================================" -ForegroundColor Red
Write-Host "  Server Stopped" -ForegroundColor Red
Write-Host "================================" -ForegroundColor Red
Write-Host ""
Write-Host "Jika ada error, cek pesan di atas." -ForegroundColor Yellow
Write-Host ""
Read-Host "Press Enter to exit"
