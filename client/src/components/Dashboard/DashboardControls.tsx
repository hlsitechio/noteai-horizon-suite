import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
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

  // Only show dashboard controls when dashboard edit mode is active
  // Sidebar has its own controls in SidebarControls component
  const hasActiveEditMode = isDashboardEditMode;

  const handleSaveAndLockDashboard = async () => {
    if (import.meta.env.DEV) {
      console.log('Starting dashboard save and lock process...');
    }
    setIsLocking(true);
    
    try {
      if (import.meta.env.DEV) {
        console.log('Calling dashboard-lock function...');
      }
      const { data, error } = await supabase.functions.invoke('dashboard-lock', {
        body: {
          lockDashboard: true,
          lockSidebar: true
        }
      });

      if (import.meta.env.DEV) {
        console.log('Function response:', { data, error });
      }

      if (error) {
        console.error('Dashboard save and lock error:', error);
        toast({
          title: "Save & Lock Failed",
          description: `Failed to save and lock dashboard layout: ${(error as any)?.message || 'Unknown error'}`,
          variant: "destructive",
        });
        return;
      }

      if (import.meta.env.DEV) {
        console.log('Function call successful, updating local state...');
      }
      // Update local state immediately
      setIsDashboardEditMode(false);
      setIsSidebarEditMode(false);

      toast({
        title: "Dashboard Saved & Locked",
        description: "Dashboard and sidebar layouts have been saved and permanently locked.",
        variant: "default",
      });

    } catch (err: unknown) {
      console.error('Dashboard save and lock error:', err);
      toast({
        title: "Save & Lock Failed",
        description: `An unexpected error occurred: ${(err as Error)?.message || 'Unknown error'}`,
        variant: "destructive",
      });
    } finally {
      setIsLocking(false);
    }
  };

  return (
    <>
      {/* No controls here anymore - moved to banner */}

      {/* Edit Mode Indicator & Save Button */}
      {hasActiveEditMode && (
        <div className="absolute top-14 right-3 z-40 animate-fade-in">
          <div className="bg-primary/10 border border-primary/20 rounded-lg p-3 space-y-2">
            <div className="flex items-center gap-1.5 text-sm text-primary">
              <CheckCircle className="h-3 w-3" />
              <span className="font-medium">
                {isDashboardEditMode && isSidebarEditMode ? 'Dashboard & Sidebar editing active' :
                 isDashboardEditMode ? 'Dashboard editing active' : 'Sidebar editing active'}
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              Resize your panels as needed, then save your layout
            </p>
            <div className="flex gap-1.5">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    onClick={handleSaveAndLockDashboard}
                    disabled={isLocking}
                    className="w-full gap-1.5 bg-primary hover:bg-primary/90 text-xs"
                    size="sm"
                  >
                    <Save className="h-3 w-3" />
                    {isLocking ? 'Saving & Locking...' : 'Save & Lock Layout'}
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="left" className="max-w-xs">
                  <p>Save your current layout and disable further editing</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </div>
        </div>
      )}
    </>
  );
};