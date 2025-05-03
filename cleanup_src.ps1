# Script to clean up duplicate files in the src directory

Write-Host "Starting cleanup of src directory..." -ForegroundColor Green

# List of files that should only exist in the root directory
$duplicateFiles = @(
    "vite.config.ts",
    "tsconfig.node.json",
    "tsconfig.json",
    "tsconfig.app.json",
    "tailwind.config.ts",
    "requirements.txt",
    "postcss.config.js",
    "package.json",
    "package-lock.json",
    "nginx.conf",
    "index.html",
    "eslint.config.js",
    "docker-compose.yml",
    "components.json",
    "deploy.ps1",
    "bun.lockb",
    "Dockerfile.frontend",
    "Dockerfile.backend",
    "DEPLOY.md"
)

# Check each file and remove from src if it exists in root
foreach ($file in $duplicateFiles) {
    if (Test-Path -Path "src/$file") {
        Write-Host "Removing $file from src directory..." -ForegroundColor Yellow
        Remove-Item -Path "src/$file" -Force
        Write-Host "Removed $file from src directory." -ForegroundColor Green
    }
}

# Remove src/dist if it exists (should only be in root)
if (Test-Path -Path "src/dist") {
    Write-Host "Removing dist folder from src directory..." -ForegroundColor Yellow
    Remove-Item -Path "src/dist" -Recurse -Force
    Write-Host "Removed dist folder from src directory." -ForegroundColor Green
}

# Remove src/public if it duplicates root/public
if ((Test-Path -Path "src/public") -and (Test-Path -Path "public")) {
    Write-Host "Checking if src/public duplicates root/public..." -ForegroundColor Yellow
    
    # Compare directories and remove if they're the same
    $srcPublicFiles = Get-ChildItem -Path "src/public" -Recurse | Select-Object -ExpandProperty FullName
    $rootPublicFiles = Get-ChildItem -Path "public" -Recurse | Select-Object -ExpandProperty FullName
    
    if ($srcPublicFiles.Count -eq $rootPublicFiles.Count) {
        Write-Host "public directories appear to be duplicates, removing src/public..." -ForegroundColor Yellow
        Remove-Item -Path "src/public" -Recurse -Force
        Write-Host "Removed src/public directory." -ForegroundColor Green
    } else {
        Write-Host "public directories contain different files, keeping both." -ForegroundColor Yellow
    }
}

Write-Host "src directory cleanup complete!" -ForegroundColor Green 