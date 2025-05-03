import React, { useState, useEffect } from 'react';
import { BarChart, LineChart, PieChart, Download, RefreshCw } from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  BarChart as RechartsBarChart,
  Bar,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart as RechartsPieChart,
  Pie,
  Cell
} from 'recharts';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import DashboardCard from './DashboardCard';
import ModelComparison from './ModelComparison';
import ModelPerformance from './ModelPerformance';
import { ModelSelector } from './ModelSelector';
import { ModelType, ModelPredictionRequest } from '@/services/modelService';
import { toast } from 'sonner';
import * as apiService from '@/services/apiService';

interface RiskData {
  score: number;
  category: 'Low' | 'Medium' | 'High' | 'Very High';
  factors: {
    name: string;
    impact: number;
  }[];
  recommendations: string[];
  history?: {
    date: string;
    score: number;
  }[];
  modelDetails?: {
    name: string;
    version: string;
    performance: {
      accuracy?: number;
      auc?: number;
      precision?: number;
      recall?: number;
      f1Score?: number;
    };
  };
  modelComparison?: {
    modelName: string;
    score: number;
    category: 'Low' | 'Medium' | 'High' | 'Very High';
  }[];
  readmissionOutcome?: apiService.ReadmissionOutcome;
}

interface RiskDisplayProps {
  patientId?: string;
  patientData?: ModelPredictionRequest;
  isLoading?: boolean;
  onClose?: () => void;
}

const RiskDisplay: React.FC<RiskDisplayProps> = ({ 
  patientId = 'P12345', 
  patientData,
  isLoading: initialLoading = false,
  onClose
}) => {
  const [riskData, setRiskData] = useState<RiskData | null>(null);
  const [activeTab, setActiveTab] = useState('gauge');
  const [selectedModel, setSelectedModel] = useState<ModelType>('random_forest');
  const [isLoading, setIsLoading] = useState(initialLoading);
  const [modelMetrics, setModelMetrics] = useState<any>(null);
  const [modelComparisonData, setModelComparisonData] = useState<any[]>([]);
  const [availableModels, setAvailableModels] = useState<string[]>([]);
  const [apiStatus, setApiStatus] = useState<'online' | 'offline'>('offline');
  
  const riskColors = {
    Low: '#10b981',
    Medium: '#f59e0b',
    High: '#ef4444',
    'Very High': '#7f1d1d'
  };

  const getOutcomeCategory = (outcome: number, probability: number): 'Low' | 'Medium' | 'High' | 'Very High' => {
    if (outcome === 0) return 'Low';
    if (outcome === 1) {
      return probability < 0.7 ? 'Medium' : 'High';
    }
    return 'Very High';
  };

  const getOutcomeScore = (outcome: number, probability: number): number => {
    if (outcome === 0) return Math.round(25 * probability);
    if (outcome === 1) return Math.round(50 + 25 * probability);
    return Math.round(75 + 25 * probability);
  };

  // Check API health and load available models on component mount
  useEffect(() => {
    const initializeComponent = async () => {
      try {
        // Check API health
        const health = await apiService.checkApiHealth();
        setApiStatus('online');

        // Get available models
        const { models } = await apiService.getAvailableModels();
        setAvailableModels(models.map(m => m.name));

        // Fetch initial prediction if we have patient data
        if (patientData) {
          fetchPrediction();
        }
      } catch (error) {
        console.error('Error initializing component:', error);
        setApiStatus('offline');
        toast.error('Failed to connect to the prediction service');
      }
    };

    initializeComponent();
  }, []);

  const fetchModelComparison = async () => {
    if (!patientData) {
      const mockPatient: ModelPredictionRequest = {
        patientId: patientId,
        demographics: {
          age: 67,
          gender: 'Male'
        },
        medicalHistory: {
          numPriorAdmissions: 2,
          comorbidities: ['Hypertension', 'Diabetes'],
          medications: ['Lisinopril', 'Metformin']
        },
        hospitalStay: {
          lengthOfStay: 5,
          diagnosisCodes: ['I25.10', 'E11.9'],
          procedures: ['PCI']
        },
        postDischarge: {
          followUpScheduled: true,
          medications: ['Aspirin', 'Metformin', 'Lisinopril'],
          homeSupport: true
        }
      };
      
      try {
        const results = await apiService.compareModels(mockPatient);
        
        const formattedResults = results.map(result => ({
          modelName: result.modelUsed,
          score: getOutcomeScore(result.outcome, result.probability),
          category: getOutcomeCategory(result.outcome, result.probability)
        }));
        
        setModelComparisonData(formattedResults);
        
        if (riskData) {
          setRiskData({
            ...riskData,
            modelComparison: formattedResults
          });
        }
      } catch (error) {
        console.error('Error fetching model comparison:', error);
        toast.error('Failed to compare models');
      }
      
      return;
    }
    
    try {
      const results = await apiService.compareModels(patientData);
      
      const formattedResults = results.map(result => ({
        modelName: result.modelUsed,
        score: getOutcomeScore(result.outcome, result.probability),
        category: getOutcomeCategory(result.outcome, result.probability)
      }));
      
      setModelComparisonData(formattedResults);
      
      if (riskData) {
        setRiskData({
          ...riskData,
          modelComparison: formattedResults
        });
      }
    } catch (error) {
      console.error('Error fetching model comparison:', error);
      toast.error('Failed to compare models');
    }
  };

  const fetchPrediction = async () => {
    if (!patientData) {
      const mockPatient: ModelPredictionRequest = {
        patientId: patientId,
        demographics: {
          age: 67,
          gender: 'Male'
        },
        medicalHistory: {
          numPriorAdmissions: 2,
          comorbidities: ['Hypertension', 'Diabetes'],
          medications: ['Lisinopril', 'Metformin']
        },
        hospitalStay: {
          lengthOfStay: 5,
          diagnosisCodes: ['I25.10', 'E11.9'],
          procedures: ['PCI']
        },
        postDischarge: {
          followUpScheduled: true,
          medications: ['Aspirin', 'Metformin', 'Lisinopril'],
          homeSupport: true
        }
      };
      
      setIsLoading(true);
      try {
        const result = await apiService.predictReadmission(mockPatient, selectedModel);
        processReadmissionResult(result);
        
        try {
          const metrics = await apiService.getModelPerformance(selectedModel);
          setModelMetrics(metrics);
        } catch (error) {
          console.error('Error fetching model metrics:', error);
        }
        
        fetchModelComparison();
      } catch (error) {
        console.error('Error in default prediction flow:', error);
        toast.error('Failed to fetch initial prediction data');
      } finally {
        setIsLoading(false);
      }
      return;
    }
    
    setIsLoading(true);
    try {
      const result = await apiService.predictReadmission(patientData, selectedModel);
      processReadmissionResult(result);
      
      try {
        const metrics = await apiService.getModelPerformance(selectedModel);
        setModelMetrics(metrics);
      } catch (error) {
        console.error('Error fetching model metrics:', error);
      }
      
      fetchModelComparison();
    } catch (error) {
      console.error('Error fetching prediction:', error);
      toast.error('Failed to fetch prediction data');
    } finally {
      setIsLoading(false);
    }
  };
  
  const processReadmissionResult = (result: apiService.ReadmissionOutcome) => {
    const outcomeScore = getOutcomeScore(result.outcome, result.probability);
    const outcomeCategory = getOutcomeCategory(result.outcome, result.probability);
    
    let factors = [];
    if (result.outcome >= 1) {
      factors = [
        { name: 'Previous Hospital Visits', impact: Math.round(result.probability * 20) },
        { name: 'Age', impact: Math.round(result.probability * 15) },
        { name: 'Number of Medications', impact: Math.round(result.probability * 18) },
        { name: 'Length of Stay', impact: Math.round(result.probability * 14) },
        { name: 'Number of Diagnoses', impact: Math.round(result.probability * 12) },
      ];
    } else {
      factors = [
        { name: 'Previous Hospital Visits', impact: Math.round(result.probability * 8) },
        { name: 'Age', impact: Math.round(result.probability * 10) },
        { name: 'Number of Medications', impact: Math.round(result.probability * 7) },
        { name: 'Length of Stay', impact: Math.round(result.probability * 5) },
        { name: 'Number of Diagnoses', impact: Math.round(result.probability * 4) },
      ];
    }
    
    let recommendations = [
      'Schedule follow-up appointment',
      'Review medication list',
    ];
    
    if (result.outcome === 1) {
      recommendations = [
        'Schedule follow-up appointment within 7 days',
        'Perform medication reconciliation',
        'Arrange for home care services',
        'Monitor vital signs remotely',
      ];
    } else if (result.outcome === 2) {
      recommendations = [
        'Schedule follow-up appointment within 48 hours',
        'Comprehensive medication review and reconciliation',
        'Arrange for intensive home care services',
        'Daily remote monitoring of vital signs',
        'Consider transition care program',
      ];
    }
    
    setRiskData({
      score: outcomeScore,
      category: outcomeCategory,
      factors: factors,
      recommendations: recommendations,
      history: [{ date: 'Current', score: outcomeScore }],
      modelDetails: {
        name: result.modelUsed,
        version: '1.0',
        performance: {}
      },
      modelComparison: modelComparisonData.length > 0 ? modelComparisonData : undefined,
      readmissionOutcome: result
    });
  };

  useEffect(() => {
    fetchPrediction();
  }, [selectedModel]);
  
  const handleModelChange = (model: ModelType) => {
    setSelectedModel(model);
  };
  
  const handleRefreshPrediction = () => {
    fetchPrediction();
  };
  
  const handleDownloadReport = () => {
    if (riskData?.readmissionOutcome) {
      const outcome = riskData.readmissionOutcome;
      const reportData = {
        patientId: outcome.patientId,
        assessmentDate: outcome.timestamp,
        readmissionRisk: {
          outcome: outcome.outcome,
          probability: outcome.probability,
          confidenceScore: outcome.confidenceScore
        },
        model: outcome.modelUsed,
        recommendations: riskData.recommendations
      };
      
      const dataStr = JSON.stringify(reportData, null, 2);
      const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
      
      const exportFileDefaultName = `readmission-report-${outcome.patientId}.json`;
      
      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileDefaultName);
      linkElement.click();
      
      toast.success('Report downloaded successfully');
    } else {
      toast.error('No prediction data available to download');
    }
  };
  
  const getRiskColor = (score: number) => {
    if (score < 30) return riskColors.Low;
    if (score < 60) return riskColors.Medium;
    if (score < 80) return riskColors.High;
    return riskColors['Very High'];
  };
  
  const renderGauge = () => {
    if (!riskData) return null;
    
    const score = riskData.score;
    const color = getRiskColor(score);
    const percentage = score + '%';
    
    return (
      <div className="flex flex-col items-center">
        <div className="relative w-64 h-32 mb-4 mx-auto">
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full rounded-t-full bg-gray-200"></div>
          </div>
          
          <div 
            className="absolute top-0 left-0 w-full h-full overflow-hidden transition-all duration-1000"
            style={{ 
              clipPath: `polygon(0% 100%, 50% 100%, 50% 0%, 0% 0%)`,
              transform: `rotate(${score * 1.8}deg)`,
              transformOrigin: 'bottom center' 
            }}
          >
            <div className="absolute top-0 left-0 w-full h-full rounded-t-full" style={{ backgroundColor: color }}></div>
          </div>
          
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-white border-2 border-gray-500 rounded-full"></div>
          
          <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 bg-white rounded-full shadow-lg w-20 h-20 flex flex-col items-center justify-center border-4" style={{ borderColor: color }}>
            <span className="text-2xl font-bold" style={{ color }}>{score}</span>
            <span className="text-xs text-gray-500">RISK SCORE</span>
          </div>
        </div>
        
        <div className="text-center mb-6">
          <span 
            className="text-sm font-medium rounded-full px-3 py-1 text-white"
            style={{ backgroundColor: color }}
          >
            {riskData.category} Risk
          </span>
          <p className="mt-2 text-gray-600">30-day readmission probability</p>
        </div>
        
        <div className="flex justify-between w-full max-w-xs mb-4">
          <div className="text-center">
            <div className="h-1 w-16 bg-green-500 rounded"></div>
            <span className="text-xs text-gray-500">Low</span>
          </div>
          <div className="text-center">
            <div className="h-1 w-16 bg-yellow-500 rounded"></div>
            <span className="text-xs text-gray-500">Medium</span>
          </div>
          <div className="text-center">
            <div className="h-1 w-16 bg-red-500 rounded"></div>
            <span className="text-xs text-gray-500">High</span>
          </div>
          <div className="text-center">
            <div className="h-1 w-16 bg-red-900 rounded"></div>
            <span className="text-xs text-gray-500">Very High</span>
          </div>
        </div>
        
        {riskData.modelDetails && (
          <div className="text-center mt-2 text-sm text-gray-500">
            <p>Model: {riskData.modelDetails.name} v{riskData.modelDetails.version}</p>
          </div>
        )}
      </div>
    );
  };
  
  const renderBarChart = () => {
    if (!riskData) return null;
    
    return (
      <div className="w-full h-80">
        <ResponsiveContainer width="100%" height="100%">
          <RechartsBarChart
            data={riskData.factors}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            layout="vertical"
          >
            <CartesianGrid strokeDasharray="3 3" horizontal={false} />
            <XAxis type="number" domain={[0, 100]} />
            <YAxis dataKey="name" type="category" width={150} />
            <Tooltip formatter={(value) => [`${value}%`, 'Impact']} />
            <Bar 
              dataKey="impact" 
              fill={riskData.category ? riskColors[riskData.category] : '#ef4444'} 
              radius={[0, 4, 4, 0]}
              animationDuration={1500}
            />
          </RechartsBarChart>
        </ResponsiveContainer>
      </div>
    );
  };
  
  const renderTrend = () => {
    if (!riskData || !riskData.history) return null;
    
    return (
      <div className="w-full h-80">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={riskData.history}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={getRiskColor(riskData.score)} stopOpacity={0.8}/>
                <stop offset="95%" stopColor={getRiskColor(riskData.score)} stopOpacity={0.1}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f5f5f5" />
            <XAxis dataKey="date" />
            <YAxis domain={[0, 100]} />
            <Tooltip />
            <Area 
              type="monotone" 
              dataKey="score" 
              stroke={getRiskColor(riskData.score)} 
              fillOpacity={1} 
              fill="url(#colorScore)" 
              animationDuration={1500}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    );
  };
  
  const renderRecommendations = () => {
    if (!riskData) return null;
    
    return (
      <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
        <h3 className="font-medium text-gray-800 mb-3">Recommended Interventions</h3>
        <ul className="space-y-3">
          {riskData.recommendations.map((rec, index) => (
            <li key={index} className="flex items-start">
              <span className="flex items-center justify-center bg-medical-100 text-medical-600 rounded-full w-5 h-5 text-xs font-medium mt-0.5 mr-2">
                {index + 1}
              </span>
              <span className="text-gray-700">{rec}</span>
            </li>
          ))}
        </ul>
      </div>
    );
  };
  
  const renderReadmissionOutcome = () => {
    if (!riskData?.readmissionOutcome) return null;
    
    const outcome = riskData.readmissionOutcome;
    const outcomeLabels = ['No Readmission', 'Readmission <30 days', 'Readmission >30 days'];
    
    return (
      <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 mt-4">
        <h3 className="font-medium text-gray-800 mb-3">Readmission Prediction Details</h3>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-gray-600">Predicted Outcome:</span>
            <span className="font-medium">{outcomeLabels[outcome.outcome]}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Probability:</span>
            <span className="font-medium">{(outcome.probability * 100).toFixed(1)}%</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Confidence Score:</span>
            <span className="font-medium">{(outcome.confidenceScore * 100).toFixed(1)}%</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Model:</span>
            <span className="font-medium">{outcome.modelUsed}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Prediction Time:</span>
            <span className="font-medium">{new Date(outcome.timestamp).toLocaleString()}</span>
          </div>
        </div>
      </div>
    );
  };
  
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="border-b border-gray-200 bg-gray-50 p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h3 className="font-medium text-gray-900">Readmission Risk Analysis</h3>
          <p className="text-sm text-gray-500">Patient ID: {patientId}</p>
          {apiStatus === 'offline' && (
            <p className="text-sm text-red-500">⚠️ Prediction service is offline</p>
          )}
        </div>
        
        <div className="w-full md:w-auto flex flex-col md:flex-row gap-3">
          <div className="w-full md:w-64">
            <ModelSelector 
              selectedModel={selectedModel}
              onModelChange={handleModelChange}
              allowLocalModels={false}
              availableModels={availableModels}
            />
          </div>
          
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleRefreshPrediction}
              disabled={isLoading || apiStatus === 'offline'}
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleDownloadReport}
              disabled={apiStatus === 'offline'}
            >
              <Download className="w-4 h-4 mr-2" />
              Download
            </Button>
          </div>
        </div>
      </div>
      
      <div className="p-4 md:p-6">
        <Tabs defaultValue="gauge" onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-4 mb-6">
            <TabsTrigger value="gauge" className="flex items-center">
              <PieChart className="w-4 h-4 mr-2" />
              <span>Risk Level</span>
            </TabsTrigger>
            <TabsTrigger value="factors" className="flex items-center">
              <BarChart className="w-4 h-4 mr-2" />
              <span>Risk Factors</span>
            </TabsTrigger>
            <TabsTrigger value="trends" className="flex items-center">
              <LineChart className="w-4 h-4 mr-2" />
              <span>Trends</span>
            </TabsTrigger>
            <TabsTrigger value="models" className="flex items-center">
              <BarChart className="w-4 h-4 mr-2" />
              <span>Models</span>
            </TabsTrigger>
          </TabsList>
          
          <div className="bg-white rounded-lg p-4">
            {isLoading ? (
              <div className="animate-pulse space-y-4">
                <div className="h-32 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
              </div>
            ) : (
              <>
                <TabsContent value="gauge" className="animate-fade-in">
                  {renderGauge()}
                </TabsContent>
                
                <TabsContent value="factors" className="animate-fade-in">
                  {renderBarChart()}
                </TabsContent>
                
                <TabsContent value="trends" className="animate-fade-in">
                  {renderTrend()}
                </TabsContent>
                
                <TabsContent value="models" className="animate-fade-in">
                  {riskData?.modelComparison ? (
                    <ModelComparison data={riskData.modelComparison} />
                  ) : (
                    <div className="flex items-center justify-center h-80">
                      <p className="text-gray-500">No model comparison data available</p>
                    </div>
                  )}
                </TabsContent>
              </>
            )}
          </div>
        </Tabs>
        
        <div className="mt-6">
          {isLoading ? (
            <div className="animate-pulse space-y-2">
              <div className="h-4 bg-gray-200 rounded w-1/4"></div>
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </div>
          ) : (
            <>
              {renderRecommendations()}
              {renderReadmissionOutcome()}
              
              {modelMetrics && (
                <ModelPerformance 
                  modelType={selectedModel} 
                  metrics={modelMetrics} 
                />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default RiskDisplay;
