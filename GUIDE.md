# Deployment Guide

This guide provides detailed instructions for deploying the Readmission Forecasting System using Docker.

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Environment Setup](#environment-setup)
3. [Docker Deployment](#docker-deployment)
4. [Custom Domain Setup](#custom-domain-setup)
5. [Troubleshooting](#troubleshooting)

## Prerequisites

Before starting the deployment process, ensure you have the following installed:

- Docker Desktop (latest version)
- Docker Compose (latest version)
- Git
- A code editor (VS Code recommended)

## Environment Setup

1. **Clone the Repository**
   ```bash
   git clone <repository-url>
   cd readmission-forecasting
   ```

2. **Create Environment File**
   Create a `.env` file in the project root with the following variables:
   ```env
   VITE_CLERK_PUBLISHABLE_KEY=your_clerk_key
   MODEL_VERSION=1.0.0
   DEFAULT_MODEL=lightgbm
   BATCH_SIZE=32
   ```

3. **Verify Docker Installation**
   ```bash
   docker --version
   docker-compose --version
   ```

## Docker Deployment

### Option 1: Using Default Configuration

1. **Build and Start Containers**
   ```bash
   # Using the deployment script
   ./deploy.ps1

   # Or manually
   docker-compose up -d
   ```

2. **Verify Deployment**
   - Frontend: http://localhost:80
   - Backend API: http://localhost:5000

3. **View Logs**
   ```bash
   docker-compose logs -f
   ```

### Option 2: Using Custom Project Name

1. **Deploy with Custom Name**
   ```bash
   docker-compose -p readmission-forecasting up -d
   ```

2. **Access Services**
   - Frontend: http://localhost:80
   - Backend API: http://localhost:5000

## Custom Domain Setup

### 1. Update Hosts File

On Windows:
1. Open Notepad as Administrator
2. Open `C:\Windows\System32\drivers\etc\hosts`
3. Add the following line:
   ```
   127.0.0.1 readmission-forecasting.local
   ```

On Linux/Mac:
```bash
sudo echo "127.0.0.1 readmission-forecasting.local" >> /etc/hosts
```

### 2. Update Configuration

1. **Update nginx.conf**
   ```nginx
   server {
       listen 80;
       server_name readmission-forecasting.local;
       # ... rest of the configuration
   }
   ```

2. **Update docker-compose.yml**
   ```yaml
   environment:
     - VITE_API_URL=http://readmission-forecasting.local:5000
     - CORS_ORIGINS=http://readmission-forecasting.local,http://readmission-forecasting.local:80
   ```

3. **Redeploy**
   ```bash
   docker-compose down
   docker-compose up -d
   ```

### 3. Access Custom Domain
- Frontend: http://readmission-forecasting.local
- Backend API: http://readmission-forecasting.local:5000

## Troubleshooting

### Common Issues

1. **Port Conflicts**
   - Error: "Port already in use"
   - Solution: Stop other services using ports 80 and 5000

2. **Docker Build Failures**
   - Error: "Build failed"
   - Solution: Clear Docker cache and rebuild
     ```bash
     docker-compose down
     docker system prune -a
     docker-compose build --no-cache
     ```

3. **Container Not Starting**
   - Error: "Container exited with code 1"
   - Solution: Check logs
     ```bash
     docker-compose logs <service-name>
     ```

4. **Network Issues**
   - Error: "Connection refused"
   - Solution: Verify network configuration
     ```bash
     docker network ls
     docker network inspect readmission-forecasting_app-network
     ```

### Debugging Tips

1. **Check Container Status**
   ```bash
   docker-compose ps
   ```

2. **View Container Logs**
   ```bash
   docker-compose logs -f <service-name>
   ```

3. **Access Container Shell**
   ```bash
   docker-compose exec <service-name> /bin/bash
   ```

4. **Check Network Connectivity**
   ```bash
   docker-compose exec frontend ping backend
   ```

## Maintenance

### Updating the Application

1. **Pull Latest Changes**
   ```bash
   git pull
   ```

2. **Rebuild and Restart**
   ```bash
   docker-compose down
   docker-compose build --no-cache
   docker-compose up -d
   ```

### Backup and Restore

1. **Backup Data**
   ```bash
   docker-compose exec backend tar -czf /app/backup.tar.gz /app/data /app/models
   ```

2. **Restore Data**
   ```bash
   docker-compose exec backend tar -xzf /app/backup.tar.gz -C /
   ```

## Security Considerations

1. **Update Environment Variables**
   - Regularly rotate API keys and secrets
   - Use strong passwords for all services

2. **Network Security**
   - Configure firewalls to allow only necessary ports
   - Use HTTPS in production

3. **Docker Security**
   - Regularly update Docker images
   - Use non-root users in containers
   - Implement resource limits

## Support

For additional support:
- Email: support@example.com
- GitHub Issues: Create an issue in the repository
- Documentation: Refer to the project documentation 