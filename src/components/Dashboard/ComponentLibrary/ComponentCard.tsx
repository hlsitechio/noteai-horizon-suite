import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription,
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
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const Icon = component.icon;

  const handleAddToPanel = async (componentKey: string, panelKey: string) => {
    // Close dialog first to prevent layout thrashing
    setIsDialogOpen(false);
    
    // Small delay to allow dialog close animation
    await new Promise(resolve => setTimeout(resolve, 150));
    
    // Then add component
    await onAddToPanel(componentKey, panelKey);
  };

  const formatPanelName = (panelKey: string) => {
    const panelNames: Record<string, string> = {
      'topLeft': 'Top Left',
      'topRight': 'Top Right',
      'middleLeft': 'Middle Left',
      'middleRight': 'Middle Right',
      'bottomLeft': 'Bottom Left',
      'bottomRight': 'Bottom Right'
    };
    return panelNames[panelKey] || panelKey.replace(/([A-Z])/g, ' $1').trim();
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
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="w-full flex items-center space-x-1">
              <Plus className="h-3 w-3" />
              <span>Add to Panel</span>
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Component to Panel</DialogTitle>
              <DialogDescription>
                Select a panel to add the "{component.name}" component to your dashboard.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-2">
                {availablePanels.map((panelKey) => (
                  <Button
                    key={panelKey}
                    variant="outline"
                    onClick={() => handleAddToPanel(component.componentKey, panelKey)}
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