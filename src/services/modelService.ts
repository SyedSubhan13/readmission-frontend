// This file contains types and utilities for working with ML models in the application

import { API_BASE_URL } from './apiService';

// Define available model types
export type ModelType = 'random_forest' | 'logistic_regression' | 'xgboost' | 'lightgbm';

// Define patient data structure
export interface PatientData {
  // Add specific patient data fields as needed
  [key: string]: number | string | null | undefined;
}

// Define prediction request structure 
export interface ModelPredictionRequest {
  patientData: PatientData;
  options?: {
    model: ModelType;
    threshold?: number;
    ensemble?: boolean;
  };
}

// Add cache for data
interface DataCache {
  fullData: PatientData[] | null;
  sampleData: PatientData[] | null;
  lastUpdated: number | null;
}

// Initialize the cache
const dataCache: DataCache = {
  fullData: null,
  sampleData: null,
  lastUpdated: null
};

// Cache expiration time (30 minutes)
const CACHE_EXPIRATION = 30 * 60 * 1000;

// Settings types
export interface LocalModelSettings {
  apiEndpoint: string;
  modelPaths: {
    [key in ModelType]?: string;
  };
  defaultModel: ModelType;
  useSampleData: boolean;
  sampleSize: number;
}

const defaultSettings: LocalModelSettings = {
  apiEndpoint: 'http://localhost:8000/api',
  modelPaths: {
    logistic_regression: './backend/models/logistic_regression.pkl',
    random_forest: './backend/models/random_forest.pkl',
    xgboost: './backend/models/xgboost.pkl',
    lightgbm: './backend/models/lightgbm.pkl',
  },
  defaultModel: 'lightgbm',
  useSampleData: true,
  sampleSize: 100
};

// Settings management
export const saveSettings = (settings: LocalModelSettings): void => {
  localStorage.setItem('modelSettings', JSON.stringify(settings));
};

export const getSettings = (): LocalModelSettings => {
  const saved = localStorage.getItem('modelSettings');
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to parse saved settings:', e);
    }
  }
  return defaultSettings;
};

// Mock data generation for testing
export const getSamplePatientData = (count: number = 100): PatientData[] => {
  // Generate sample data for testing
  const sampleData: PatientData[] = [];
  
  // Add specified number of sample patients
  for (let i = 0; i < count; i++) {
    const readmitted = Math.random() > 0.7 ? 'YES' : 'NO';
    const age = Math.floor(40 + Math.random() * 50); // 40-90
    const gender = Math.random() > 0.5 ? 'Male' : 'Female';
    const timeInHospital = Math.floor(1 + Math.random() * 14); // 1-14 days
    
    sampleData.push({
      patient_id: `P${10000 + i}`,
      age,
      gender,
      race: ['Caucasian', 'African American', 'Hispanic', 'Asian', 'Other'][Math.floor(Math.random() * 5)],
      time_in_hospital: timeInHospital,
      num_lab_procedures: Math.floor(1 + Math.random() * 90),
      num_procedures: Math.floor(Math.random() * 6),
      num_medications: Math.floor(1 + Math.random() * 20),
      number_outpatient: Math.floor(Math.random() * 5),
      number_emergency: Math.floor(Math.random() * 3),
      number_inpatient: Math.floor(Math.random() * 4),
      number_diagnoses: Math.floor(1 + Math.random() * 15),
      readmitted
    });
  }
  
  return sampleData;
};

// Load sample data for fast testing
export const loadSampleDataForTesting = async (forceRefresh: boolean = false): Promise<PatientData[]> => {
  const settings = getSettings();
  
  // If we have cached sample data and it's not expired, use it
  if (
    !forceRefresh && 
    dataCache.sampleData && 
    dataCache.lastUpdated && 
    (Date.now() - dataCache.lastUpdated < CACHE_EXPIRATION)
  ) {
    console.log('Using cached sample data');
    return dataCache.sampleData;
  }

  try {
    console.log(`Loading sample data (${settings.sampleSize} records) for quick testing`);
    
    // Try to fetch limited data from the API
    const response = await fetch(`${API_BASE_URL}/visualization-data?limit=${settings.sampleSize}`);
    
    // If the API call is successful, use that data
    if (response.ok) {
      const data = await response.json();
      
      // Extract and process a smaller subset for sample data
      const processedData = data.data.slice(0, settings.sampleSize).map((row: any) => ({
        ...row,
        // Ensure consistent data format
        time_in_hospital: parseFloat(row.time_in_hospital),
        num_lab_procedures: parseFloat(row.num_lab_procedures),
        num_procedures: parseFloat(row.num_procedures),
        num_medications: parseFloat(row.num_medications),
        number_diagnoses: parseFloat(row.number_diagnoses)
      }));
      
      // Update the cache
      dataCache.sampleData = processedData;
      dataCache.lastUpdated = Date.now();
      
      return processedData;
    } else {
      throw new Error(`API returned status: ${response.status}`);
    }
  } catch (error) {
    console.warn('Failed to load sample data from API, using generated samples:', error);
    
    // Generate sample data as a fallback
    const generatedSamples = getSamplePatientData(settings.sampleSize);
    
    // Update the cache with generated samples
    dataCache.sampleData = generatedSamples;
    dataCache.lastUpdated = Date.now();
    
    return generatedSamples;
  }
};

// Add new interface for upload status
export interface UploadStatus {
  loading: boolean;
  error: string | null;
  data: PatientData[] | null;
}

// Global state to track upload status
let currentUploadStatus: UploadStatus = {
  loading: false,
  error: null,
  data: null
};

// New function to get upload status
export const getUploadStatus = (): UploadStatus => {
  return currentUploadStatus;
};

// Modified to handle auto-upload with caching
export const autoLoadFeatureEngineering = async (forceRefresh: boolean = false): Promise<PatientData[]> => {
  try {
    const settings = getSettings();
    
    // Check if we should use sample data
    if (settings.useSampleData) {
      return await loadSampleDataForTesting(forceRefresh);
    }
    
    // Check if we have cached full data that's not expired
    if (
      !forceRefresh && 
      dataCache.fullData && 
      dataCache.lastUpdated && 
      (Date.now() - dataCache.lastUpdated < CACHE_EXPIRATION)
    ) {
      console.log('Using cached full data');
      return dataCache.fullData;
    }
    
    currentUploadStatus = { loading: true, error: null, data: null };
    
    const response = await fetch(`${API_BASE_URL}/visualization-data`);
    if (!response.ok) {
      throw new Error(`Failed to load data: ${response.statusText}`);
    }
    
    const data = await response.json();
    const processedData = data.data.map((row: any) => ({
      ...row,
      // Ensure consistent data format
      time_in_hospital: parseFloat(row.time_in_hospital),
      num_lab_procedures: parseFloat(row.num_lab_procedures),
      num_procedures: parseFloat(row.num_procedures),
      num_medications: parseFloat(row.num_medications),
      number_diagnoses: parseFloat(row.number_diagnoses)
    }));

    // Update cache
    dataCache.fullData = processedData;
    dataCache.lastUpdated = Date.now();
    
    currentUploadStatus = { loading: false, error: null, data: processedData };
    return processedData;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error loading data';
    currentUploadStatus = { loading: false, error: errorMessage, data: null };
    console.error("Error auto-loading feature engineering data:", error);
    throw error;
  }
};

// Add model testing cache
interface ModelTestCache {
  [key: string]: {
    results: any;
    timestamp: number;
  };
}

// Cache for model test results
const modelTestCache: ModelTestCache = {};

// Cache expiration time for model tests (5 minutes)
const MODEL_TEST_CACHE_EXPIRATION = 5 * 60 * 1000;

// Modified test model function with caching and better error handling
export const testModel = async (
  modelType: ModelType,
  testData: PatientData[],
  apiUrl?: string,
  forceRefresh: boolean = false
): Promise<any> => {
  try {
    // Check cache first if we're not forcing a refresh
    if (!forceRefresh && modelTestCache[modelType] && 
        (Date.now() - modelTestCache[modelType].timestamp < MODEL_TEST_CACHE_EXPIRATION)) {
      console.log(`Using cached test results for ${modelType} model`);
      return modelTestCache[modelType].results;
    }
    
    console.log(`Testing model ${modelType}...`);
    const settings = getSettings();
    const baseUrl = apiUrl || API_BASE_URL;
    const modelPath = settings.modelPaths[modelType];
    
    if (!modelPath) {
      throw new Error(`No model path configured for model type: ${modelType}`);
    }

    const startTime = performance.now();
    const response = await fetch(`${baseUrl}/test-model/${modelType}?modelPath=${encodeURIComponent(modelPath)}&fastMode=true`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      }
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      const errorDetail = errorData?.detail || `HTTP error! status: ${response.status}`;
      console.error(`Model test failed for ${modelType}:`, errorDetail);
      throw new Error(errorDetail);
    }
    
    const result = await response.json();
    const endTime = performance.now();
    result.clientProcessingTime = ((endTime - startTime) / 1000).toFixed(2);
    
    console.log(`Successfully tested ${modelType} model in ${result.clientProcessingTime}s`);
    
    // Cache the results
    modelTestCache[modelType] = {
      results: result,
      timestamp: Date.now()
    };
    
    return result;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error testing model';
    console.error(`Error testing ${modelType} model:`, errorMessage);
    throw error;
  }
};

// Test multiple models in parallel to speed up overall testing time
export const testMultipleModels = async (
  modelTypes: ModelType[],
  fastMode: boolean = true
): Promise<Record<ModelType, any>> => {
  console.log(`Testing ${modelTypes.length} models in ${fastMode ? 'fast' : 'normal'} mode...`);
  const startTime = performance.now();
  
  // Make all requests in parallel
  const results = await Promise.allSettled(
    modelTypes.map(modelType => testModel(modelType, [], undefined, !fastMode))
  );
  
  const endTime = performance.now();
  console.log(`All models tested in ${((endTime - startTime) / 1000).toFixed(2)}s`);
  
  // Process results
  const modelResults: Record<ModelType, any> = {} as Record<ModelType, any>;
  
  results.forEach((result, index) => {
    const modelType = modelTypes[index];
    if (result.status === 'fulfilled') {
      modelResults[modelType] = result.value;
    } else {
      console.error(`Failed to test ${modelType}:`, result.reason);
      modelResults[modelType] = { error: result.reason.message };
    }
  });
  
  return modelResults;
};

// New function to check model availability
export const checkModelAvailability = async (): Promise<Record<ModelType, boolean>> => {
  try {
    const response = await fetch(`${API_BASE_URL}/available-models`);
    if (!response.ok) {
      throw new Error('Failed to fetch model availability');
    }
    
    const { models } = await response.json();
    const availability: Record<ModelType, boolean> = {
      logistic_regression: false,
      random_forest: false,
      xgboost: false,
      lightgbm: false,
    };
    
    models.forEach((model: { name: string }) => {
      // Convert model name to match our ModelType
      let modelType: ModelType | null = null;
      
      if (model.name.toLowerCase() === 'lightgbm') {
        modelType = 'lightgbm';
      } else if (model.name.toLowerCase() === 'xgboost') {
        modelType = 'xgboost';
      } else if (model.name.toLowerCase().includes('logistic')) {
        modelType = 'logistic_regression';
      } else if (model.name.toLowerCase().includes('random') || model.name.toLowerCase().includes('forest')) {
        modelType = 'random_forest';
      }
      
      if (modelType && modelType in availability) {
        availability[modelType] = true;
      }
    });
    
    return availability;
  } catch (error) {
    console.error('Error checking model availability:', error);
    throw error;
  }
};

// Upload and process patient data from CSV (real implementation)
export const uploadPatientData = async (file: File): Promise<PatientData[]> => {
  try {
    const settings = getSettings();
    const baseUrl = settings.apiEndpoint;
    
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await fetch(`${baseUrl}/upload-data`, {
      method: 'POST',
      body: formData,
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const result = await response.json();
    return result.data || [];
  } catch (error) {
    console.error("Error uploading patient data:", error);
    throw error;
  }
};

// Function to get patient data - prioritizes cached data or sample data
export const getPatientData = async (useSample: boolean = true): Promise<PatientData[]> => {
  try {
    const settings = getSettings();
    
    // Override settings if explicitly requested
    const shouldUseSample = useSample || settings.useSampleData;
    
    if (shouldUseSample) {
      return await loadSampleDataForTesting();
    } else {
      return await autoLoadFeatureEngineering();
    }
  } catch (error) {
    console.warn('Failed to load data, using sample data as fallback:', error);
    // Fallback to sample data if everything else fails
    return getSamplePatientData(getSettings().sampleSize);
  }
};
