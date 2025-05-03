# Script to set up Vercel deployment configuration

Write-Host "Setting up Vercel deployment configuration..." -ForegroundColor Green

# Create vercel.json in the root directory for the frontend
$frontendVercelContent = @"
{
  "version": 2,
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "framework": "vite",
  "outputDirectory": "dist",
  "rewrites": [
    {
      "source": "/api/(.*)",
      "destination": "https://YOUR_BACKEND_URL_HERE/$1"
    }
  ]
}
"@

Write-Host "Creating frontend vercel.json in root directory..." -ForegroundColor Yellow
$frontendVercelContent | Out-File -FilePath "vercel.json" -Encoding utf8
Write-Host "Created frontend vercel.json." -ForegroundColor Green

# Create a .env file in the root directory
$envContent = @"
# Frontend environment variables - REPLACE WITH YOUR VALUES
VITE_API_URL=http://localhost:8000
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_key_here

# For production deployment, update this to your Vercel backend URL
# VITE_API_URL=https://your-backend-url.vercel.app
"@

Write-Host "Creating .env.local file in root directory..." -ForegroundColor Yellow
$envContent | Out-File -FilePath ".env.local" -Encoding utf8
Write-Host "Created .env.local file. Update with your actual values." -ForegroundColor Green

# Create a .env file in the backend directory
$backendEnvContent = @"
# Backend environment variables - REPLACE WITH YOUR VALUES
PORT=8000
PYTHONPATH=.
"@

Write-Host "Creating .env file in backend directory..." -ForegroundColor Yellow
$backendEnvContent | Out-File -FilePath "backend/.env" -Encoding utf8
Write-Host "Created backend/.env file. Update with your actual values." -ForegroundColor Green

# Create README for deployment
$deploymentReadmeContent = @"
# Vercel Deployment Setup

This project has been structured for deployment on Vercel.

## Next Steps

1. Replace the placeholder URL in \`vercel.json\`:
   - Open \`vercel.json\` in the root directory
   - Replace \`YOUR_BACKEND_URL_HERE\` with your actual Vercel-deployed backend URL

2. Set up environment variables:
   - Update \`.env.local\` with your frontend environment variables
   - Update \`backend/.env\` with your backend environment variables

3. Deploy to Vercel:
   - Deploy the backend: \`cd backend && vercel\`
   - Deploy the frontend: \`vercel\` (from the project root)

Refer to VERCEL_DEPLOYMENT.md for more detailed instructions.
"@

Write-Host "Creating DEPLOYMENT_README.md..." -ForegroundColor Yellow
$deploymentReadmeContent | Out-File -FilePath "DEPLOYMENT_README.md" -Encoding utf8
Write-Host "Created DEPLOYMENT_README.md." -ForegroundColor Green

Write-Host "Vercel deployment configuration setup complete!" -ForegroundColor Green
Write-Host "Please update the URLs and environment variables with your actual values before deploying." -ForegroundColor Yellow 