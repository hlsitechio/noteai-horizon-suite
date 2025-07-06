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
import { Settings, Layout, Component, Info, Save, CheckCircle, Unlock } from 'lucide-react';
import { useDashboardLayout } from '@/hooks/useDashboardLayout';
import { DashboardComponent } from '@/services/dashboardLayoutService';
import { useEditMode } from '@/contexts/EditModeContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

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
  const { isSidebarEditMode, setIsSidebarEditMode } = useEditMode();
  const { toast } = useToast();
  
  const [open, setOpen] = useState(false);
  const [isLocking, setIsLocking] = useState(false);

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

  const handleSidebarEditToggle = () => {
    const newActiveState = !isSidebarEditMode;
    setIsSidebarEditMode(newActiveState);
    
    toast({
      title: `Sidebar Edit Mode ${newActiveState ? 'Enabled' : 'Disabled'}`,
      description: newActiveState 
        ? 'You can now resize sidebar panels' 
        : 'Sidebar panels are now locked',
    });
  };

  const handleSaveAndLockSidebar = async () => {
    setIsLocking(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('dashboard-lock', {
        body: {
          lockDashboard: false,
          lockSidebar: true
        }
      });

      if (error) {
        toast({
          title: "Save & Lock Failed",
          description: `Failed to save and lock sidebar layout: ${error.message}`,
          variant: "destructive",
        });
        return;
      }

      setIsSidebarEditMode(false);
      toast({
        title: "Sidebar Layout Saved & Locked",
        description: "Sidebar layout has been saved and permanently locked.",
        variant: "default",
      });

    } catch (err) {
      toast({
        title: "Save & Lock Failed", 
        description: `An unexpected error occurred: ${err.message}`,
        variant: "destructive",
      });
    } finally {
      setIsLocking(false);
    }
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
              {/* Sidebar Layout Controls */}
              <Card className="border-border/50">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Settings className="h-4 w-4" />
                    Sidebar Layout Controls
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">Manage your sidebar panel layout and sizing</p>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-3 rounded-lg border border-border">
                    <div className="flex items-center gap-3">
                      {isSidebarEditMode ? (
                        <Unlock className="h-4 w-4 text-primary" />
                      ) : (
                        <Settings className="h-4 w-4" />
                      )}
                      <div>
                        <Label className="text-sm font-medium">
                          {isSidebarEditMode ? 'Sidebar Edit Mode Active' : 'Enable Sidebar Editing'}
                        </Label>
                        <p className="text-xs text-muted-foreground">
                          {isSidebarEditMode 
                            ? 'You can now resize sidebar panels by dragging the handles' 
                            : 'Click to enable sidebar panel resizing'}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant={isSidebarEditMode ? "secondary" : "outline"}
                        size="sm"
                        onClick={handleSidebarEditToggle}
                        className="gap-2"
                      >
                        {isSidebarEditMode ? (
                          <>
                            <CheckCircle className="h-4 w-4" />
                            Exit Edit
                          </>
                        ) : (
                          <>
                            <Unlock className="h-4 w-4" />
                            Enable Edit
                          </>
                        )}
                      </Button>
                      
                      {isSidebarEditMode && (
                        <Button
                          onClick={handleSaveAndLockSidebar}
                          disabled={isLocking}
                          className="gap-2 bg-primary hover:bg-primary/90"
                          size="sm"
                        >
                          <Save className="h-4 w-4" />
                          {isLocking ? 'Saving...' : 'Save & Lock'}
                        </Button>
                      )}
                    </div>
                  </div>
                  
                  {isSidebarEditMode && (
                    <div className="bg-primary/10 border border-primary/20 rounded-lg p-3">
                      <div className="flex items-center gap-2 text-sm text-primary mb-1">
                        <Info className="h-4 w-4" />
                        <span className="font-medium">Sidebar editing is now active</span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Go to the sidebar and drag the resize handles to adjust panel sizes, then come back here to save your changes.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
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