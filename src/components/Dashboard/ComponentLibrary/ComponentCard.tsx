import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import { Plus } from 'lucide-react';
import { DashboardComponentRenderer } from '../ComponentRegistry';
import type { ComponentLibraryItem } from './ComponentLibraryData';

interface ComponentCardProps {
  component: ComponentLibraryItem;
  availablePanels: string[];
  onAddToPanel: (componentKey: string, panelKey: string) => void;
}

export const ComponentCard: React.FC<ComponentCardProps> = ({
  component,
  availablePanels,
  onAddToPanel
}) => {
  const Icon = component.icon;

  const formatPanelName = (panelKey: string) => {
    return panelKey.replace(/([A-Z])/g, ' $1').trim();
  };

  return (
    <Card className="group hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Icon className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-base">{component.name}</CardTitle>
              <Badge variant="secondary" className="text-xs">
                {component.category}
              </Badge>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">
          {component.description}
        </p>
        
        <div className="flex flex-wrap gap-1">
          {component.tags.map((tag) => (
            <Badge key={tag} variant="outline" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>

        {/* Inline Component Preview */}
        <div className="border-2 border-dashed border-muted rounded-lg p-4 bg-muted/10">
          <div className="max-w-full mx-auto">
            <DashboardComponentRenderer componentKey={component.componentKey} />
          </div>
        </div>

        {/* Add to Panel Button */}
        <Dialog>
          <DialogTrigger asChild>
            <Button size="sm" className="w-full flex items-center space-x-1">
              <Plus className="h-3 w-3" />
              <span>Add to Panel</span>
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Component to Panel</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Select a panel to add the "{component.name}" component:
              </p>
              <div className="grid grid-cols-2 gap-2">
                {availablePanels.map((panelKey) => (
                  <Button
                    key={panelKey}
                    variant="outline"
                    onClick={() => onAddToPanel(component.componentKey, panelKey)}
                    className="justify-start"
                  >
                    {formatPanelName(panelKey)}
                  </Button>
                ))}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};