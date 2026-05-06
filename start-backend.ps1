# AspirePath Backend Startup Script
# Automatically clears port 5000 before starting the server

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  AspirePath Backend Launcher" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

# Step 1: Free port 5001 if anything is using it
Write-Host "`n[1/2] Checking port 5001..." -ForegroundColor Yellow
$portProcess = netstat -ano | Select-String ":5001\s.*LISTENING"
if ($portProcess) {
    $processPid = ($portProcess -split '\s+')[-1].Trim()
    Write-Host "  Found process $processPid on port 5001. Stopping it..." -ForegroundColor Red
    taskkill /F /PID $processPid | Out-Null
    Start-Sleep -Seconds 2
    Write-Host "  Port 5001 is now free." -ForegroundColor Green
} else {
    Write-Host "  Port 5001 is free." -ForegroundColor Green
}

# Step 2: Start the Spring Boot server
Write-Host "`n[2/2] Starting AspirePath Backend..." -ForegroundColor Yellow
Set-Location "$PSScriptRoot\server_java"
& "d:\FSD\maven\apache-maven-3.9.5\bin\mvn.cmd" spring-boot:run
