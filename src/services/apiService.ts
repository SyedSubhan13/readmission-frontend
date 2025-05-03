import { toast } from "sonner";
import { PatientData, ModelPredictionRequest, ModelType } from "./modelService";

// API Base URL and paths
export const API_BASE_URL = 'http://localhost:8000/api';

// Helper function to get model path
const getModelPath = (modelType: string) => {
  // Convert model type to the correct file name
  let fileName = modelType.toLowerCase();
  
  // Handle special cases
  if (modelType.toLowerCase() === 'logistic_regression') {
    fileName = 'logistic_regression';
  } else if (modelType.toLowerCase() === 'random_forest') {
    fileName = 'random_forest';
  } else if (modelType.toLowerCase() === 'lightgbm') {
    fileName = 'lightgbm';
  } else if (modelType.toLowerCase() === 'xgboost') {
    fileName = 'xgboost';
  }
  
  return `${fileName}.pkl`;
};

// API Endpoint Structure
const ENDPOINTS = {
  HEALTH: '/health',
  PREDICT: (modelType: string) => `/predict/${modelType}`,
  PREDICT_NORMALIZED: (modelType: string) => `/predict-normalized/${modelType}`,
  MODEL_PERFORMANCE: (modelType: string) => `/models/${modelType}/performance`,
  TEST_MODEL: (modelType: string) => `/test-model/${modelType}`,
  UPLOAD_DATA: '/upload-data',
  COMPARE_MODELS: '/compare-models',
  VISUALIZATION_DATA: '/visualization-data',
  AVAILABLE_MODELS: '/available-models'
};

export interface ReadmissionOutcome {
  patientId: string;
  outcome: number; // 0: No readmission, 1: Readmission <30 days, 2: Readmission >30 days
  probability: number;
  modelUsed: string;
  confidenceScore: number;
  timestamp: string;
}

export interface ModelPerformance {
  modelName: string;
  accuracy: number;
  precision: number;
  recall: number;
  f1Score: number;
  auc: number;
  confusionMatrix: number[][];
  featureImportance: { feature: string; importance: number }[];
}

export interface AvailableModel {
  name: string;
  path: string;
  size: number;
  lastModified: string;
}

export interface VisualizationData {
  data: any[];
  totalRecords: number;
  columns: {
    name: string;
    type: string;
    uniqueValues: number;
    hasNulls: boolean;
    min?: number;
    max?: number;
    mean?: number;
    valueCounts?: Record<string, number>;
  }[];
  dataSource: string;
  summaryStatistics: {
    totalPatients: number;
    readmissionRate: number;
    avgLengthOfStay: number;
    highRiskPatients: number;
  };
}

// API Functions
export const checkApiHealth = async (): Promise<boolean> => {
  try {
    const response = await fetch(`${API_BASE_URL}/health`);
    return response.ok;
  } catch (error) {
    console.error('API health check failed:', error);
    return false;
  }
};

export const getVisualizationData = async (): Promise<VisualizationData> => {
  try {
    const response = await fetch(`${API_BASE_URL}/visualization-data`);
    if (!response.ok) throw new Error(`Error: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error('Visualization data API error:', error);
    throw error;
  }
};

export const predictReadmission = async (
  patientData: ModelPredictionRequest,
  modelType: ModelType
): Promise<ReadmissionOutcome> => {
  try {
    // Get the correct model path based on the model type
    const modelPath = encodeURIComponent(`./backend/models/${modelType}.pkl`);
    
    const response = await fetch(`${API_BASE_URL}/predict/${modelType}?modelPath=${modelPath}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(patientData),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.message || `Error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Prediction API error:', error);
    throw error;
  }
};

export const getModelPerformance = async (modelType: ModelType): Promise<ModelPerformance> => {
  try {
    // Get the correct model path based on the model type
    const modelPath = encodeURIComponent(`./backend/models/${modelType}.pkl`);
    
    const response = await fetch(`${API_BASE_URL}/models/${modelType}/performance?modelPath=${modelPath}`);
    
    if (!response.ok) throw new Error(`Error: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error('Model performance API error:', error);
    throw error;
  }
};

export const uploadPatientData = async (file: File): Promise<any> => {
  console.log('Uploading patient data...', file.name, file.size, file.type);
  try {
    const formData = new FormData();
    formData.append('file', file);
    
    console.log('Sending request to:', `${API_BASE_URL}/upload-data`);
    const response = await fetch(`${API_BASE_URL}/upload-data`, {
      method: 'POST',
      body: formData,
    });
    
    console.log('Response status:', response.status, response.statusText);
    
    if (!response.ok) {
      const responseText = await response.text();
      console.error('Upload error response:', responseText);
      try {
        const errorData = JSON.parse(responseText);
        throw new Error(errorData?.message || `Error: ${response.status}`);
      } catch (parseError) {
        throw new Error(`Error: ${response.status} - ${responseText}`);
      }
    }
    
    const responseData = await response.json();
    console.log('Upload response data:', responseData);
    return responseData;
  } catch (error) {
    console.error('Error uploading file:', error);
    throw error;
  }
};

export const testModel = async (
  modelType: ModelType
): Promise<any> => {
  try {
    // Get the correct model path based on the model type
    const modelPath = encodeURIComponent(`./backend/models/${modelType}.pkl`);
    
    console.log(`Testing model ${modelType} with path ${modelPath}`);
    
    const response = await fetch(`${API_BASE_URL}/test-model/${modelType}?modelPath=${modelPath}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      }
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Test model error response:', errorText);
      try {
        const errorData = JSON.parse(errorText);
        throw new Error(errorData?.detail || `Error: ${response.status}`);
      } catch (parseError) {
        throw new Error(`Error: ${response.status} - ${errorText}`);
      }
    }
    
    const result = await response.json();
    console.log('Test model result:', result);
    return result;
  } catch (error) {
    console.error("Error testing model:", error);
    throw error;
  }
};

export const compareModels = async (patientData: ModelPredictionRequest): Promise<ReadmissionOutcome[]> => {
  try {
    // Include model paths in the request
    const modelPaths = {
      'lightgbm': './backend/models/lightgbm.pkl',
      'xgboost': './backend/models/xgboost.pkl',
      'logistic_regression': './backend/models/logistic_regression.pkl',
      'random_forest': './backend/models/random_forest.pkl'
    };
    
    console.log('Starting model comparison with data:', JSON.stringify(patientData, null, 2));
    
    const response = await fetch(`${API_BASE_URL}/compare-models`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        patient_data: patientData,
        model_paths: Object.values(modelPaths)
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.message || `Error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Model comparison error:', error);
    throw error;
  }
};

export const getAvailableModels = async (): Promise<{ models: AvailableModel[]; count: number; modelDirectory: string }> => {
  try {
    const response = await fetch(`${API_BASE_URL}/available-models`);
    if (!response.ok) throw new Error('Failed to fetch available models');
    return await response.json();
  } catch (error) {
    console.error('Failed to get available models:', error);
    throw error;
  }
};

export const predictNormalized = async (
  modelType: ModelType,
  testData: PatientData[]
): Promise<any> => {
  try {
    // Get the correct model path based on the model type
    const modelPath = encodeURIComponent(`./backend/models/${modelType}.pkl`);
    
    console.log(`Making normalized prediction request for model: ${modelType}, path: ${modelPath}`);
    console.log(`Data records: ${testData.length}`);
    
    const response = await fetch(`${API_BASE_URL}/predict-normalized/${modelType}?modelPath=${modelPath}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ data: testData }),
    });
    
    console.log(`Prediction response status: ${response.status} ${response.statusText}`);
    
    if (!response.ok) {
      const responseText = await response.text();
      console.error('Prediction error response:', responseText);
      try {
        const errorData = JSON.parse(responseText);
        throw new Error(errorData?.message || `Error: ${response.status}`);
      } catch (parseError) {
        throw new Error(`Error: ${response.status} - ${responseText}`);
      }
    }
    
    const result = await response.json();
    console.log('Prediction result:', result);
    return result;
  } catch (error) {
    console.error("Error in normalized prediction:", error);
    throw error;
  }
};
