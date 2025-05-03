# Script to install all required backend dependencies

Write-Host "Installing backend dependencies..." -ForegroundColor Green

# Check if Python is installed
try {
    $pythonVersion = python --version
    Write-Host "Found Python: $pythonVersion" -ForegroundColor Green
}
catch {
    Write-Host "Error: Python is not installed or not in PATH." -ForegroundColor Red
    Write-Host "Please install Python 3.9+ and try again." -ForegroundColor Red
    exit 1
}

# Install the backend requirements
Write-Host "Installing required Python packages..." -ForegroundColor Yellow
pip install -r backend/requirements.txt

if ($LASTEXITCODE -eq 0) {
    Write-Host "Backend dependencies installed successfully!" -ForegroundColor Green
    Write-Host "You can now run the backend with: cd backend && python main.py" -ForegroundColor Green
} else {
    Write-Host "Error installing dependencies." -ForegroundColor Red
    exit 1
}

# Create empty data and model directories if they don't exist
if (-not (Test-Path -Path "backend/data")) {
    Write-Host "Creating data directory..." -ForegroundColor Yellow
    New-Item -Path "backend/data" -ItemType Directory | Out-Null
    Write-Host "Data directory created." -ForegroundColor Green
}

if (-not (Test-Path -Path "backend/models")) {
    Write-Host "Creating models directory..." -ForegroundColor Yellow
    New-Item -Path "backend/models" -ItemType Directory | Out-Null
    Write-Host "Models directory created." -ForegroundColor Green
}

if (-not (Test-Path -Path "backend/model_report")) {
    Write-Host "Creating model_report directory..." -ForegroundColor Yellow
    New-Item -Path "backend/model_report" -ItemType Directory | Out-Null
    Write-Host "Model_report directory created." -ForegroundColor Green
}

Write-Host "Setup complete!" -ForegroundColor Green 