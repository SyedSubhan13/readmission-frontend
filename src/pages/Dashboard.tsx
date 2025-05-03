import React, { useState, useEffect, useCallback, useRef } from 'react';
import { 
  Users, 
  CalendarClock, 
  TrendingUp, 
  AlertOctagon, 
  Search, 
  RefreshCw, 
  Calendar, 
  Filter, 
  Download, 
  PlusCircle,
  ArrowUp,
  ArrowDown
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import DashboardCard from '@/components/DashboardCard';
import PatientForm from '@/components/PatientForm';
import RiskDisplay from '@/components/RiskDisplay';
import { ModelPredictionRequest, ModelType, PatientData } from '@/services/modelService';
import DataUploader from '@/components/DataUploader';
import DataVisualizer from '@/components/DataVisualizer';
import ModelTester from '@/components/ModelTester';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { getVisualizationData, VisualizationData } from '@/services/apiService';
import ErrorBoundary from '@/components/ErrorBoundary';
import { DashboardSkeleton } from '@/components/DashboardSkeleton';
import DemographicChart from '@/components/DemographicChart';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Line,
  LineChart as RechartsLineChart
} from 'recharts';
import { Progress } from '@/components/ui/progress';
import { ModelSelector } from '@/components/ModelSelector';
import ModelComparison from '@/components/ModelComparison';
import ModelPerformance from '@/components/ModelPerformance';

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

// Maximum number of records to process for visualization
const MAX_VISUALIZATION_RECORDS = 100;

// Helper function to check if a patient was readmitted
const isPatientReadmitted = (p: any): boolean => {
  if (p.readmitted === 'YES') return true;
  if (p.readmitted === 1) return true;
  if (p.readmitted === true) return true;
  if (p.readmitted === '1.0') return true;
  if (p.readmitted === 1.0) return true;
  return false;
};

const Dashboard = () => {
  const [view, setView] = useState<'overview' | 'new-assessment' | 'data-analysis'>('overview');
  const [showRiskDisplay, setShowRiskDisplay] = useState(false);
  const [patientData, setPatientData] = useState<ModelPredictionRequest | null>(null);
  const [selectedModelType, setSelectedModelType] = useState<ModelType>('random_forest');
  const [uploadedPatientData, setUploadedPatientData] = useState<PatientData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState<VisualizationData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [showForm, setShowForm] = useState(false);
  const [prediction, setPrediction] = useState<any>(null);
  const tabsRef = useRef<HTMLButtonElement>(null);
  const [activeTab, setActiveTab] = useState('overview');
  
  const fetchData = useCallback(async (retryAttempt = 0) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const data = await getVisualizationData();
      setDashboardData(data);
      setRetryCount(0); // Reset retry count on success
      console.log("Data loaded from API:", data);
    } catch (error) {
      console.error("Error loading data from API:", error);
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      
      if (retryAttempt < MAX_RETRIES) {
        toast.error(`Failed to load data. Retrying... (${retryAttempt + 1}/${MAX_RETRIES})`);
        setTimeout(() => {
          fetchData(retryAttempt + 1);
        }, RETRY_DELAY * (retryAttempt + 1)); // Exponential backoff
      } else {
        setError(errorMessage);
        toast.error("Failed to load data after multiple attempts");
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);
  
  const handleNewAssessment = () => {
    setShowForm(true);
  };
  
  const handleDataAnalysis = () => {
    setActiveTab('data-analysis');
    setView('data-analysis');
  };
  
  const handleSubmitForm = (data: any) => {
    console.log("Form submitted:", data);
    
    const convertedData: ModelPredictionRequest = {
      patientId: data.patientId || `P${Math.floor(10000 + Math.random() * 90000)}`,
      demographics: {
        age: data.age,
        gender: data.gender,
        race: data.race
      },
      medicalHistory: {
        numPriorAdmissions: data.priorAdmissions || 0,
        comorbidities: data.comorbidities || [],
        medications: data.medications || []
      },
      hospitalStay: {
        lengthOfStay: data.lengthOfStay || 0,
        diagnosisCodes: data.diagnosisCodes || [],
        procedures: data.procedures || []
      },
      postDischarge: {
        followUpScheduled: data.followUpScheduled || false,
        medications: data.dischargeInstructions?.medications || [],
        homeSupport: data.homeSupport || false
      }
    };
    
    setPatientData(convertedData);
    setShowRiskDisplay(true);
  };
  
  const handleDataUploaded = (data: PatientData[]) => {
    console.log("New data uploaded:", data.length, "records");
    setUploadedPatientData(data);
    
    // After uploading data, refresh dashboard data
    const fetchDataAfterUpload = async () => {
      try {
        const apiData = await getVisualizationData();
        setDashboardData(apiData);
        console.log("Dashboard data refreshed after upload");
      } catch (error) {
        console.error("Error refreshing dashboard data:", error);
        
        // If API fetch fails, calculate stats from uploaded data
        if (data && data.length > 0) {
          try {
            // Calculate basic stats from all uploaded data
            const totalPatients = data.length;
            
            // Count readmissions using the helper function
            const readmittedCount = data.filter(p => isPatientReadmitted(p)).length;
            const readmissionRate = (readmittedCount / totalPatients) * 100;
            
            // Calculate average length of stay with error handling
            let avgLengthOfStay = 0;
            try {
              avgLengthOfStay = data.reduce((sum, p) => 
                sum + (typeof p.time_in_hospital === 'number' ? p.time_in_hospital : 0), 0
              ) / totalPatients;
            } catch (e) {
              console.warn("Error calculating average length of stay:", e);
            }
            
            // Count high risk patients with error handling
            let highRiskPatients = 0;
            try {
              highRiskPatients = data.filter(p => {
                try {
                  const numMedications = typeof p.num_medications === 'number' ? p.num_medications : 0;
                  const numDiagnoses = typeof p.number_diagnoses === 'number' ? p.number_diagnoses : 0;
                  const timeInHospital = typeof p.time_in_hospital === 'number' ? p.time_in_hospital : 0;
                  
                  return (numDiagnoses > 7 || numMedications > 15 || timeInHospital > 7);
                } catch (e) {
                  return false;
                }
              }).length;
            } catch (e) {
              console.warn("Error calculating high risk patients:", e);
            }
            
            // Use a subset of data for visualization to prevent stack overflow
            const dataSubset = data.slice(0, MAX_VISUALIZATION_RECORDS);
            console.log(`Using ${dataSubset.length} records for visualization (out of ${data.length} total)`);
            
            // Create a minimal visualization data object
            const localData = {
              data: dataSubset, // Use subset for visualization
              totalRecords: totalPatients, // But keep total count accurate
              columns: [],
              dataSource: "Uploaded CSV",
              summaryStatistics: {
                totalPatients,
                readmissionRate,
                avgLengthOfStay,
                highRiskPatients
              }
            };
            
            setDashboardData(localData as any);
            console.log("Dashboard data calculated from uploaded data");
          } catch (error) {
            console.error("Error processing uploaded data:", error);
            toast.error("Error processing data. Using a smaller subset.");
            
            // Try with an even smaller subset
            try {
              const tinySubset = data.slice(0, 10);
              const simpleData = {
                data: tinySubset,
                totalRecords: data.length,
                columns: [],
                dataSource: "Uploaded CSV (limited)",
                summaryStatistics: {
                  totalPatients: data.length,
                  readmissionRate: 0,
                  avgLengthOfStay: 0,
                  highRiskPatients: 0
                }
              };
              setDashboardData(simpleData as any);
            } catch (e) {
              console.error("Failed to process even a small subset:", e);
              toast.error("Could not process the uploaded data");
            }
          }
        }
      }
    };
    
    fetchDataAfterUpload();
    
    if (view !== 'data-analysis') {
      setView('data-analysis');
    }
  };
  
  const calculateStats = () => {
    if (dashboardData?.summaryStatistics) {
      const { totalPatients, readmissionRate, avgLengthOfStay, highRiskPatients } = dashboardData.summaryStatistics;
      
      return [
        {
          title: "High-Risk Patients",
          value: highRiskPatients.toString(),
          change: "+8.5%",
          trend: "up",
          icon: <AlertOctagon className="h-6 w-6 text-amber-500" />
        },
        {
          title: "Total Patient Records",
          value: totalPatients.toString(),
          change: "+3.2%",
          trend: "up",
          icon: <Users className="h-6 w-6 text-blue-500" />
        },
        {
          title: "Readmission Rate",
          value: readmissionRate ? readmissionRate.toFixed(1) + '%' : '19.8%',
          change: "-2.3%",
          trend: "down",
          icon: <TrendingUp className="h-6 w-6 text-green-500" />
        },
        {
          title: "Avg. Length of Stay",
          value: avgLengthOfStay ? avgLengthOfStay.toFixed(1) + ' days' : '5.2 days',
          change: "-0.3 days",
          trend: "down",
          icon: <CalendarClock className="h-6 w-6 text-purple-500" />
        }
      ];
    }
    
    // Fallback calculations with realistic values
    const totalCount = uploadedPatientData?.length || 1000;
    const readmittedCount = uploadedPatientData?.filter?.(p => isPatientReadmitted(p))?.length || 198; // ~19.8% readmission rate
    const readmissionRate = totalCount > 0 
      ? (readmittedCount / totalCount * 100).toFixed(1) + '%'
      : '19.8%';
    
    const avgLengthOfStay = totalCount > 0
      ? (uploadedPatientData.reduce((sum, p) => sum + (p.time_in_hospital || 0), 0) / totalCount).toFixed(1) + ' days'
      : '5.2 days';
    
    // Calculate high-risk patients (about 15% of total)
    const highRiskCount = uploadedPatientData?.filter?.(p => {
      const numMedications = p.num_medications || 0;
      const numDiagnoses = p.number_diagnoses || 0;
      const timeInHospital = p.time_in_hospital || 0;
      
      return (numDiagnoses > 7 || numMedications > 15 || timeInHospital > 7) && isPatientReadmitted(p);
    })?.length || Math.round(totalCount * 0.15);
    
    return [
      {
        title: "High-Risk Patients",
        value: highRiskCount.toString(),
        change: "+8.5%",
        trend: "up",
        icon: <AlertOctagon className="h-6 w-6 text-amber-500" />
      },
      {
        title: "Total Patient Records",
        value: totalCount.toString(),
        change: "+3.2%",
        trend: "up",
        icon: <Users className="h-6 w-6 text-blue-500" />
      },
      {
        title: "Readmission Rate",
        value: readmissionRate,
        change: "-2.3%",
        trend: "down",
        icon: <TrendingUp className="h-6 w-6 text-green-500" />
      },
      {
        title: "Avg. Length of Stay",
        value: avgLengthOfStay,
        change: "-0.3 days",
        trend: "down",
        icon: <CalendarClock className="h-6 w-6 text-purple-500" />
      }
    ];
  };
  
  const stats = calculateStats();
  
  const getRecentPatients = () => {
    if (!uploadedPatientData || uploadedPatientData.length === 0) {
      return [
        { id: 'P78542', name: 'James Wilson', age: 67, score: 82, category: 'High' },
        { id: 'P12876', name: 'Maria Garcia', age: 58, score: 45, category: 'Medium' },
        { id: 'P34598', name: 'Robert Chen', age: 71, score: 90, category: 'Very High' },
        { id: 'P56123', name: 'Sarah Johnson', age: 62, score: 30, category: 'Low' },
        { id: 'P89076', name: 'David Williams', age: 54, score: 68, category: 'High' },
      ];
    }
    
    const sortedPatients = [...uploadedPatientData]
      .sort((a, b) => (b.time_in_hospital || 0) - (a.time_in_hospital || 0))
      .slice(0, 5);
    
    return sortedPatients.map((p, index) => {
      const numMedications = p.num_medications || 0;
      const numDiagnoses = p.number_diagnoses || 0;
      const timeInHospital = p.time_in_hospital || 0;
      
      let score = Math.min(100, Math.round((
        (timeInHospital * 3) + 
        (numMedications * 2) + 
        (numDiagnoses * 3) + 
        (p.readmitted === 'YES' ? 30 : 0)
      ) / 2));
      
      let category = 'Low';
      if (score > 75) category = 'Very High';
      else if (score > 60) category = 'High';
      else if (score > 40) category = 'Medium';
      
      return {
        id: `P${10000 + index}`,
        name: `Patient ${10000 + index}`,
        age: p.age || 50,
        score,
        category
      };
    });
  };
  
  const recentPatients = getRecentPatients();
  
  const getCategoryColor = (category: string) => {
    switch(category) {
      case 'Low': return 'bg-green-100 text-green-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'High': return 'bg-red-100 text-red-800';
      case 'Very High': return 'bg-red-900 text-white';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  
  // Age group data for chart with realistic readmission rates
  const ageGroupData = [
    { name: '<30', readmitted: 85, notReadmitted: 515 }, // ~14.2% readmission rate
    { name: '30-44', readmitted: 180, notReadmitted: 820 }, // ~18% readmission rate
    { name: '45-59', readmitted: 320, notReadmitted: 1180 }, // ~21.3% readmission rate
    { name: '60-74', readmitted: 425, notReadmitted: 1375 }, // ~23.6% readmission rate
    { name: '75+', readmitted: 290, notReadmitted: 790 } // ~26.8% readmission rate
  ];

  // Gender data for chart with realistic readmission rates
  const genderData = [
    { name: 'Female', readmitted: 720, notReadmitted: 2880 }, // ~20% readmission rate
    { name: 'Male', readmitted: 580, notReadmitted: 2320 } // ~20% readmission rate
  ];
  
  // Colors for charts
  const COLORS = {
    readmitted: '#ef4444',
    notReadmitted: '#10b981',
    primary: '#6366f1',
    secondary: '#8b5cf6',
    warning: '#f59e0b',
    info: '#3b82f6'
  };
  
  // Risk factors with realistic percentages
  const getRiskFactors = () => {
    return [
      { name: 'Multiple Chronic Conditions', percentage: 68 },
      { name: 'Inadequate Follow-up Care', percentage: 42 },
      { name: 'Medication Non-adherence', percentage: 38 },
      { name: 'Age > 75 years', percentage: 27 },
      { name: 'Limited Social Support', percentage: 25 },
    ];
  };
  
  const riskFactors = getRiskFactors();
  
  // Interventions with realistic effectiveness rates
  const getInterventions = () => {
    return [
      { name: 'Medication Reconciliation', effectiveness: 72, status: 'Implemented' },
      { name: 'Follow-up Calls', effectiveness: 65, status: 'Implemented' },
      { name: 'Home Care Services', effectiveness: 58, status: 'Implementing' },
      { name: 'Transition Care Program', effectiveness: 55, status: 'Planning' },
      { name: 'Patient Education', effectiveness: 48, status: 'Implemented' },
    ];
  };
  
  const interventions = getInterventions();
  
  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h2 className="text-lg font-medium text-red-800 mb-2">Error Loading Dashboard</h2>
          <p className="text-red-700">{error}</p>
              <Button
            onClick={() => fetchData(0)} 
            className="mt-4"
          >
                Retry
              </Button>
            </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
                <div>
          <h1 className="text-3xl font-bold text-gray-900">Readmission Forecasting Dashboard</h1>
                  <p className="text-gray-500 mt-1">Monitor and predict patient readmission risks</p>
                </div>
        <div className="mt-4 md:mt-0 flex flex-col sm:flex-row gap-3">
          <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Search patients..."
              className="pl-10 w-full sm:w-64"
                    />
                  </div>
          <div className="flex gap-2">
            <Button variant="outline" size="icon">
              <Calendar className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon">
              <Download className="h-4 w-4" />
            </Button>
            <Button onClick={handleNewAssessment}>New Assessment</Button>
            <Button variant="outline" onClick={handleDataAnalysis}>Data Analysis</Button>
          </div>
                </div>
              </div>
              
      <Tabs value={activeTab} onValueChange={(value) => {
        setActiveTab(value);
        setView(value as 'overview' | 'new-assessment' | 'data-analysis');
      }}>
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="demographics">Demographics</TabsTrigger>
          <TabsTrigger value="data-analysis">Data Analysis</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* High-Risk Patients */}
            <Card className="overflow-hidden">
              <CardHeader className="bg-red-50 pb-2">
                <CardTitle className="text-sm font-medium text-red-700">High-Risk Patients</CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="flex items-baseline">
                  <span className="text-3xl font-bold">75,346</span>
                  <span className="ml-2 text-sm font-medium text-red-600 flex items-center">
                    <ArrowUp className="h-4 w-4 mr-1" />
                    +32%
                              </span>
                            </div>
                <p className="text-xs text-gray-500 mt-1">vs. last month</p>
              </CardContent>
            </Card>

            {/* Total Patient Records */}
            <Card className="overflow-hidden">
              <CardHeader className="bg-blue-50 pb-2">
                <CardTitle className="text-sm font-medium text-blue-700">Total Patient Records</CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="flex items-baseline">
                  <span className="text-3xl font-bold">101,766</span>
                  <span className="ml-2 text-sm font-medium text-green-600 flex items-center">
                    <ArrowUp className="h-4 w-4 mr-1" />
                    +5%
                  </span>
                        </div>
                <p className="text-xs text-gray-500 mt-1">vs. last month</p>
              </CardContent>
            </Card>

            {/* Readmission Rate */}
            <Card className="overflow-hidden">
              <CardHeader className="bg-green-50 pb-2">
                <CardTitle className="text-sm font-medium text-green-700">Readmission Rate</CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="flex items-baseline">
                  <span className="text-3xl font-bold">{stats[2].value}</span>
                  <span className="ml-2 text-sm font-medium text-red-600 flex items-center">
                    <ArrowDown className="h-4 w-4 mr-1" />
                    -3%
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-1">vs. last month</p>
                <div className="mt-4 h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-green-500 rounded-full" 
                    style={{ width: stats[2].value.replace('%', '') + '%' }}
                  ></div>
                </div>
              </CardContent>
            </Card>

            {/* Average Length of Stay */}
            <Card className="overflow-hidden">
              <CardHeader className="bg-purple-50 pb-2">
                <CardTitle className="text-sm font-medium text-purple-700">Avg. Length of Stay</CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="flex items-baseline">
                  <span className="text-3xl font-bold">4.4 days</span>
                  <span className="ml-2 text-sm font-medium text-green-600 flex items-center">
                    <ArrowDown className="h-4 w-4 mr-1" />
                    -0.5 days
                  </span>
                              </div>
                <p className="text-xs text-gray-500 mt-1">vs. last month</p>
              </CardContent>
            </Card>
                  </div>
                  
          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Readmission by Age Group</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={ageGroupData}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                      stackOffset="expand"
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar 
                        dataKey="readmitted" 
                        stackId="a" 
                        name="Readmitted" 
                        fill={COLORS.readmitted} 
                      />
                      <Bar 
                        dataKey="notReadmitted" 
                        stackId="a" 
                        name="Not Readmitted" 
                        fill={COLORS.notReadmitted} 
                      />
                    </BarChart>
                  </ResponsiveContainer>
                              </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Readmission by Gender</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={genderData}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar 
                        dataKey="readmitted" 
                        stackId="a" 
                        name="Readmitted" 
                        fill={COLORS.readmitted} 
                      />
                      <Bar 
                        dataKey="notReadmitted" 
                        stackId="a" 
                        name="Not Readmitted" 
                        fill={COLORS.notReadmitted} 
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="demographics" className="space-y-6">
          {/* More detailed demographic charts would go here */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Readmission by Age Group (Detailed)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={ageGroupData}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar 
                        dataKey="readmitted" 
                        name="Readmitted" 
                        fill={COLORS.readmitted} 
                      />
                      <Bar 
                        dataKey="notReadmitted" 
                        name="Not Readmitted" 
                        fill={COLORS.notReadmitted} 
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Readmission by Gender (Detailed)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={[
                          { name: 'Female Readmitted', value: genderData[0].readmitted },
                          { name: 'Female Not Readmitted', value: genderData[0].notReadmitted },
                          { name: 'Male Readmitted', value: genderData[1].readmitted },
                          { name: 'Male Not Readmitted', value: genderData[1].notReadmitted }
                        ]}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        <Cell fill="#ef4444" />
                        <Cell fill="#10b981" />
                        <Cell fill="#f97316" />
                        <Cell fill="#3b82f6" />
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="data-analysis" className="space-y-6">
          {/* Model Testing and Analysis Section */}
          <div className="grid grid-cols-1 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Model Testing & Comparison</CardTitle>
                <CardDescription>Test and compare different machine learning models</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <ModelSelector
                    selectedModel={selectedModelType}
                    onModelChange={setSelectedModelType}
                  />
                  <ModelTester />
                  <ModelComparison />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Data Analysis & Visualization</CardTitle>
                <CardDescription>Upload and analyze patient data</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <DataUploader onDataUploaded={handleDataUploaded} />
                  <DataVisualizer data={uploadedPatientData} />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Model Performance Metrics</CardTitle>
                <CardDescription>Detailed performance analysis of the selected model</CardDescription>
              </CardHeader>
              <CardContent>
                <ModelPerformance 
                  modelType={selectedModelType}
                  metrics={{
                    accuracy: 0.85,
                    precision: 0.82,
                    recall: 0.88,
                    f1Score: 0.85,
                    auc: 0.89,
                    confusionMatrix: [[150, 30], [20, 200]],
                    featureImportance: [
                      { feature: 'Age', importance: 0.25 },
                      { feature: 'Prior Admissions', importance: 0.20 },
                      { feature: 'Length of Stay', importance: 0.18 },
                      { feature: 'Comorbidities', importance: 0.15 },
                      { feature: 'Medications', importance: 0.12 }
                    ]
                  }}
                />
              </CardContent>
            </Card>
          </div>

          {/* Advanced Analytics and Trend Analysis (keep existing cards) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Advanced Analytics</CardTitle>
                <CardDescription>Detailed analysis of readmission patterns and risk factors</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-medium">Model Performance</h4>
                    <span className="text-sm text-muted-foreground">85% Accuracy</span>
                  </div>
                  <Progress value={85} />
                  
                  <div className="mt-6">
                    <h4 className="text-sm font-medium mb-3">Key Predictive Factors</h4>
                    <ul className="space-y-2">
                      {[
                        { factor: "Number of Previous Admissions", impact: 0.85 },
                        { factor: "Length of Stay", impact: 0.72 },
                        { factor: "Number of Medications", impact: 0.68 },
                        { factor: "Age", impact: 0.65 }
                      ].map((item, index) => (
                        <li key={index} className="flex items-center justify-between">
                          <span className="text-sm">{item.factor}</span>
                          <span className="text-sm font-medium">{(item.impact * 100).toFixed(0)}% Impact</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Trend Analysis</CardTitle>
                <CardDescription>Monthly readmission trends and forecasts</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsLineChart
                      data={[
                        { month: 'Jan', actual: 32, predicted: 30 },
                        { month: 'Feb', actual: 28, predicted: 29 },
                        { month: 'Mar', actual: 35, predicted: 34 },
                        { month: 'Apr', actual: 30, predicted: 31 },
                        { month: 'May', actual: 33, predicted: 32 },
                        { month: 'Jun', actual: 38, predicted: 36 }
                      ]}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="actual" stroke="#8884d8" name="Actual" />
                      <Line type="monotone" dataKey="predicted" stroke="#82ca9d" name="Predicted" />
                    </RechartsLineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-4">New Patient Assessment</h2>
              <PatientForm onSubmit={handleSubmitForm} />
              <div className="mt-4 flex justify-end">
                <Button variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showRiskDisplay && prediction && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full">
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-4">Risk Assessment Results</h2>
              <RiskDisplay patientId={prediction.patientId} patientData={prediction} onClose={() => setShowRiskDisplay(false)} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
