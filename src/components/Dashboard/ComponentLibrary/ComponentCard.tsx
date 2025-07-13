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
  targetPanel?: string;
}

export const ComponentCard: React.FC<ComponentCardProps> = ({
  component,
  availablePanels,
  onAddToPanel,
  targetPanel
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

  const handleAddToSelectedComponents = async () => {
    // Close dialog first
    setIsDialogOpen(false);
    
    // Small delay to allow dialog close animation
    await new Promise(resolve => setTimeout(resolve, 150));
    
    // Add to selected components area
    await onAddToPanel(component.componentKey, 'selectedComponents');
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
        {targetPanel ? (
          <Button 
            size="sm" 
            className="w-full flex items-center space-x-1"
            onClick={() => handleAddToPanel(component.componentKey, targetPanel)}
          >
            <Plus className="h-3 w-3" />
            <span>Add to {formatPanelName(targetPanel)}</span>
          </Button>
        ) : (
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
              {/* Add to Selected Components Area - Primary Option */}
              <div className="p-3 border-2 border-primary/20 rounded-lg bg-primary/5">
                <div className="text-sm font-medium mb-2">Recommended</div>
                <Button
                  onClick={handleAddToSelectedComponents}
                  className="w-full justify-start"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add to Selected Components
                </Button>
                <p className="text-xs text-muted-foreground mt-1">
                  Add to the dedicated components area in your dashboard
                </p>
              </div>

              {/* Add to Dashboard Panels - Secondary Option */}
              <div>
                <div className="text-sm font-medium mb-2">Or add to dashboard panel</div>
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
            </div>
          </DialogContent>
        </Dialog>
        )}
      </CardContent>
    </Card>
  );
};