# Master script to set up the project for Vercel deployment

Write-Host "=======================================================" -ForegroundColor Cyan
Write-Host "   Setting up Readmission Forecasting for Vercel" -ForegroundColor Cyan
Write-Host "=======================================================" -ForegroundColor Cyan
Write-Host ""

# Step 1: Create backend folder structure and copy files
Write-Host "Step 1: Setting up backend folder structure..." -ForegroundColor Green
powershell -ExecutionPolicy Bypass -File ./setup_backend.ps1
Write-Host "Backend folder setup complete." -ForegroundColor Green
Write-Host ""

# Step 2: Clean up src/api-server-template and move files to archive
Write-Host "Step 2: Cleaning up project structure..." -ForegroundColor Green
powershell -ExecutionPolicy Bypass -File ./cleanup.ps1
Write-Host "Project structure cleanup complete." -ForegroundColor Green
Write-Host ""

# Step 3: Clean up duplicate files in src folder
Write-Host "Step 3: Cleaning up src directory..." -ForegroundColor Green
powershell -ExecutionPolicy Bypass -File ./cleanup_src.ps1
Write-Host "src directory cleanup complete." -ForegroundColor Green
Write-Host ""

# Step 4: Create Vercel deployment configuration
Write-Host "Step 4: Setting up Vercel deployment configuration..." -ForegroundColor Green
powershell -ExecutionPolicy Bypass -File ./setup_vercel.ps1
Write-Host "Vercel deployment configuration setup complete." -ForegroundColor Green
Write-Host ""

Write-Host "=======================================================" -ForegroundColor Cyan
Write-Host "   Project setup for Vercel deployment complete!" -ForegroundColor Cyan
Write-Host "=======================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. Read DEPLOYMENT_README.md for final configuration steps" -ForegroundColor Yellow
Write-Host "2. Update URLs and environment variables with your actual values" -ForegroundColor Yellow
Write-Host "3. Deploy backend and frontend to Vercel" -ForegroundColor Yellow
Write-Host "" 