import { useState, useEffect } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ModelType } from '@/services/modelService';

interface ModelSelectorProps {
  selectedModel: ModelType | null;
  onModelChange: (model: ModelType) => void;
  availableModels?: string[];
}

export const ModelSelector = ({
  selectedModel,
  onModelChange,
  availableModels,
}: ModelSelectorProps) => {
  const [defaultModels] = useState<Array<{ value: ModelType; label: string }>>([
    { value: 'lightgbm', label: 'LightGBM' },
    { value: 'xgboost', label: 'XGBoost' },
    { value: 'logistic_regression', label: 'Logistic Regression' },
    { value: 'random_forest', label: 'Random Forest' },
  ]);

  // Filter available models to only include those we support
  const filteredAvailableModels = availableModels?.filter(model => 
    model !== 'mlp' && defaultModels.some(m => m.value === model)
  );

  // Choose models to display - either filtered available ones or default ones
  const displayModels = filteredAvailableModels?.length
    ? defaultModels.filter(m => filteredAvailableModels.includes(m.value))
    : defaultModels;

  return (
    <Select
      value={selectedModel || undefined}
      onValueChange={(value) => onModelChange(value as ModelType)}
    >
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Select a model" />
      </SelectTrigger>
      <SelectContent>
        {displayModels.map((model) => (
          <SelectItem key={model.value} value={model.value}>
            {model.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
