
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { saveSettings, getSettings, LocalModelSettings as ModelSettingsType } from '@/services/modelService';

const LocalModelSettings = () => {
  const [apiEndpoint, setApiEndpoint] = useState('');
  const [modelPaths, setModelPaths] = useState<{[key: string]: string}>({});
  const [defaultModel, setDefaultModel] = useState('random_forest');
  
  useEffect(() => {
    // Load saved settings
    const settings = getSettings();
    setApiEndpoint(settings.apiEndpoint || '');
    setModelPaths(settings.modelPaths || {});
    setDefaultModel(settings.defaultModel || 'random_forest');
  }, []);
  
  const handleSave = () => {
    const updatedSettings: ModelSettingsType = {
      apiEndpoint,
      modelPaths,
      defaultModel: defaultModel as any
    };
    
    saveSettings(updatedSettings);
    toast.success('Settings saved successfully');
  };
  
  const handleTestConnection = () => {
    // Test the connection to the API endpoint
    fetch(`${apiEndpoint}/health`)
      .then(response => {
        if (response.ok) {
          toast.success('API connection successful');
        } else {
          toast.error('API connection failed');
        }
      })
      .catch(error => {
        console.error('Connection test failed:', error);
        toast.error(`Connection failed: ${error.message}`);
      });
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Local Model Settings</CardTitle>
        <CardDescription>
          Configure connection to your local models and data
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="apiEndpoint">API Endpoint</Label>
          <Input
            id="apiEndpoint"
            placeholder="http://localhost:8000/api"
            value={apiEndpoint}
            onChange={e => setApiEndpoint(e.target.value)}
          />
          <p className="text-sm text-muted-foreground">
            The base URL for your local API server
          </p>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="modelPaths">Model Paths</Label>
          <div className="space-y-2">
            {Object.entries(modelPaths).map(([key, path]) => (
              <div key={key} className="flex gap-2">
                <Input
                  value={key}
                  disabled
                  className="w-1/3"
                />
                <Input
                  value={path}
                  onChange={e => setModelPaths({...modelPaths, [key]: e.target.value})}
                  placeholder="Path to model file"
                  className="w-2/3"
                />
              </div>
            ))}
          </div>
          <p className="text-sm text-muted-foreground">
            Paths to your local model files
          </p>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="defaultModel">Default Model</Label>
          <Input
            id="defaultModel"
            value={defaultModel}
            onChange={e => setDefaultModel(e.target.value)}
          />
          <p className="text-sm text-muted-foreground">
            Default model to use for predictions
          </p>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={handleTestConnection}>
          Test Connection
        </Button>
        <Button onClick={handleSave}>Save Settings</Button>
      </CardFooter>
    </Card>
  );
};

export default LocalModelSettings;
