import React, { useState, useEffect } from 'react';
import { FileText, Download, Filter, Calendar, BarChart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import DashboardCard from '@/components/DashboardCard';
import { 
  AreaChart, 
  Area, 
  BarChart as RechartsBarChart,
  Bar,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { ModelType } from '@/services/modelService';
import { toast } from 'sonner';

// Define ModelPerformance interface
interface ModelPerformance {
  modelName: string;
  accuracy: number;
  precision: number;
  recall: number;
  f1Score: number;
  auc: number;
}

const Reports = () => {
  const [reportType, setReportType] = useState('monthly');
  const [modelType, setModelType] = useState<ModelType>('lightgbm');
  const [modelPerformanceData, setModelPerformanceData] = useState<ModelPerformance[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Use actual metrics from model reports (values in percentages)
    const actualModelMetrics = [
      {
        modelName: 'LightGBM',
        accuracy: 68.29,
        precision: 68.00,
        recall: 68.00,
        f1Score: 68.35,
        auc: 86.51
      },
      {
        modelName: 'XGBoost',
        accuracy: 73.09,
        precision: 73.00,
        recall: 73.00,
        f1Score: 73.10,
        auc: 89.69
      },
      {
        modelName: 'Random Forest',
        accuracy: 77.91,
        precision: 78.00,
        recall: 78.00,
        f1Score: 77.81,
        auc: 91.95
      },
      {
        modelName: 'MLP',
        accuracy: 47.74,
        precision: 60.00,
        recall: 48.00,
        f1Score: 48.36,
        auc: 66.61
      },
      {
        modelName: 'Logistic Regression',
        accuracy: 36.82,
        precision: 37.00,
        recall: 37.00,
        f1Score: 36.71,
        auc: 54.08
      }
    ];

    setModelPerformanceData(actualModelMetrics);
    setIsLoading(false);
  }, []);

  const monthlyData = [
    { name: 'Jan', actual: 18.5, predicted: 17.8 },
    { name: 'Feb', actual: 19.2, predicted: 18.9 },
    { name: 'Mar', actual: 17.8, predicted: 17.2 },
    { name: 'Apr', actual: 20.1, predicted: 19.5 },
    { name: 'May', actual: 19.7, predicted: 18.9 },
    { name: 'Jun', actual: 18.9, predicted: 18.2 }
  ];

  const riskDistributionData = [
    { name: 'Low Risk (0-25%)', value: 45, color: '#10b981' },
    { name: 'Medium Risk (26-50%)', value: 30, color: '#f59e0b' },
    { name: 'High Risk (51-75%)', value: 15, color: '#ef4444' },
    { name: 'Very High Risk (>75%)', value: 10, color: '#7f1d1d' }
  ];

  const handleExportReports = () => {
    try {
      // Prepare the report data
      const reportData = {
        timestamp: new Date().toISOString(),
        modelPerformance: modelPerformanceData,
        monthlyTrends: monthlyData,
        riskDistribution: riskDistributionData
      };

      // Convert to JSON and create blob
      const jsonString = JSON.stringify(reportData, null, 2);
      const blob = new Blob([jsonString], { type: 'application/json' });
      
      // Create download link and trigger download
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `readmission-report-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast.success('Report exported successfully');
    } catch (error) {
      console.error('Error exporting report:', error);
      toast.error('Failed to export report');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Reports</h1>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Model Performance Reports</h1>
          <p className="text-gray-500 mt-1">Analyze readmission prediction model performance</p>
        </div>
        <div className="mt-4 md:mt-0 flex flex-col sm:flex-row gap-3">
          <Button variant="outline" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span>Last 6 months</span>
          </Button>
          <Button 
            className="bg-medical-600 hover:bg-medical-700 text-white flex items-center gap-2"
            onClick={handleExportReports}
          >
            <Download className="h-4 w-4" />
            <span>Export Reports</span>
          </Button>
        </div>
      </div>
      
      <div className="space-y-6">
        <DashboardCard title="Model Performance Metrics">
          <div className="mb-4 flex flex-col sm:flex-row gap-3">
            <div className="w-full sm:w-48">
              <Select value={reportType} onValueChange={setReportType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select report type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="monthly">Monthly Comparison</SelectItem>
                  <SelectItem value="models">Model Comparison</SelectItem>
                  <SelectItem value="metrics">Metrics Breakdown</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="w-full sm:w-48">
              <Select value={modelType} onValueChange={(value) => setModelType(value as ModelType)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select model" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Models</SelectItem>
                  <SelectItem value="logistic_regression">Logistic Regression</SelectItem>
                  <SelectItem value="random_forest">Random Forest</SelectItem>
                  <SelectItem value="xgboost">XGBoost</SelectItem>
                  <SelectItem value="lightgbm">LightGBM</SelectItem>
                  <SelectItem value="mlp">MLP (Deep Learning)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              {reportType === 'monthly' ? (
                <AreaChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis domain={[0, 30]} tickFormatter={(value) => `${value}%`} />
                  <Tooltip formatter={(value) => `${Number(value).toFixed(1)}%`} />
                  <Legend />
                  <Area 
                    type="monotone" 
                    dataKey="actual" 
                    name="Actual Readmission Rate" 
                    stroke="#3b82f6" 
                    fill="#93c5fd" 
                  />
                  <Area 
                    type="monotone" 
                    dataKey="predicted" 
                    name="Predicted Readmission Rate" 
                    stroke="#8b5cf6" 
                    fill="#c4b5fd" 
                  />
                </AreaChart>
              ) : reportType === 'models' ? (
                <RechartsBarChart
                  data={modelPerformanceData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="modelName" />
                  <YAxis domain={[0, 100]} tickFormatter={(value) => `${value}%`} />
                  <Tooltip formatter={(value) => `${Number(value).toFixed(2)}%`} />
                  <Legend />
                  <Bar dataKey="accuracy" name="Accuracy" fill="#3b82f6" />
                  <Bar dataKey="precision" name="Precision" fill="#8b5cf6" />
                  <Bar dataKey="recall" name="Recall" fill="#10b981" />
                  <Bar dataKey="f1Score" name="F1 Score" fill="#f59e0b" />
                </RechartsBarChart>
              ) : (
                <RechartsBarChart
                  data={modelPerformanceData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="modelName" />
                  <YAxis domain={[0, 100]} tickFormatter={(value) => `${value}%`} />
                  <Tooltip formatter={(value) => `${Number(value).toFixed(2)}%`} />
                  <Legend />
                  <Bar dataKey="auc" name="AUC" fill="#3b82f6" />
                </RechartsBarChart>
              )}
            </ResponsiveContainer>
          </div>
        </DashboardCard>

        <DashboardCard title="Patient Risk Distribution">
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={riskDistributionData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {riskDistributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value}%`, 'Percentage']} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </DashboardCard>

        <DashboardCard title="Detailed Model Performance">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Model
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Accuracy
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Precision
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Recall
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    F1 Score
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    AUC
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {modelPerformanceData.map((model, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{model.modelName}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {model.accuracy.toFixed(2)}%
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {model.precision.toFixed(2)}%
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {model.recall.toFixed(2)}%
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {model.f1Score.toFixed(2)}%
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {model.auc.toFixed(2)}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </DashboardCard>
      </div>
    </div>
  );
};

export default Reports;
