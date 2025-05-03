# Readmission Forecasting System

A comprehensive healthcare analytics platform that predicts patient readmission risks using machine learning models.

## Overview

This system provides healthcare providers with powerful tools to identify patients at risk of hospital readmission. By leveraging machine learning algorithms and historical patient data, the platform generates accurate predictions that help optimize patient care and reduce readmission rates.

## 🚀 Features

- **Patient Risk Assessment**: Analyze patient data to predict readmission probability
- **Multiple ML Models**: Support for various machine learning algorithms:
  - Logistic Regression
  - Random Forest
  - XGBoost
  - LightGBM
- **Interactive Dashboard**: Real-time visualization of patient risk factors
- **Model Comparison**: Compare performance metrics across different models
- **Fast Data Processing**: Optimized data loading with caching for improved performance
- **Secure Authentication**: Optional Clerk-based authentication system
- **RESTful API**: FastAPI backend for predictions and data processing

## 🛠️ Technologies Used

### Frontend
- **React 18+**: Modern UI framework
- **TypeScript**: Type-safe JavaScript
- **Vite**: Next-generation frontend tooling
- **Tailwind CSS**: Utility-first CSS framework
- **shadcn/ui**: Accessible component system
- **Recharts**: Interactive data visualization
- **React Query**: Data fetching and state management

### Backend
- **Python 3.9+**: Core programming language
- **FastAPI**: High-performance web framework
- **Scikit-learn**: Machine learning library
- **Pandas**: Data manipulation
- **NumPy**: Numerical computing
- **XGBoost & LightGBM**: Gradient boosting frameworks
- **Joblib**: Model serialization

### Deployment
- **Vercel**: Frontend and serverless backend deployment
- **PowerShell Scripts**: Automated setup and deployment

## 📋 Prerequisites

- Node.js (v18 or higher)
- Python (v3.9 or higher)
- npm or yarn package manager
- Git

## 🚀 Quick Start

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/readmission-forecasting.git
   cd readmission-forecasting
   ```

2. Install frontend dependencies:
   ```bash
   npm install
   ```

3. Install backend dependencies:
   ```bash
   cd backend
   pip install -r requirements.txt
   cd ..
   ```

4. Start the development servers:
   ```bash
   # This will start both frontend and backend servers
   npm run start:dev
   ```
   
   Alternatively, start them separately:
   ```bash
   # Frontend
   npm run dev
   
   # Backend (in a separate terminal)
   cd backend
   python -m uvicorn app:app --reload --port 8000
   ```

5. Open your browser and navigate to:
   - Frontend: http://localhost:5173
   - API documentation: http://localhost:8000/docs

## 📊 Project Structure

```
readmission-forecasting/
├── src/                       # Frontend React application
│   ├── components/            # UI components
│   ├── services/              # API service layer
│   ├── pages/                 # Application pages
│   ├── lib/                   # Utility functions and hooks
│   └── assets/                # Static assets
├── public/                    # Public static files
├── backend/                   # Backend FastAPI server
│   ├── app.py                 # Main FastAPI application
│   ├── models/                # ML model files (.pkl, .h5)
│   ├── data/                  # Data files for analysis
│   └── model_report/          # Model performance reports
├── scripts/                   # Deployment and setup scripts
└── .vercel/                   # Vercel configuration
```

## 🔧 Configuration

### Environment Variables

Create a `.env` or `.env.local` file in the project root with these variables:

```
# API Configuration
VITE_API_URL=http://localhost:8000/api
VITE_API_KEY=your_api_key_here

# Authentication (optional)
VITE_USE_AUTH=false
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_key_here

# Feature Flags
VITE_ENABLE_ANALYTICS=true
VITE_DEFAULT_MODEL=lightgbm
```

### Authentication

The system supports two authentication modes:

1. **Development Mode** (default): Authentication is bypassed with a mock user
2. **Production Mode**: Uses Clerk for secure authentication

To enable Clerk authentication:
1. Set `VITE_USE_AUTH=true` in your environment
2. Add your Clerk publishable key as `VITE_CLERK_PUBLISHABLE_KEY`

## 🚀 Deployment

### Vercel Deployment

The project is configured for seamless deployment on Vercel:

1. Fork this repository to your GitHub account
2. Import the repository in Vercel
3. Configure environment variables in Vercel dashboard
4. Deploy!

Vercel will automatically detect the project structure and deploy:
- Frontend: React application from the root directory
- Backend: FastAPI application from the `/backend` directory

### Manual Deployment

For manual deployment to your own server:

1. Build the frontend:
   ```bash
   npm run build
   ```

2. Serve the static files from the `dist` directory
3. Deploy the FastAPI backend on your server
4. Configure proper CORS settings in `backend/app.py`

## 💡 Usage Guide

### Model Testing

The system allows comprehensive testing of different ML models:

1. Navigate to the "Model Testing" section in the dashboard
2. Select a model from the dropdown
3. Click "Test Model" to evaluate performance
4. Use "Test All Models" to compare multiple models simultaneously
5. Toggle "Use Cache" to speed up repeat testing

### Data Settings

Control data loading behavior:

1. Click the "Data Settings" button in the navigation bar
2. Toggle "Use Sample Data" to enable faster loading with limited data
3. Adjust the sample size slider to control the amount of data used
4. Save changes to apply settings

### Prediction Workflow

To generate patient readmission predictions:

1. Upload patient data in CSV format
2. Select the desired ML model
3. Run predictions and view results
4. Export predictions as CSV or JSON
5. Compare with historical data to evaluate model performance

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

Please ensure your code follows the project's coding style and includes appropriate tests.

## 🐛 Troubleshooting

### Common Issues

- **API Connection Error**: Verify the backend server is running and check CORS settings
- **Model Loading Error**: Ensure model files exist in the correct location (`backend/models/`)
- **Data Format Issues**: Verify CSV files follow the expected format with proper column names
- **Authentication Problems**: Check Clerk configuration and environment variables

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📬 Contact

For questions or support, please contact the development team at yourteam@example.com or open an issue on GitHub.
