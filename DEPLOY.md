# Deployment Guide

## Prerequisites

1. Docker Desktop installed and running
2. Docker Compose installed
3. At least 4GB of free RAM
4. At least 10GB of free disk space

## Environment Setup

1. Create a `.env` file in the root directory (if not already present):
```env
# Frontend Environment Variables
VITE_API_URL=http://localhost:5000
NODE_ENV=production
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_key_here

# Backend Environment Variables
FLASK_ENV=production
FLASK_APP=app.py
MODEL_PATH=/app/models
DATA_PATH=/app/data
PYTHONPATH=/app
CORS_ORIGINS=http://localhost,http://localhost:80

# Model Configuration
MODEL_VERSION=1.0.0
DEFAULT_MODEL=lightgbm
BATCH_SIZE=32
```

## Deployment Steps

### Windows

1. Open PowerShell as Administrator
2. Navigate to the project directory:
```powershell
cd path/to/readmission-forecasting
```
3. Run the deployment script:
```powershell
./deploy.ps1
```

### Manual Deployment

If you prefer not to use the deployment script:

1. Stop any running containers:
```bash
docker-compose down
```

2. Build the images:
```bash
docker-compose build --no-cache
```

3. Start the services:
```bash
docker-compose up -d
```

## Verification

1. Check if services are running:
```bash
docker-compose ps
```

2. View logs:
```bash
docker-compose logs -f
```

3. Access the applications:
- Frontend: http://localhost:80
- Backend API: http://localhost:5000
- API Health Check: http://localhost:5000/health

## Troubleshooting

1. If the frontend can't connect to the backend:
   - Check if both containers are running: `docker-compose ps`
   - Verify network connectivity: `docker network inspect app-network`
   - Check backend logs: `docker-compose logs backend`

2. If the models aren't loading:
   - Verify model files are present in `src/api-server-template/models`
   - Check backend logs for model loading errors

3. If you need to rebuild a specific service:
```bash
docker-compose build --no-cache [service_name]
docker-compose up -d [service_name]
```

4. To reset everything and start fresh:
```bash
docker-compose down -v
docker system prune -f
./deploy.ps1
```

## Monitoring

1. Container status:
```bash
docker stats
```

2. View specific service logs:
```bash
docker-compose logs -f frontend
docker-compose logs -f backend
```

## Backup

Before deployment, backup your data:
1. Model files in `src/api-server-template/models`
2. Data files in `src/api-server-template/data`
3. Environment variables in `.env`

## Scaling (if needed)

To scale the backend service:
```bash
docker-compose up -d --scale backend=2
```

Note: Frontend scaling would require additional load balancer configuration. 