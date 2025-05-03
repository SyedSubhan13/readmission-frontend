import React, { useState } from 'react';
import { Button } from './ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from './ui/dialog';
import { Switch } from './ui/switch';
import { Label } from './ui/label';
import { Slider } from './ui/slider';
import { Database, Settings } from 'lucide-react';
import { toast } from 'sonner';
import { getSettings, saveSettings, LocalModelSettings } from '@/services/modelService';

export function DataSettingsButton() {
  const [open, setOpen] = useState(false);
  const [settings, setSettings] = useState<LocalModelSettings>(getSettings());

  const handleSave = () => {
    saveSettings(settings);
    setOpen(false);
    toast.success('Data settings saved');
  };

  const handleSampleSizeChange = (value: number[]) => {
    setSettings(prev => ({
      ...prev,
      sampleSize: value[0]
    }));
  };

  const toggleUseSampleData = (checked: boolean) => {
    setSettings(prev => ({
      ...prev,
      useSampleData: checked
    }));
  };

  return (
    <>
      <Button 
        variant="outline" 
        size="sm" 
        onClick={() => setOpen(true)}
        className="gap-2"
      >
        <Database className="h-4 w-4" />
        <span>Data Settings</span>
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Data Loading Settings
            </DialogTitle>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="use-sample-data">Use Sample Data</Label>
                <p className="text-sm text-muted-foreground">
                  Load a small subset of data for faster performance
                </p>
              </div>
              <Switch
                id="use-sample-data"
                checked={settings.useSampleData}
                onCheckedChange={toggleUseSampleData}
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="sample-size">Sample Size: {settings.sampleSize} records</Label>
              </div>
              <Slider
                id="sample-size"
                defaultValue={[settings.sampleSize]}
                min={10}
                max={1000}
                step={10}
                onValueChange={handleSampleSizeChange}
                disabled={!settings.useSampleData}
              />
              <p className="text-xs text-muted-foreground mt-1">
                Smaller samples load faster but may be less representative
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
} 