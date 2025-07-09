import React, { useState } from 'react';
import { Settings, Layout, Lock, Unlock, Save, Check } from 'lucide-react';
import { useEditMode } from '@/contexts/EditModeContext';
import { useToast } from '@/hooks/use-toast';
import { useDashboardPanelSizes } from '@/hooks/useDashboardPanelSizes';
import { useDashboardSettings } from '@/hooks/useDashboardSettings';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface LayoutEditToggleProps {
  type: 'dashboard' | 'sidebar';
  onEditModeEnabled?: () => void;
}

const LayoutEditToggle: React.FC<LayoutEditToggleProps> = ({ type, onEditModeEnabled }) => {
  const { 
    isDashboardEditMode, 
    setIsDashboardEditMode, 
    isSidebarEditMode, 
    setIsSidebarEditMode 
  } = useEditMode();
  const { toast } = useToast();
  const { panelSizes } = useDashboardPanelSizes();
  const { updateSidebarPanelSizes } = useDashboardSettings();
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [saving, setSaving] = useState(false);

  const isActive = type === 'dashboard' ? isDashboardEditMode : isSidebarEditMode;

  const handleClick = () => {
    // Show immediate save confirmation dialog
    setShowSaveDialog(true);
  };

  const handleSaveLayout = async () => {
    setSaving(true);
    
    try {
      // Save current panel sizes
      await updateSidebarPanelSizes(panelSizes);
      
      // Close modal
      if (onEditModeEnabled) {
        onEditModeEnabled();
      }
      
      toast({
        title: `${type === 'dashboard' ? 'Dashboard' : 'Sidebar'} Layout Saved`,
        description: `Your ${type} layout has been saved and will persist on page reload.`,
        duration: 3000,
      });
      
      setShowSaveDialog(false);
    } catch (error) {
      toast({
        title: "Save Failed",
        description: `Failed to save ${type} layout. Please try again.`,
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <div onClick={handleClick} className="cursor-pointer">
        <div className={`p-4 rounded-full w-fit mx-auto mb-4 group-hover:scale-110 transition-transform ${
          isActive 
            ? 'bg-primary/20 text-primary' 
            : type === 'dashboard' 
              ? 'bg-orange-500/10 text-orange-500' 
              : 'bg-blue-500/10 text-blue-500'
        }`}>
          <Save className="w-8 h-8" />
        </div>
        <h4 className="font-semibold mb-2">
          Save {type === 'dashboard' ? 'Dashboard' : 'Sidebar'} Layout
        </h4>
        <p className="text-sm text-muted-foreground mb-2">
          Save current {type} layout configuration
        </p>
        <div className="flex items-center justify-center gap-2 text-xs">
          <Save className="w-3 h-3" />
          <span className="text-muted-foreground">Click to Save</span>
        </div>
      </div>

      {/* Save Confirmation Dialog */}
      <AlertDialog open={showSaveDialog} onOpenChange={setShowSaveDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <Save className="h-5 w-5" />
              Save {type === 'dashboard' ? 'Dashboard' : 'Sidebar'} Layout
            </AlertDialogTitle>
            <AlertDialogDescription>
              This will save your current {type} layout configuration and it will persist after page reloads. 
              Your layout will be automatically applied when you return to the dashboard.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={saving}>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleSaveLayout}
              disabled={saving}
              className="gap-2"
            >
              {saving ? (
                <>
                  <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  Save Layout
                </>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default LayoutEditToggle;