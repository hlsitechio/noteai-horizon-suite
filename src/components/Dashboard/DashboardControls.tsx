import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Edit3, Settings, Save, CheckCircle, Lock } from 'lucide-react';
import DashboardSettings from './DashboardSettings';
import { useEditMode } from '@/contexts/EditModeContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

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
  const [isLocking, setIsLocking] = useState(false);

  const hasActiveEditMode = isDashboardEditMode || isSidebarEditMode;

  const handleSaveLayout = () => {
    setIsDashboardEditMode(false);
    setIsSidebarEditMode(false);
    
    toast({
      title: "Layout Saved",
      description: "Your layout changes have been saved successfully.",
    });
  };

  const handleLockDashboard = async () => {
    console.log('Starting dashboard lock process...');
    setIsLocking(true);
    
    try {
      console.log('Calling dashboard-lock function...');
      const { data, error } = await supabase.functions.invoke('dashboard-lock', {
        body: {
          lockDashboard: true,
          lockSidebar: true
        }
      });

      console.log('Function response:', { data, error });

      if (error) {
        console.error('Dashboard lock error:', error);
        toast({
          title: "Lock Failed",
          description: `Failed to lock dashboard layout: ${error.message}`,
          variant: "destructive",
        });
        return;
      }

      console.log('Function call successful, updating local state...');
      // Update local state immediately
      setIsDashboardEditMode(false);
      setIsSidebarEditMode(false);

      toast({
        title: "Dashboard Locked",
        description: "Dashboard and sidebar are now permanently locked and cannot be resized.",
        variant: "default",
      });

    } catch (err) {
      console.error('Dashboard lock error:', err);
      toast({
        title: "Lock Failed",
        description: `An unexpected error occurred: ${err.message}`,
        variant: "destructive",
      });
    } finally {
      setIsLocking(false);
    }
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
            <div className="flex gap-2">
              <Button 
                onClick={handleSaveLayout}
                className="flex-1 gap-2"
                size="sm"
                variant="outline"
              >
                <Save className="h-4 w-4" />
                Save Layout
              </Button>
              <Button 
                onClick={handleLockDashboard}
                disabled={isLocking}
                className="flex-1 gap-2 bg-destructive hover:bg-destructive/90"
                size="sm"
              >
                <Lock className="h-4 w-4" />
                {isLocking ? 'Locking...' : 'Lock Dashboard'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};