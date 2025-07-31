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

  const handleSaveAndLockLayout = async () => {
    console.log('Starting save and lock process...');
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
        console.error('Save and lock error:', error);
        toast({
          title: "Save & Lock Failed",
          description: `Failed to save and lock sidebar layout: ${(error as any)?.message || 'Unknown error'}`,
          variant: "destructive",
        });
        return;
      }

      console.log('Function call successful, updating local state...');
      setIsSidebarEditMode(false);

      toast({
        title: "Layout Saved & Locked",
        description: "Sidebar layout has been saved and permanently locked.",
        variant: "default",
      });

    } catch (err) {
      console.error('Save and lock error:', err);
      toast({
        title: "Save & Lock Failed", 
        description: `An unexpected error occurred: ${(err as any)?.message || 'Unknown error'}`,
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
            onClick={handleSaveAndLockLayout}
            disabled={isLocking}
            className="w-full gap-2 h-8 text-xs bg-primary hover:bg-primary/90"
            size="sm"
          >
            <Save className="h-3 w-3" />
            {isLocking ? 'Saving & Locking...' : 'Save & Lock Layout'}
          </Button>
        </div>
      </div>
    </div>
  );
};