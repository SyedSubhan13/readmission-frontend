# Script to clean up the project by removing duplicate files and reorganizing for Vercel deployment

Write-Host "Starting project cleanup for Vercel deployment..." -ForegroundColor Green

# Verify backend folder exists
if (-not (Test-Path -Path "backend")) {
    Write-Host "Error: backend folder not found. Please run setup_backend.ps1 first." -ForegroundColor Red
    exit 1
}

# Check if original source files exist in src/api-server-template
if (Test-Path -Path "src/api-server-template") {
    Write-Host "Removing duplicated files from src/api-server-template..." -ForegroundColor Yellow
    
    # Move any data that hasn't been moved yet
    if ((Test-Path -Path "src/api-server-template/models") -and (Test-Path -Path "backend/models")) {
        Write-Host "Ensuring all model files are copied to backend..." -ForegroundColor Yellow
        Copy-Item -Path "src/api-server-template/models/*" -Destination "backend/models/" -Recurse -Force
    }
    
    if ((Test-Path -Path "src/api-server-template/data") -and (Test-Path -Path "backend/data")) {
        Write-Host "Ensuring all data files are copied to backend..." -ForegroundColor Yellow
        Copy-Item -Path "src/api-server-template/data/*" -Destination "backend/data/" -Recurse -Force
    }
    
    if ((Test-Path -Path "src/api-server-template/model_report") -and (Test-Path -Path "backend/model_report")) {
        Write-Host "Ensuring all model report files are copied to backend..." -ForegroundColor Yellow
        Copy-Item -Path "src/api-server-template/model_report/*" -Destination "backend/model_report/" -Recurse -Force
    }
    
    # Now remove the src/api-server-template directory since everything is in backend/
    Write-Host "Removing original api-server-template directory..." -ForegroundColor Yellow
    Remove-Item -Path "src/api-server-template" -Recurse -Force
    Write-Host "Original api-server-template directory removed." -ForegroundColor Green
}

# Check for duplicate files at the root level that are now in the backend folder
Write-Host "Checking for duplicate files at the root level..." -ForegroundColor Yellow

$duplicateFiles = @(
    "nginx.conf"  # Now managed differently with Vercel
)

foreach ($file in $duplicateFiles) {
    if (Test-Path -Path $file) {
        Write-Host "Moving $file to archive folder..." -ForegroundColor Yellow
        
        # Create archive directory if it doesn't exist
        if (-not (Test-Path -Path "archive")) {
            New-Item -Path "archive" -ItemType Directory | Out-Null
        }
        
        # Move the file to archive
        Move-Item -Path $file -Destination "archive/$file" -Force
        Write-Host "Moved $file to archive folder." -ForegroundColor Green
    }
}

# Clean up unnecessary Docker files as we're switching to Vercel
$dockerFiles = @(
    "Dockerfile.backend",
    "Dockerfile.frontend",
    "docker-compose.yml"
)

foreach ($file in $dockerFiles) {
    if (Test-Path -Path $file) {
        Write-Host "Moving Docker file $file to archive folder..." -ForegroundColor Yellow
        
        # Create archive directory if it doesn't exist
        if (-not (Test-Path -Path "archive")) {
            New-Item -Path "archive" -ItemType Directory | Out-Null
        }
        
        # Move the file to archive
        Move-Item -Path $file -Destination "archive/$file" -Force
        Write-Host "Moved $file to archive folder." -ForegroundColor Green
    }
}

# Create a .vercelignore file to exclude unnecessary files/directories from Vercel deployment
$vercelIgnoreContent = @"
# Vercel ignore file

# Ignore backend directory for frontend deployment
/backend/

# Ignore archive
/archive/

# Ignore Docker files
docker-compose.yml
Dockerfile*

# Ignore development files
.git/
*/__pycache__/
*.pyc

# Ignore test files
**/test_outputs/
"@

Write-Host "Creating .vercelignore file..." -ForegroundColor Yellow
$vercelIgnoreContent | Out-File -FilePath ".vercelignore" -Encoding utf8
Write-Host ".vercelignore file created." -ForegroundColor Green

# Create a separate .vercelignore file for the backend
$backendVercelIgnoreContent = @"
# Backend Vercel ignore file

# Ignore frontend files
/node_modules/
/src/
/public/
/dist/

# Ignore archive
/archive/

# Ignore Docker files
docker-compose.yml
Dockerfile*

# Ignore Git files
.git/

# Ignore test outputs
/test_outputs/
"@

Write-Host "Creating backend/.vercelignore file..." -ForegroundColor Yellow
$backendVercelIgnoreContent | Out-File -FilePath "backend/.vercelignore" -Encoding utf8
Write-Host "backend/.vercelignore file created." -ForegroundColor Green

Write-Host "Project cleanup complete!" -ForegroundColor Green
Write-Host "The project is now ready for Vercel deployment." -ForegroundColor Green
Write-Host "Frontend code is in the root directory and backend code is in the 'backend' folder." -ForegroundColor Green 