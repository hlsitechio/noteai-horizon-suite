import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';

interface AIModelSelectorProps {
  currentModel: string;
  onModelChange: (modelId: string) => void;
}

const availableModels = [
  {
    id: 'gpt-4o-mini',
    name: 'GPT-4o Mini',
    provider: 'OpenAI',
    description: 'Fast and cost-effective',
    badge: 'Recommended'
  },
  {
    id: 'gpt-4o',
    name: 'GPT-4o',
    provider: 'OpenAI',
    description: 'Most capable model',
    badge: 'Premium'
  },
  {
    id: 'claude-3-haiku',
    name: 'Claude 3 Haiku',
    provider: 'Anthropic',
    description: 'Fast and efficient',
    badge: 'Fast'
  }
];

const AIModelSelector: React.FC<AIModelSelectorProps> = ({
  currentModel,
  onModelChange
}) => {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">AI Model</label>
      <Select value={currentModel} onValueChange={onModelChange}>
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {availableModels.map((model) => (
            <SelectItem key={model.id} value={model.id}>
              <div className="flex items-center justify-between w-full">
                <div>
                  <div className="font-medium">{model.name}</div>
                  <div className="text-xs text-muted-foreground">{model.description}</div>
                </div>
                <Badge variant="secondary" className="ml-2 text-xs">
                  {model.badge}
                </Badge>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default AIModelSelector;