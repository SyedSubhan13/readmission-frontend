# Script to start both frontend and backend development servers

Write-Host "Starting Readmission Forecasting development environment..." -ForegroundColor Green

# Create .env file with authentication disabled
$envContent = @"
# Frontend environment variables
VITE_API_URL=http://localhost:8000
# Disable authentication for development
VITE_USE_AUTH=false
# Uncomment and replace with your actual key if using Clerk authentication
# VITE_CLERK_PUBLISHABLE_KEY=your_actual_clerk_key_here
"@

Write-Host "Creating .env file..." -ForegroundColor Yellow
$envContent | Out-File -FilePath ".env" -Encoding utf8
Write-Host "Created .env file with authentication disabled." -ForegroundColor Green

# Start backend server
Write-Host "Starting backend server..." -ForegroundColor Blue
Start-Process -FilePath "powershell" -ArgumentList "-Command `"cd backend; python main.py`"" -NoNewWindow

# Wait a moment for backend to start
Write-Host "Waiting for backend to initialize..." -ForegroundColor Yellow
Start-Sleep -Seconds 2

# Start frontend development server
Write-Host "Starting frontend development server..." -ForegroundColor Blue
npm run dev

Write-Host "Development environment started." -ForegroundColor Green 