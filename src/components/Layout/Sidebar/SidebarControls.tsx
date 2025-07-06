import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Save, CheckCircle, Lock } from 'lucide-react';
import { useEditMode } from '@/contexts/EditModeContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

export const SidebarControls: React.FC = () => {
  const { 
    isSidebarEditMode, 
    setIsSidebarEditMode 
  } = useEditMode();
  const { toast } = useToast();
  const [isLocking, setIsLocking] = useState(false);

  const handleSaveLayout = () => {
    setIsSidebarEditMode(false);
    
    toast({
      title: "Sidebar Layout Saved",
      description: "Your sidebar layout changes have been saved successfully.",
    });
  };

  const handleLockSidebar = async () => {
    console.log('Starting sidebar lock process...');
    setIsLocking(true);
    
    try {
      console.log('Calling dashboard-lock function for sidebar...');
      const { data, error } = await supabase.functions.invoke('dashboard-lock', {
        body: {
          lockDashboard: false,
          lockSidebar: true
        }
      });

      console.log('Function response:', { data, error });

      if (error) {
        console.error('Sidebar lock error:', error);
        toast({
          title: "Lock Failed",
          description: `Failed to lock sidebar layout: ${error.message}`,
          variant: "destructive",
        });
        return;
      }

      console.log('Function call successful, updating local state...');
      setIsSidebarEditMode(false);

      toast({
        title: "Sidebar Locked",
        description: "Sidebar is now permanently locked and cannot be resized.",
        variant: "default",
      });

    } catch (err) {
      console.error('Sidebar lock error:', err);
      toast({
        title: "Lock Failed",
        description: `An unexpected error occurred: ${err.message}`,
        variant: "destructive",
      });
    } finally {
      setIsLocking(false);
    }
  };

  if (!isSidebarEditMode) {
    return null;
  }

  return (
    <div className="p-3 border-t border-sidebar-border bg-sidebar-accent/10">
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-xs text-sidebar-primary">
          <CheckCircle className="h-3 w-3" />
          <span className="font-medium">Sidebar editing active</span>
        </div>
        <p className="text-xs text-sidebar-muted-foreground">
          Resize your sidebar panels as needed, then save your layout
        </p>
        <div className="flex gap-2">
          <Button 
            onClick={handleSaveLayout}
            className="flex-1 gap-2 h-8 text-xs"
            size="sm"
            variant="outline"
          >
            <Save className="h-3 w-3" />
            Save Layout
          </Button>
          <Button 
            onClick={handleLockSidebar}
            disabled={isLocking}
            className="flex-1 gap-2 h-8 text-xs bg-destructive hover:bg-destructive/90"
            size="sm"
          >
            <Lock className="h-3 w-3" />
            {isLocking ? 'Locking...' : 'Lock Sidebar'}
          </Button>
        </div>
      </div>
    </div>
  );
};