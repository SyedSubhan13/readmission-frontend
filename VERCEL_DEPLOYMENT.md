# Vercel Deployment Guide

This guide explains how to deploy the Readmission Forecasting application on Vercel.

## Project Structure

The project is structured for deployment on Vercel:

```
readmission-forecasting/
├── src/                       # Frontend React application
├── public/                    # Static assets
├── backend/                   # Backend API server
│   ├── app.py                 # FastAPI application
│   ├── main.py                # Entry point
│   ├── vercel.json            # Vercel configuration
│   └── requirements.txt       # Python dependencies
└── package.json               # Frontend dependencies
```

## Prerequisites

1. A Vercel account (sign up at https://vercel.com)
2. Vercel CLI installed (optional, for local testing)
   ```bash
   npm i -g vercel
   ```
3. Git repository with your project

## Deployment Steps

### 1. Frontend Deployment

1. Push your code to a Git repository (GitHub, GitLab, or Bitbucket)

2. Log in to your Vercel account and click "Add New Project"

3. Import your Git repository

4. Configure the project:
   - Framework Preset: Vite
   - Root Directory: ./
   - Build Command: npm run build
   - Output Directory: dist
   - Install Command: npm install

5. Add environment variables:
   - `VITE_API_URL`: URL to your backend API (will be created in next step)
   - Any other environment variables needed by your frontend

6. Click "Deploy"

### 2. Backend Deployment

#### Option 1: Deploy as a Separate Vercel Project

1. Create a new project in Vercel

2. Import the same Git repository

3. Configure the project:
   - Framework Preset: Other
   - Root Directory: backend
   - Build Command: pip install -r requirements.txt
   - Output Directory: .
   - Install Command: pip install -r requirements.txt

4. Add environment variables required by your backend

5. Click "Deploy"

#### Option 2: Deploy as a Serverless Function

1. Configure the backend directory to work as a Vercel serverless function

2. Ensure your `vercel.json` file in the backend directory has the correct configuration:
   ```json
   {
     "version": 2,
     "builds": [
       { "src": "main.py", "use": "@vercel/python" }
     ],
     "routes": [
       { "src": "/(.*)", "dest": "main.py" }
     ],
     "env": {
       "PYTHONPATH": "."
     }
   }
   ```

3. Make sure your `backend/main.py` file is properly set up to export the FastAPI app

4. Deploy to Vercel using the CLI:
   ```bash
   cd backend
   vercel
   ```

5. After deployment, note the URL provided by Vercel

### 3. Connect Frontend to Backend

1. Go to the Vercel dashboard for your frontend project

2. Update the `VITE_API_URL` environment variable to point to your deployed backend URL

3. Redeploy the frontend to apply the changes

## Local Development with Vercel Integration

1. Install Vercel CLI:
   ```bash
   npm i -g vercel
   ```

2. Link your local project to Vercel:
   ```bash
   vercel link
   ```

3. Pull environment variables:
   ```bash
   vercel env pull
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

5. In a separate terminal, run the backend:
   ```bash
   cd backend
   python main.py
   ```

## Troubleshooting

### Backend Not Connecting

If your frontend can't connect to the backend:

1. Check CORS settings in your backend code
2. Verify the API URL in your frontend environment variables
3. Check the vercel.json configuration

### Model Loading Issues

If your models don't load on Vercel:

1. Make sure your models are included in your Git repository and not gitignored
2. Check file paths in your code (use relative paths from the project root)
3. Consider using a storage service like AWS S3 for larger model files

### Environment Variables

If your app is not picking up environment variables:

1. In Vercel dashboard, check that all required variables are set
2. Use `vercel env pull` to download them locally for testing
3. Make sure you're accessing them correctly in your code

## Resources

- [Vercel Documentation](https://vercel.com/docs)
- [FastAPI on Vercel](https://vercel.com/guides/deploying-fastapi-with-vercel)
- [Vite Deployment Guide](https://vitejs.dev/guide/static-deploy.html) 