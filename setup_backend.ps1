# Script to copy necessary files from src/api-server-template to the backend folder
# This script helps organize the project for Vercel deployment

# Create necessary directories if they don't exist
if (-not (Test-Path -Path "backend/models")) {
    New-Item -Path "backend/models" -ItemType Directory
}

if (-not (Test-Path -Path "backend/data")) {
    New-Item -Path "backend/data" -ItemType Directory
}

if (-not (Test-Path -Path "backend/model_report")) {
    New-Item -Path "backend/model_report" -ItemType Directory
}

# Copy model files
Write-Host "Copying model files..."
if (Test-Path -Path "src/api-server-template/models") {
    Copy-Item -Path "src/api-server-template/models/*" -Destination "backend/models/" -Recurse -Force
}

# Copy data files
Write-Host "Copying data files..."
if (Test-Path -Path "src/api-server-template/data") {
    Copy-Item -Path "src/api-server-template/data/*" -Destination "backend/data/" -Recurse -Force
}

# Copy model report files
Write-Host "Copying model report files..."
if (Test-Path -Path "src/api-server-template/model_report") {
    Copy-Item -Path "src/api-server-template/model_report/*" -Destination "backend/model_report/" -Recurse -Force
}

Write-Host "All files copied successfully!"
Write-Host "Backend folder structure is now set up for Vercel deployment." 