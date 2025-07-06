import React from 'react';
import { Settings, Layout, Lock, Unlock } from 'lucide-react';
import { useEditMode } from '@/contexts/EditModeContext';
import { useToast } from '@/hooks/use-toast';

interface LayoutEditToggleProps {
  type: 'dashboard' | 'sidebar';
}

const LayoutEditToggle: React.FC<LayoutEditToggleProps> = ({ type }) => {
  const { 
    isDashboardEditMode, 
    setIsDashboardEditMode, 
    isSidebarEditMode, 
    setIsSidebarEditMode 
  } = useEditMode();
  const { toast } = useToast();

  const isActive = type === 'dashboard' ? isDashboardEditMode : isSidebarEditMode;
  const setActive = type === 'dashboard' ? setIsDashboardEditMode : setIsSidebarEditMode;

  const handleToggle = () => {
    setActive(!isActive);
    toast({
      title: `${type === 'dashboard' ? 'Dashboard' : 'Sidebar'} Edit Mode ${!isActive ? 'Enabled' : 'Disabled'}`,
      description: !isActive 
        ? `You can now resize ${type} panels` 
        : `${type} panels are now locked`,
    });
  };

  return (
    <div onClick={handleToggle} className="cursor-pointer">
      <div className={`p-4 rounded-full w-fit mx-auto mb-4 group-hover:scale-110 transition-transform ${
        isActive 
          ? 'bg-primary/20 text-primary' 
          : type === 'dashboard' 
            ? 'bg-orange-500/10 text-orange-500' 
            : 'bg-blue-500/10 text-blue-500'
      }`}>
        {isActive ? (
          <Unlock className="w-8 h-8" />
        ) : type === 'dashboard' ? (
          <Layout className="w-8 h-8" />
        ) : (
          <Settings className="w-8 h-8" />
        )}
      </div>
      <h4 className="font-semibold mb-2">
        {type === 'dashboard' ? 'Dashboard Layout' : 'Sidebar Layout'}
      </h4>
      <p className="text-sm text-muted-foreground mb-2">
        {isActive 
          ? `${type === 'dashboard' ? 'Dashboard' : 'Sidebar'} editing enabled`
          : `Enable ${type} panel resizing`
        }
      </p>
      <div className="flex items-center justify-center gap-2 text-xs">
        {isActive ? (
          <>
            <Unlock className="w-3 h-3" />
            <span className="text-primary font-medium">Unlocked</span>
          </>
        ) : (
          <>
            <Lock className="w-3 h-3" />
            <span className="text-muted-foreground">Locked</span>
          </>
        )}
      </div>
    </div>
  );
};

export default LayoutEditToggle;