import React from 'react';
import { Button } from '@/components/ui/button';
import { Settings, Unlock } from 'lucide-react';
import { useEditMode } from '@/contexts/EditModeContext';
import { useToast } from '@/hooks/use-toast';

export const SidebarEditButton: React.FC = () => {
  const { 
    isSidebarEditMode, 
    setIsSidebarEditMode 
  } = useEditMode();
  const { toast } = useToast();

  const handleToggle = () => {
    const newActiveState = !isSidebarEditMode;
    setIsSidebarEditMode(newActiveState);
    
    toast({
      title: `Sidebar Edit Mode ${newActiveState ? 'Enabled' : 'Disabled'}`,
      description: newActiveState 
        ? 'You can now resize sidebar panels' 
        : 'Sidebar panels are now locked',
    });
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleToggle}
      className={`gap-2 transition-all duration-200 ${
        isSidebarEditMode 
          ? 'text-primary bg-primary/10 hover:bg-primary/20' 
          : 'text-muted-foreground hover:text-foreground hover:bg-accent'
      }`}
    >
      {isSidebarEditMode ? (
        <Unlock className="h-4 w-4" />
      ) : (
        <Settings className="h-4 w-4" />
      )}
      {isSidebarEditMode ? 'Exit Edit' : 'Edit Layout'}
    </Button>
  );
};