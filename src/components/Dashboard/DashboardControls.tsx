import React from 'react';
import { Button } from '@/components/ui/button';
import { Edit3, Settings, Save, CheckCircle } from 'lucide-react';
import DashboardSettings from './DashboardSettings';
import { useEditMode } from '@/contexts/EditModeContext';
import { useToast } from '@/hooks/use-toast';

interface DashboardControlsProps {
  onEditLayoutClick: () => void;
}

export const DashboardControls: React.FC<DashboardControlsProps> = ({ 
  onEditLayoutClick 
}) => {
  const { 
    isDashboardEditMode, 
    isSidebarEditMode, 
    setIsDashboardEditMode, 
    setIsSidebarEditMode 
  } = useEditMode();
  const { toast } = useToast();

  const hasActiveEditMode = isDashboardEditMode || isSidebarEditMode;

  const handleSaveLayout = () => {
    setIsDashboardEditMode(false);
    setIsSidebarEditMode(false);
    
    toast({
      title: "Layout Saved",
      description: "Your layout changes have been saved successfully.",
    });
  };

  return (
    <>
      {/* Main Controls */}
      <div className="absolute top-4 right-4 z-50 flex items-center gap-2">
        <DashboardSettings>
          <Button variant="ghost" size="sm" className="gap-2">
            <Settings className="h-4 w-4" />
            Components
          </Button>
        </DashboardSettings>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={onEditLayoutClick}
          className="gap-2 transition-all duration-200 hover:bg-accent"
        >
          <Edit3 className="h-4 w-4" />
          Edit Layout
        </Button>
      </div>

      {/* Edit Mode Indicator & Save Button */}
      {hasActiveEditMode && (
        <div className="absolute top-16 right-4 z-40 animate-fade-in">
          <div className="bg-primary/10 border border-primary/20 rounded-lg p-4 space-y-3">
            <div className="flex items-center gap-2 text-sm text-primary">
              <CheckCircle className="h-4 w-4" />
              <span className="font-medium">
                {isDashboardEditMode && isSidebarEditMode ? 'Dashboard & Sidebar editing active' :
                 isDashboardEditMode ? 'Dashboard editing active' : 'Sidebar editing active'}
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              Resize your panels as needed, then save your layout
            </p>
            <Button 
              onClick={handleSaveLayout}
              className="w-full gap-2"
              size="sm"
            >
              <Save className="h-4 w-4" />
              Save Layout
            </Button>
          </div>
        </div>
      )}
    </>
  );
};