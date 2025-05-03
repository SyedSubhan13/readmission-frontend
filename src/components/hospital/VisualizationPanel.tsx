
import React, { useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { Download, Eye, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';

interface VisualizationData {
  readmissionRates: number[];
  months: string[];
  ageGroups: {
    labels: string[];
    data: number[];
  };
  diagnoses: {
    labels: string[];
    data: number[];
  };
}

interface VisualizationPanelProps {
  data: VisualizationData | null;
  onReset: () => void;
}

const VisualizationPanel: React.FC<VisualizationPanelProps> = ({ data, onReset }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (data && cardRef.current) {
      cardRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [data]);

  if (!data) return null;

  // Format data for charts
  const lineChartData = data.months.map((month, index) => ({
    name: month,
    value: data.readmissionRates[index],
  }));

  const ageGroupData = data.ageGroups.labels.map((label, index) => ({
    name: label,
    value: data.ageGroups.data[index],
  }));

  const diagnosesData = data.diagnoses.labels.map((label, index) => ({
    name: label,
    value: data.diagnoses.data[index],
  }));

  // Colors for the charts
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

  const downloadChartAsImage = (chartId: string, fileName: string) => {
    const chartElement = document.getElementById(chartId);
    if (!chartElement) return;
    
    // Simulate download - in a real app, you would use html2canvas or similar
    console.log(`Download ${fileName} chart`);
  };

  return (
    <div className="space-y-6 animate-scale-in" ref={cardRef}>
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Analysis Results</h2>
        <Button variant="outline" size="sm" onClick={onReset} className="hover-lift">
          <RefreshCw className="mr-2 h-4 w-4" />
          Reset
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Readmission Rates Over Time */}
        <Card className="shadow-card hover:shadow-elevated transition-all duration-300">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle>Readmission Rates</CardTitle>
                <CardDescription>Monthly trends over time</CardDescription>
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => downloadChartAsImage('readmission-chart', 'readmission-rates')}
                className="hover:bg-accent/50"
              >
                <Download size={16} />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="h-[300px]" id="readmission-chart">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={lineChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f3f3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.85)', 
                    borderRadius: '6px', 
                    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
                    border: 'none'
                  }}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  name="Readmission Rate (%)" 
                  stroke="#2563eb" 
                  strokeWidth={2}
                  dot={{ strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, stroke: '#2563eb', strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        
        {/* Age Group Distribution */}
        <Card className="shadow-card hover:shadow-elevated transition-all duration-300">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle>Age Distribution</CardTitle>
                <CardDescription>Readmission rates by age group</CardDescription>
              </div>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => downloadChartAsImage('age-chart', 'age-distribution')}
                className="hover:bg-accent/50"
              >
                <Download size={16} />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="h-[300px]" id="age-chart">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={ageGroupData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f3f3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.85)', 
                    borderRadius: '6px', 
                    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
                    border: 'none'
                  }}
                />
                <Legend />
                <Bar 
                  dataKey="value" 
                  name="Readmission Rate (%)" 
                  fill="#3b82f6" 
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        
        {/* Diagnoses Distribution */}
        <Card className="shadow-card hover:shadow-elevated transition-all duration-300 md:col-span-2">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle>Diagnoses Distribution</CardTitle>
                <CardDescription>Readmission by primary diagnosis</CardDescription>
              </div>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => downloadChartAsImage('diagnoses-chart', 'diagnoses-distribution')}
                className="hover:bg-accent/50"
              >
                <Download size={16} />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="h-[350px]" id="diagnoses-chart">
            <div className="grid grid-cols-1 md:grid-cols-2 h-full">
              <div className="flex items-center justify-center">
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={diagnosesData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                      animationBegin={200}
                      animationDuration={800}
                    >
                      {diagnosesData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value: number) => [`${value}%`, 'Readmission Rate']}
                      contentStyle={{ 
                        backgroundColor: 'rgba(255, 255, 255, 0.85)', 
                        borderRadius: '6px', 
                        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
                        border: 'none'
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex flex-col justify-center p-4">
                <h4 className="text-lg font-medium mb-3">Key Findings</h4>
                <ul className="space-y-3">
                  {diagnosesData.map((item, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: COLORS[index % COLORS.length] }}
                      />
                      <span className="text-sm">
                        <strong>{item.name}:</strong> {item.value}% readmission rate
                      </span>
                    </li>
                  ))}
                </ul>
                <div className="mt-4 pt-4 border-t">
                  <Button 
                    variant="outline" 
                    className="w-full hover-lift"
                    onClick={() => console.log('View detailed report')}
                  >
                    <Eye className="mr-2 h-4 w-4" />
                    View Detailed Report
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="flex justify-end gap-4 mt-2">
        <Button 
          variant="outline" 
          onClick={() => console.log('Download Raw Data')}
          className="hover-lift"
        >
          <Download className="mr-2 h-4 w-4" />
          Download Raw Data
        </Button>
        <Button 
          onClick={() => console.log('Download Full Report')}
          className="hover-lift"
        >
          <Download className="mr-2 h-4 w-4" />
          Download Full Report
        </Button>
      </div>
    </div>
  );
};

export default VisualizationPanel;
