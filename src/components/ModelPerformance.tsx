import React from 'react';
import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  TooltipProps,
} from 'recharts';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ModelType } from '@/services/modelService';
import { ValueType } from 'recharts/types/component/DefaultTooltipContent';

interface ModelPerformanceProps {
  modelType: ModelType;
  metrics: {
    accuracy: number;
    precision: number;
    recall: number;
    f1Score: number;
    auc: number;
    confusionMatrix: number[][];
    featureImportance: { feature: string; importance: number }[];
  };
}

const ModelPerformance: React.FC<ModelPerformanceProps> = ({ modelType, metrics }) => {
  const getModelName = (type: ModelType): string => {
    const names: Record<string, string> = {
      logistic_regression: 'Logistic Regression',
      random_forest: 'Random Forest',
      xgboost: 'XGBoost',
      lightgbm: 'LightGBM',
      mlp: 'Multi-Layer Perceptron'
    };
    return names[type] || String(type);
  };

  const performanceData = [
    { metric: 'Accuracy', value: metrics.accuracy * 100 },
    { metric: 'Precision', value: metrics.precision * 100 },
    { metric: 'Recall', value: metrics.recall * 100 },
    { metric: 'F1 Score', value: metrics.f1Score * 100 },
    { metric: 'AUC', value: metrics.auc * 100 },
  ];

  const radarData = [
    { subject: 'Accuracy', A: metrics.accuracy * 100 },
    { subject: 'Precision', A: metrics.precision * 100 },
    { subject: 'Recall', A: metrics.recall * 100 },
    { subject: 'F1', A: metrics.f1Score * 100 },
    { subject: 'AUC', A: metrics.auc * 100 },
  ];

  const customTooltipFormatter = (value: ValueType, name: string) => {
    if (typeof value === 'number') {
      return [`${value.toFixed(2)}%`, name];
    }
    return [value, name];
  };

  return (
    <div className="mt-6">
      <h3 className="font-medium text-gray-800 mb-3">
        Model Performance: {getModelName(modelType)}
      </h3>
      
      <Tabs defaultValue="metrics" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="metrics">Performance Metrics</TabsTrigger>
          <TabsTrigger value="features">Feature Importance</TabsTrigger>
          <TabsTrigger value="radar">Radar Plot</TabsTrigger>
        </TabsList>
        
        <TabsContent value="metrics" className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <RechartsBarChart
              data={performanceData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="metric" />
              <YAxis domain={[0, 100]} />
              <Tooltip 
                formatter={customTooltipFormatter}
              />
              <Legend />
              <Bar 
                dataKey="value" 
                name="Performance (%)" 
                fill="#3b82f6" 
                radius={[4, 4, 0, 0]}
              />
            </RechartsBarChart>
          </ResponsiveContainer>
        </TabsContent>
        
        <TabsContent value="features" className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <RechartsBarChart
              data={metrics.featureImportance.slice(0, 10)}
              layout="vertical"
              margin={{ top: 5, right: 30, left: 120, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" horizontal={false} />
              <XAxis type="number" domain={[0, Math.max(...metrics.featureImportance.map(f => f.importance)) * 1.1 || 0.1]} />
              <YAxis type="category" dataKey="feature" width={120} />
              <Tooltip 
                formatter={(value: ValueType) => {
                  if (typeof value === 'number') {
                    return [`${(value * 100).toFixed(2)}%`, 'Importance'];
                  }
                  return [value, 'Importance'];
                }} 
              />
              <Bar 
                dataKey="importance" 
                name="Feature Importance" 
                fill="#8884d8" 
                radius={[0, 4, 4, 0]}
              />
            </RechartsBarChart>
          </ResponsiveContainer>
        </TabsContent>
        
        <TabsContent value="radar" className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
              <PolarGrid />
              <PolarAngleAxis dataKey="subject" />
              <PolarRadiusAxis angle={90} domain={[0, 100]} />
              <Radar
                name="Performance"
                dataKey="A"
                stroke="#8884d8"
                fill="#8884d8"
                fillOpacity={0.6}
              />
              <Legend />
            </RadarChart>
          </ResponsiveContainer>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ModelPerformance;
