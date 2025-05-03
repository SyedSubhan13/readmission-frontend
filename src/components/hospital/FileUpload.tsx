
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { toast } from '@/components/ui/sonner';
import { Upload, X, File, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLocalStorage } from '@/hooks/useLocalStorage';

interface FileUploadProps {
  onFileProcessed: (data: any) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileProcessed }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [progress, setProgress] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [storedFileName, setStoredFileName] = useLocalStorage('uploadedFileName', '');

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (selectedFile: File) => {
    // Check if file is CSV or Excel
    const validTypes = ['text/csv', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'];
    if (!validTypes.includes(selectedFile.type)) {
      toast.error('Invalid file format', {
        description: 'Please upload a CSV or Excel file.'
      });
      return;
    }
    
    // Check file size (max 10MB)
    if (selectedFile.size > 10 * 1024 * 1024) {
      toast.error('File too large', {
        description: 'Maximum file size is 10MB.'
      });
      return;
    }
    
    setFile(selectedFile);
    setStoredFileName(selectedFile.name);
    toast.success('File selected', {
      description: `${selectedFile.name} is ready for processing.`
    });
  };

  const removeFile = () => {
    setFile(null);
    setStoredFileName('');
    setProgress(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const processFile = () => {
    if (!file) return;
    
    setIsProcessing(true);
    setProgress(0);
    
    // Simulate file processing with progress updates
    const interval = setInterval(() => {
      setProgress((prev) => {
        const newProgress = prev + 5;
        if (newProgress >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsProcessing(false);
            // Generate mock data for visualization
            const mockData = generateMockData();
            onFileProcessed(mockData);
            toast.success('File processed successfully');
          }, 500);
          return 100;
        }
        return newProgress;
      });
    }, 150);
  };

  // Generate mock data for visualization purposes
  const generateMockData = () => {
    return {
      readmissionRates: [25, 18, 22, 16, 20, 14, 19],
      months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
      ageGroups: {
        labels: ['18-24', '25-34', '35-44', '45-54', '55-64', '65+'],
        data: [10, 15, 18, 22, 27, 35]
      },
      diagnoses: {
        labels: ['Heart Disease', 'Diabetes', 'Pneumonia', 'COPD', 'Cancer', 'Other'],
        data: [30, 25, 15, 12, 8, 10]
      }
    };
  };

  return (
    <div className="w-full mb-6 animate-fade-in">
      <div
        className={cn(
          "border-2 border-dashed rounded-lg p-8 text-center transition-all duration-300 ease-spring",
          isDragging ? "border-primary bg-primary/5" : "border-border hover:border-primary/50",
          file ? "bg-secondary/50" : ""
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {!file ? (
          <div className="flex flex-col items-center justify-center">
            <Upload size={36} className="text-muted-foreground mb-3" />
            <h3 className="text-lg font-medium mb-1">Upload Dataset</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Drag and drop your file here or click to browse
            </p>
            <Button 
              variant="outline" 
              onClick={() => fileInputRef.current?.click()}
              className="hover-lift"
            >
              Browse Files
            </Button>
            <input
              type="file"
              className="hidden"
              ref={fileInputRef}
              onChange={handleFileInput}
              accept=".csv,.xlsx,.xls"
            />
            <p className="text-xs text-muted-foreground mt-3">
              Supported formats: .CSV, .XLSX, .XLS (max 10MB)
            </p>
          </div>
        ) : (
          <div className="animate-scale-in">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <File size={24} className="text-primary mr-2" />
                <div className="text-left">
                  <p className="font-medium text-sm truncate max-w-[200px]">{file.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={removeFile}
                disabled={isProcessing}
                className="text-muted-foreground hover:text-destructive"
              >
                <X size={16} />
              </Button>
            </div>
            
            {isProcessing && (
              <div className="mb-4">
                <Progress value={progress} className="h-2" />
                <p className="text-xs text-muted-foreground mt-1">
                  Processing: {progress}%
                </p>
              </div>
            )}
            
            <Button
              onClick={processFile}
              disabled={isProcessing}
              className="w-full hover-lift"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                'Process File'
              )}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default FileUpload;
