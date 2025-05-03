import React, { useState, useEffect } from 'react';
import { Play, Clock, Check, XCircle, Info, ZapIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  ModelType, 
  PatientData, 
  testModel as testModelFromService,
  testMultipleModels 
} from '@/services/modelService';
import { ModelSelector } from './ModelSelector';
import { toast } from 'sonner';
import { getAvailableModels } from '@/services/apiService';
import { Switch } from './ui/switch';
import { Label } from './ui/label';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";

interface ModelTesterProps {}

interface TestResults {
  modelName: string;
  accuracy: number;
  precision: number;
  recall: number;
  f1Score: number;
  auc: number;
  processingTime: number;
  useCache?: boolean;
}

const ModelTester: React.FC<ModelTesterProps> = () => {
  const [availableModels, setAvailableModels] = useState<string[]>([]);
  const [selectedModel, setSelectedModel] = useState<ModelType | null>(null);
  const [isTesting, setIsTesting] = useState(false);
  const [isTestingAll, setIsTestingAll] = useState(false);
  const [progress, setProgress] = useState(0);
  const [testResults, setTestResults] = useState<TestResults[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [useCache, setUseCache] = useState<boolean>(true);

  useEffect(() => {
    const fetchAvailableModels = async () => {
      try {
        const { models } = await getAvailableModels();
        setAvailableModels(models.map(m => m.name));
      } catch (error) {
        console.error('Failed to fetch available models:', error);
        toast.error('Failed to load available models');
      }
    };

    fetchAvailableModels();
  }, []);

  const handleModelChange = (model: ModelType) => {
    setSelectedModel(model);
    setError(null);
  };

  const extractTestResults = (modelName: string, results: any): TestResults => {
    // Extract metrics from performance object
    const metrics = results.performance?.metrics || {};
    const executionTime = results.performance?.execution_time_seconds || 
                          results.clientProcessingTime || 0;
    
    return {
      modelName,
      accuracy: metrics.accuracy || 0,
      precision: metrics.precision || 0,
      recall: metrics.recall || 0,
      f1Score: metrics.f1 || 0,
      auc: metrics.roc_auc || 0,
      processingTime: executionTime,
      useCache: results.fromCache || false
    };
  };

  const handleTestModel = async () => {
    if (!selectedModel) {
      toast.error('Please select a model to test');
      return;
    }

    setIsTesting(true);
    setProgress(0);
    setError(null);

    // Create a progress simulation
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 95) {
          clearInterval(progressInterval);
          return prev;
        }
        return prev + 5;
      });
    }, 300);

    try {
      console.log('Testing model:', selectedModel);
      
      // Use our improved testModel function
      const results = await testModelFromService(
        selectedModel, 
        [], // Empty array as we're using server test data
        undefined, 
        !useCache // Force refresh if cache is disabled
      );
      
      // Complete the progress
      clearInterval(progressInterval);
      setProgress(100);
      
      // Process and display the results
      const modelResults = extractTestResults(selectedModel, results);
      setTestResults([modelResults]);
      
      const cacheStatus = results.fromCache ? ' (from cache)' : '';
      toast.success(`Successfully tested ${selectedModel} model${cacheStatus}`);
    } catch (error) {
      clearInterval(progressInterval);
      console.error('Error testing model:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to test model';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsTesting(false);
      setProgress(0);
    }
  };

  const handleTestAllModels = async () => {
    const modelTypes = availableModels.filter(model => 
      ['lightgbm', 'xgboost', 'logistic_regression', 'random_forest'].includes(model)
    ) as ModelType[];
    
    if (modelTypes.length === 0) {
      toast.error('No models available for testing');
      return;
    }

    setIsTestingAll(true);
    setProgress(0);
    setError(null);

    // Create a progress simulation
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 95) {
          clearInterval(progressInterval);
          return prev;
        }
        return prev + 5;
      });
    }, 300);

    try {
      // Test all models in parallel with fastMode
      const allResults = await testMultipleModels(modelTypes, useCache);
      
      // Complete the progress
      clearInterval(progressInterval);
      setProgress(100);
      
      // Process and display the results for all models
      const modelResults = Object.entries(allResults).map(([modelName, results]) => 
        extractTestResults(modelName as ModelType, results)
      );
      
      setTestResults(modelResults);
      toast.success(`Successfully tested ${modelResults.length} models`);
    } catch (error) {
      clearInterval(progressInterval);
      console.error('Error testing models:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to test models';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsTestingAll(false);
      setProgress(0);
    }
  };

  return (
    <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
      <div className="p-4 border-b bg-gray-50">
        <h3 className="font-medium text-gray-800">Model Testing</h3>
        <p className="text-sm text-gray-500 mt-1">
          Test model performance on the server's test dataset
        </p>
      </div>
      
      <div className="p-4">
        <div className="flex flex-col sm:flex-row gap-4 mb-6 items-start sm:items-center">
          <div className="w-full sm:w-64">
            <ModelSelector
              selectedModel={selectedModel}
              onModelChange={handleModelChange}
              availableModels={availableModels}
            />
          </div>
          
          <Button
            onClick={handleTestModel}
            disabled={!selectedModel || isTesting || isTestingAll}
            className="flex-shrink-0"
          >
            <Play className="w-4 h-4 mr-2" />
            {isTesting ? 'Testing...' : 'Test Model'}
          </Button>
          
          <Button
            onClick={handleTestAllModels}
            disabled={availableModels.length === 0 || isTesting || isTestingAll}
            variant="secondary"
            className="flex-shrink-0"
          >
            <ZapIcon className="w-4 h-4 mr-2" />
            {isTestingAll ? 'Testing All...' : 'Test All Models'}
          </Button>
          
          <div className="flex items-center space-x-2 ml-auto">
            <Switch
              id="use-cache"
              checked={useCache}
              onCheckedChange={setUseCache}
            />
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Label htmlFor="use-cache" className="text-sm text-gray-500 cursor-help">
                    Use Cache
                  </Label>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="max-w-xs">
                    When enabled, test results are cached for 5 minutes to speed up repeated tests. 
                    Disable to force fresh test runs.
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
        
        {(isTesting || isTestingAll) && (
          <div className="mb-6">
            <div className="flex justify-between text-xs mb-1">
              <span>Testing model{isTestingAll ? 's' : ''}...</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        )}
        
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-lg mb-6">
            <div className="flex items-start">
              <XCircle className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-medium">Error Testing Model</h4>
                <p className="text-sm mt-1">{error}</p>
              </div>
            </div>
          </div>
        )}
        
        {testResults.length > 0 && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {testResults.length === 1 && (
                <>
                  <div className="bg-gray-50 rounded-lg p-4 border">
                    <div className="text-sm text-gray-500 mb-1">Accuracy</div>
                    <div className="text-2xl font-semibold">
                      {(testResults[0].accuracy * 100).toFixed(1)}%
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-4 border">
                    <div className="text-sm text-gray-500 mb-1">F1 Score</div>
                    <div className="text-2xl font-semibold">
                      {(testResults[0].f1Score * 100).toFixed(1)}%
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-4 border">
                    <div className="text-sm text-gray-500 mb-1">AUC</div>
                    <div className="text-2xl font-semibold">
                      {(testResults[0].auc * 100).toFixed(1)}%
                    </div>
                  </div>
                </>
              )}
              
              <div className="bg-gray-50 rounded-lg p-4 border">
                <div className="text-sm text-gray-500 mb-1">Processing Time</div>
                <div className="text-2xl font-semibold flex items-center">
                  <Clock className="w-4 h-4 mr-1 text-gray-400" />
                  {testResults.length === 1 ? 
                    `${testResults[0].processingTime.toFixed(2)}s` : 
                    `${testResults.reduce((acc, curr) => acc + curr.processingTime, 0).toFixed(2)}s total`
                  }
                </div>
              </div>
            </div>
            
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Model</TableHead>
                  <TableHead>Accuracy</TableHead>
                  <TableHead>Precision</TableHead>
                  <TableHead>Recall</TableHead>
                  <TableHead>F1 Score</TableHead>
                  <TableHead>AUC</TableHead>
                  <TableHead>Time (s)</TableHead>
                  <TableHead>Source</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {testResults.map((result, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{result.modelName}</TableCell>
                    <TableCell>{(result.accuracy * 100).toFixed(1)}%</TableCell>
                    <TableCell>{(result.precision * 100).toFixed(1)}%</TableCell>
                    <TableCell>{(result.recall * 100).toFixed(1)}%</TableCell>
                    <TableCell>{(result.f1Score * 100).toFixed(1)}%</TableCell>
                    <TableCell>{(result.auc * 100).toFixed(1)}%</TableCell>
                    <TableCell>{result.processingTime.toFixed(2)}s</TableCell>
                    <TableCell>
                      {result.useCache ? 
                        <span className="text-blue-500 flex items-center">
                          <Check className="w-3 h-3 mr-1" /> Cache
                        </span> : 
                        'Computed'
                      }
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ModelTester;