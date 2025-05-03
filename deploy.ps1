# Stop any running containers
Write-Host "Stopping running containers..." -ForegroundColor Yellow
docker-compose down

# Remove old volumes (optional - uncomment if needed)
# Write-Host "Removing old volumes..." -ForegroundColor Yellow
# docker volume rm readmission-forecasting_node_modules

# Build images
Write-Host "Building Docker images..." -ForegroundColor Green
docker-compose build --no-cache

# Start services
Write-Host "Starting services..." -ForegroundColor Green
docker-compose up -d

# Wait for services to start
Start-Sleep -Seconds 5

# Check service status
Write-Host "Checking service status..." -ForegroundColor Cyan
docker-compose ps

Write-Host "`nDeployment completed!" -ForegroundColor Green
Write-Host "Frontend: http://localhost:80" -ForegroundColor Cyan
Write-Host "Backend API: http://localhost:5000" -ForegroundColor Cyan
Write-Host "`nTo view logs: docker-compose logs -f" -ForegroundColor Yellow