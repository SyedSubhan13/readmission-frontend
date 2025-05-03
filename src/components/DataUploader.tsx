import React, { useState, useRef } from 'react';
import { Upload, FileText, CheckCircle, AlertCircle, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Progress } from '@/components/ui/progress';
import { PatientData } from '@/services/modelService';

interface DataUploaderProps {
  onDataUploaded: (data: PatientData[]) => void;
}

// Number of records to use for visualization
const VISUALIZATION_SAMPLE_SIZE = 1000;

const DataUploader: React.FC<DataUploaderProps> = ({ onDataUploaded }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [fileSelected, setFileSelected] = useState<File | null>(null);
  const [isLargeFile, setIsLargeFile] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setFileSelected(file);
      
      // Check if file is large (> 1MB)
      if (file.size > 1024 * 1024) {
        setIsLargeFile(true);
        toast.info("Large file detected. A representative sample will be used for visualization.");
      } else {
        setIsLargeFile(false);
      }
    }
  };

  const handleUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const parseCSV = (text: string): PatientData[] => {
    const lines = text.split('\n');
    if (lines.length < 2) {
      throw new Error('CSV file must have at least a header row and one data row');
    }
    
    const headers = lines[0].split(',').map(h => h.trim());
    const totalLines = lines.length;
    
    const data: PatientData[] = [];
    for (let i = 1; i < totalLines; i++) {
      const line = lines[i].trim();
      if (!line) continue;
      
      const values = line.split(',');
      if (values.length !== headers.length) {
        console.warn(`Line ${i} has ${values.length} values, expected ${headers.length}`);
        continue;
      }
      
      const record: PatientData = {};
      headers.forEach((header, index) => {
        const value = values[index].trim();
        
        // Try to convert numeric values
        if (!isNaN(Number(value)) && value !== '') {
          record[header] = Number(value);
        } else if (value.toLowerCase() === 'true') {
          record[header] = true;
        } else if (value.toLowerCase() === 'false') {
          record[header] = false;
        } else if (value === '') {
          record[header] = null;
        } else {
          record[header] = value;
        }
      });
      
      data.push(record);
      
      // Update progress every 5% of total lines
      if (i % Math.max(1, Math.floor(totalLines / 20)) === 0) {
        const progressPercent = Math.min(95, Math.round((i / totalLines) * 95));
        setProgress(progressPercent);
      }
    }
    
    return data;
  };

  // Function to get a representative sample of records
  const getSampleForVisualization = (data: PatientData[]): PatientData[] => {
    if (data.length <= VISUALIZATION_SAMPLE_SIZE) {
      return data;
    }

    // Calculate the step size to get an evenly distributed sample
    const step = Math.floor(data.length / VISUALIZATION_SAMPLE_SIZE);
    const sample: PatientData[] = [];
    
    // Take evenly distributed samples
    for (let i = 0; i < VISUALIZATION_SAMPLE_SIZE && i * step < data.length; i++) {
      sample.push(data[i * step]);
    }
    
    return sample;
  };

  const handleProcess = async () => {
    if (!fileSelected) {
      toast.error('Please select a file first');
      return;
    }

    const allowedExtensions = /(\.csv)$/i;
    if (!allowedExtensions.exec(fileSelected.name)) {
      toast.error('Please upload a CSV file only');
      return;
    }

    setIsProcessing(true);
    setProgress(0);

    try {
      // Read and parse the file content
      const fileContent = await fileSelected.text();
      setProgress(30);
      
      // Parse all data
      const allData = parseCSV(fileContent);
      console.log("Parsed CSV data:", allData.length, "total records");
      
      // Get sample for visualization
      const visualizationSample = getSampleForVisualization(allData);
      console.log("Using", visualizationSample.length, "records for visualization");
      
      // Complete the progress
      setProgress(100);
      setTimeout(() => {
        setIsProcessing(false);
        setFileSelected(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
        
        // Pass the visualization sample to the parent component
        if (visualizationSample && Array.isArray(visualizationSample)) {
          onDataUploaded(visualizationSample);
          toast.success(`Successfully processed ${allData.length} patient records`);
          
          if (allData.length > VISUALIZATION_SAMPLE_SIZE) {
            toast.info(`Using ${visualizationSample.length} evenly distributed records for visualization.`);
          }
        } else {
          toast.error('Failed to process data');
        }
      }, 500);
      
    } catch (error) {
      console.error("Error processing file:", error);
      toast.error(error instanceof Error ? error.message : 'Failed to process data');
      setIsProcessing(false);
      setProgress(0);
    }
  };

  return (
    <div className="border border-dashed border-gray-300 rounded-lg p-6 bg-gray-50">
      <input
        type="file"
        accept=".csv"
        className="hidden"
        ref={fileInputRef}
        onChange={handleFileChange}
      />
      
      <div className="text-center mb-4">
        <div className="inline-flex p-3 rounded-full bg-gray-100 mb-3">
          <Upload className="h-6 w-6 text-gray-500" />
        </div>
        <h3 className="text-lg font-medium mb-1">Process Patient Data</h3>
        <p className="text-sm text-gray-500">
          Select a CSV file to process for data visualization
        </p>
      </div>
      
      {fileSelected ? (
        <div className="flex items-center justify-between p-3 bg-white rounded-md border mb-4">
          <div className="flex items-center">
            <FileText className="h-5 w-5 text-gray-500 mr-2" />
            <span className="text-sm font-medium truncate max-w-[150px]">
              {fileSelected.name}
            </span>
            <span className="text-xs text-gray-500 ml-2">
              ({Math.round(fileSelected.size / 1024)} KB)
            </span>
          </div>
          <CheckCircle className="h-4 w-4 text-green-500" />
        </div>
      ) : null}
      
      {isLargeFile && fileSelected && (
        <div className="flex items-center p-3 bg-blue-50 border border-blue-200 rounded-md mb-4 text-blue-800 text-sm">
          <AlertTriangle className="h-4 w-4 mr-2 flex-shrink-0" />
          <span>
            Large file detected ({Math.round(fileSelected.size / 1024)} KB). An evenly distributed sample will be used for visualization.
          </span>
        </div>
      )}
      
      {isProcessing && (
        <div className="mb-4">
          <div className="flex justify-between text-xs mb-1">
            <span>Processing...</span>
            <span>{progress}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      )}
      
      <div className="flex space-x-3">
        {!fileSelected ? (
          <Button 
            onClick={handleUploadClick} 
            className="w-full"
            variant="outline"
          >
            <Upload className="h-4 w-4 mr-2" />
            Select CSV File
          </Button>
        ) : (
          <>
            <Button
              variant="outline"
              onClick={() => {
                setFileSelected(null);
                setIsLargeFile(false);
                if (fileInputRef.current) {
                  fileInputRef.current.value = '';
                }
              }}
              className="flex-1"
              disabled={isProcessing}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleProcess} 
              className="flex-1"
              disabled={isProcessing}
            >
              {isProcessing ? 'Processing...' : 'Process Data'}
            </Button>
          </>
        )}
      </div>
      
      <div className="mt-4 text-xs text-gray-500">
        <p className="flex items-center">
          <AlertCircle className="h-3 w-3 mr-1" />
          File should be in CSV format with headers matching the required fields
        </p>
        <p className="mt-1">Example: encounter_id, patient_nbr, time_in_hospital, etc.</p>
      </div>
    </div>
  );
};

export default DataUploader;
