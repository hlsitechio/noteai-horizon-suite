import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Eye } from 'lucide-react';
import { DashboardComponentRenderer } from '../ComponentRegistry';

interface ComponentPreviewProps {
  componentKey: string;
  description: string;
  onAddToPanel?: (panelKey: string) => void;
  availablePanels?: string[];
}

export const ComponentPreview: React.FC<ComponentPreviewProps> = ({
  componentKey,
  description,
  onAddToPanel,
  availablePanels = ['topLeft', 'topRight', 'bottomLeft', 'bottomRight']
}) => {
  const formatPanelName = (panelKey: string) => {
    return panelKey.replace(/([A-Z])/g, ' $1').trim();
  };

  return (
    <div className="space-y-6">
      {/* Preview Header */}
      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <Eye className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">Component Preview</span>
        </div>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>

      {/* Component Preview */}
      <div className="border-2 border-dashed border-muted rounded-lg p-6 bg-muted/10">
        <div className="max-w-md mx-auto">
          <DashboardComponentRenderer componentKey={componentKey} />
        </div>
      </div>

      {/* Add to Panel Options */}
      {onAddToPanel && (
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Plus className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Add to Panel</span>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            {availablePanels.map((panelKey) => (
              <Button
                key={panelKey}
                variant="outline"
                onClick={() => onAddToPanel(panelKey)}
                className="justify-start h-auto p-4"
              >
                <div className="text-left">
                  <div className="font-medium text-sm">
                    {formatPanelName(panelKey)}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Dashboard panel
                  </div>
                </div>
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Usage Tips */}
      <div className="rounded-lg bg-muted/30 p-4 space-y-2">
        <h4 className="text-sm font-medium">Usage Tips</h4>
        <ul className="text-xs text-muted-foreground space-y-1">
          <li>• Components automatically adapt to their panel size</li>
          <li>• Most components support customizable properties</li>
          <li>• You can rearrange components by dragging panels</li>
          <li>• Some components may require specific data connections</li>
        </ul>
      </div>
    </div>
  );
};