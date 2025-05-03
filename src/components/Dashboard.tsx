import React, { useEffect, useState } from 'react';
import { getPatientData, PatientData } from '../services/modelService';

const DataDisplay: React.FC = () => {
  const [patientData, setPatientData] = useState<PatientData[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Get the auto-loaded data
    getPatientData()
      .then(data => {
        setPatientData(data);
        setIsLoading(false);
        console.log("Patient data loaded in component:", data.length);
      })
      .catch(error => {
        console.error("Error loading patient data:", error);
        setIsLoading(false);
      });
  }, []);

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading patient data...</p>
      </div>
    );
  }

  if (!patientData || patientData.length === 0) {
    return <div>No patient data available</div>;
  }

  // Display a simple table with the first 10 records
  return (
    <div className="data-display">
      <h3>Patient Data ({patientData.length} records loaded)</h3>
      <div className="data-table-container">
        <table className="data-table">
          <thead>
            <tr>
              {Object.keys(patientData[0]).slice(0, 8).map(key => (
                <th key={key}>{key}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {patientData.slice(0, 10).map((patient, index) => (
              <tr key={index}>
                {Object.keys(patient).slice(0, 8).map(key => (
                  <td key={key}>{String(patient[key])}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DataDisplay; 