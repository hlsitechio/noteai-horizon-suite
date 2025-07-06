import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Settings, Layout, Component, Info } from 'lucide-react';
import { useDashboardLayout } from '@/hooks/useDashboardLayout';
import { DashboardComponent } from '@/services/dashboardLayoutService';

interface DashboardSettingsProps {
  children?: React.ReactNode;
}

const DashboardSettings: React.FC<DashboardSettingsProps> = ({ children }) => {
  const { 
    layout, 
    availableComponents, 
    updatePanelConfiguration, 
    getPanelConfiguration,
    isLoading 
  } = useDashboardLayout();
  
  const [open, setOpen] = useState(false);

  const panelOptions = [
    { key: 'topLeft', label: 'Top Left Panel', description: 'Upper left dashboard section' },
    { key: 'topRight', label: 'Top Right Panel', description: 'Upper right dashboard section' },
    { key: 'bottomLeft', label: 'Bottom Left Panel', description: 'Lower left dashboard section' },
    { key: 'bottomRight', label: 'Bottom Right Panel', description: 'Lower right dashboard section' },
  ];

  const handleComponentToggle = async (panelKey: string, component: DashboardComponent, enabled: boolean) => {
    if (enabled) {
      await updatePanelConfiguration(panelKey, component.component_key, true);
    } else {
      await updatePanelConfiguration(panelKey, '', false);
    }
  };

  const getSelectedComponent = (panelKey: string): string | null => {
    const config = getPanelConfiguration(panelKey);
    return config?.enabled ? config.component_key : null;
  };

  const isComponentSelected = (panelKey: string, componentKey: string): boolean => {
    const selectedComponent = getSelectedComponent(panelKey);
    return selectedComponent === componentKey;
  };

  const groupedComponents = availableComponents.reduce((groups, component) => {
    if (!groups[component.category]) {
      groups[component.category] = [];
    }
    groups[component.category].push(component);
    return groups;
  }, {} as Record<string, DashboardComponent[]>);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button variant="outline" size="sm" className="gap-2">
            <Settings className="h-4 w-4" />
            Dashboard Settings
          </Button>
        )}
      </DialogTrigger>
      
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Layout className="h-5 w-5" />
            Dashboard Settings
          </DialogTitle>
          <DialogDescription>
            Configure which components appear in each panel of your dashboard.
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="overflow-y-auto max-h-[60vh] pr-2">
            <div className="space-y-6">
              {panelOptions.map((panel) => (
                <Card key={panel.key} className="border-border/50">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Component className="h-4 w-4" />
                      {panel.label}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">{panel.description}</p>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    {Object.entries(groupedComponents).map(([category, components]) => (
                      <div key={category} className="space-y-2">
                        <h4 className="font-medium text-sm flex items-center gap-2">
                          <Badge variant="secondary" className="capitalize">
                            {category}
                          </Badge>
                        </h4>
                        
                        <div className="grid grid-cols-1 gap-2">
                          {components.map((component) => {
                            const isSelected = isComponentSelected(panel.key, component.component_key);
                            const isEnabled = getSelectedComponent(panel.key) !== null;
                            
                            return (
                              <div
                                key={component.id}
                                className={`flex items-start space-x-3 p-3 rounded-lg border transition-all ${
                                  isSelected
                                    ? 'border-primary bg-primary/5'
                                    : 'border-border hover:border-border/80'
                                }`}
                              >
                                <Switch
                                  id={`${panel.key}-${component.component_key}`}
                                  checked={isSelected}
                                  onCheckedChange={(checked) => {
                                    if (checked || isSelected) {
                                      handleComponentToggle(panel.key, component, checked);
                                    }
                                  }}
                                  disabled={!isSelected && isEnabled}
                                />
                                
                                <div className="flex-1 space-y-1">
                                  <Label
                                    htmlFor={`${panel.key}-${component.component_key}`}
                                    className="text-sm font-medium cursor-pointer"
                                  >
                                    {component.component_name}
                                  </Label>
                                  
                                  {component.component_description && (
                                    <p className="text-xs text-muted-foreground flex items-start gap-1">
                                      <Info className="h-3 w-3 mt-0.5 flex-shrink-0" />
                                      {component.component_description}
                                    </p>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
        
        <div className="flex justify-end pt-4 border-t">
          <Button onClick={() => setOpen(false)}>
            Done
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DashboardSettings;