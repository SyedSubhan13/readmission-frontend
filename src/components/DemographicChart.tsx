import React, { useMemo } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { PatientData } from '@/services/modelService';

interface DemographicChartProps {
  data: PatientData[];
}

const DemographicChart: React.FC<DemographicChartProps> = ({ data }) => {
  // Define colors
  const COLORS = {
    readmitted: '#ef4444',
    notReadmitted: '#10b981'
  };
  
  // Helper function to determine if a patient was readmitted
  const isReadmitted = (patient: PatientData): boolean => {
    // According to PatientData type, readmitted can be 'YES', 'NO', '<30', or '>30'
    // We consider 'YES' and '<30' as readmitted
    const value = patient.readmitted;
    return value === 'YES' || value === '<30';
  };
  
  // Get a balanced sample of the data (max 1000 records)
  const sampleData = useMemo(() => {
    // If data is small enough, use all of it
    if (data.length <= 1000) return data;
    
    // Otherwise, get a balanced sample
    const readmittedPatients = data.filter(isReadmitted);
    const notReadmittedPatients = data.filter(p => !isReadmitted(p));
    
    // Get equal samples from each group (up to 500 each)
    const readmittedSample = readmittedPatients
      .sort(() => 0.5 - Math.random())
      .slice(0, 500);
      
    const notReadmittedSample = notReadmittedPatients
      .sort(() => 0.5 - Math.random())
      .slice(0, 500);
      
    return [...readmittedSample, ...notReadmittedSample];
  }, [data]);
  
  // Create age groups with readmission data
  const ageGroups = useMemo(() => {
    const groups = [
      { name: '<30', readmitted: 0, notReadmitted: 0 },
      { name: '30-44', readmitted: 0, notReadmitted: 0 },
      { name: '45-59', readmitted: 0, notReadmitted: 0 },
      { name: '60-74', readmitted: 0, notReadmitted: 0 },
      { name: '75+', readmitted: 0, notReadmitted: 0 },
    ];
    
    // Process data for age groups
    sampleData.forEach(patient => {
      const age = patient.age || 0;
      const wasReadmitted = isReadmitted(patient);
      
      let groupIndex;
      if (age < 30) groupIndex = 0;
      else if (age < 45) groupIndex = 1;
      else if (age < 60) groupIndex = 2;
      else if (age < 75) groupIndex = 3;
      else groupIndex = 4;
      
      if (wasReadmitted) {
        groups[groupIndex].readmitted++;
      } else {
        groups[groupIndex].notReadmitted++;
      }
    });
    
    return groups;
  }, [sampleData]);
  
  // Process data for gender distribution
  const genderChartData = useMemo(() => {
    const genderData = sampleData.reduce((acc: Record<string, { readmitted: number, notReadmitted: number }>, patient) => {
      const gender = patient.gender || 'Unknown';
      const wasReadmitted = isReadmitted(patient);
      
      if (!acc[gender]) {
        acc[gender] = { readmitted: 0, notReadmitted: 0 };
      }
      
      if (wasReadmitted) {
        acc[gender].readmitted++;
      } else {
        acc[gender].notReadmitted++;
      }
      
      return acc;
    }, {});
    
    return Object.entries(genderData)
      .filter(([name]) => name && name !== 'Unknown' && name !== 'undefined')
      .map(([name, counts]) => ({
        name,
        readmitted: counts.readmitted,
        notReadmitted: counts.notReadmitted,
        total: counts.readmitted + counts.notReadmitted
      }));
  }, [sampleData]);
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-full">
      <div className="h-full">
        <h4 className="text-sm font-medium mb-2 text-gray-700">Readmission by Age Group</h4>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={ageGroups}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip 
              formatter={(value, name) => [
                `${value} patients`, 
                name === 'readmitted' ? 'Readmitted' : 'Not Readmitted'
              ]}
            />
            <Legend />
            <Bar 
              dataKey="readmitted" 
              name="Readmitted" 
              stackId="a" 
              fill={COLORS.readmitted} 
            />
            <Bar 
              dataKey="notReadmitted" 
              name="Not Readmitted" 
              stackId="a" 
              fill={COLORS.notReadmitted} 
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
      
      <div className="h-full">
        <h4 className="text-sm font-medium mb-2 text-gray-700">Readmission by Gender</h4>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={genderChartData}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip 
              formatter={(value, name) => [
                `${value} patients`, 
                name === 'readmitted' ? 'Readmitted' : 'Not Readmitted'
              ]}
            />
            <Legend />
            <Bar 
              dataKey="readmitted" 
              name="Readmitted" 
              stackId="a" 
              fill={COLORS.readmitted} 
            />
            <Bar 
              dataKey="notReadmitted" 
              name="Not Readmitted" 
              stackId="a" 
              fill={COLORS.notReadmitted} 
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default DemographicChart; 