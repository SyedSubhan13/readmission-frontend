import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import LocalModelSettings from '@/components/LocalModelSettings';

const Settings = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Settings</h1>
      
      <Tabs defaultValue="models" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="models">Model Settings</TabsTrigger>
          <TabsTrigger value="api">API Settings</TabsTrigger>
        </TabsList>
        
        <TabsContent value="models" className="space-y-4">
          <LocalModelSettings />
        </TabsContent>
        
        <TabsContent value="api" className="space-y-4">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-medium mb-4">API Documentation</h3>
            <p className="mb-4">
              To use your local models and data, you need to set up a local API server
              that exposes the following endpoints:
            </p>
            
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-md">
                <h4 className="font-medium">GET /health</h4>
                <p className="text-sm text-gray-600">Health check endpoint</p>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-md">
                <h4 className="font-medium">POST /predict/:modelType</h4>
                <p className="text-sm text-gray-600">Make predictions using a model</p>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-md">
                <h4 className="font-medium">GET /models/:modelType/performance</h4>
                <p className="text-sm text-gray-600">Get model performance metrics</p>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-md">
                <h4 className="font-medium">POST /test-model/:modelType</h4>
                <p className="text-sm text-gray-600">Test a model with your data</p>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
