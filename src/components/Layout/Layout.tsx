
import React from 'react';
import { ResizableSidebarContainer } from './ResizableSidebar';
import { Toaster } from '@/components/ui/sonner';
import { useEditMode } from '@/contexts/EditModeContext';
import { LocationAwareSidebar } from './Sidebar/LocationAwareSidebar';
import { SidebarCollapseProvider } from '@/contexts/SidebarContext';
import { PWAWrapper } from '../PWA/PWAWrapper';
import BannerLayout from './BannerLayout';
import FloatingNotesContainer from '../FloatingNotes/FloatingNotesContainer';
import { useThemeManager } from '@/hooks/useThemeManager';
import { ReminderManager } from '../ReminderManager';

const Layout: React.FC = () => {
  const { isSidebarEditMode } = useEditMode();
  
  // Apply user themes only in the authenticated dashboard area
  useThemeManager();
  
  return (
    <PWAWrapper>
      <SidebarCollapseProvider>
        <div className="h-full w-full bg-background overflow-hidden">
          <ResizableSidebarContainer
            sidebarDefaultSize={16}
            sidebarMinSize={12}
            sidebarMaxSize={25}
            isEditMode={isSidebarEditMode}
            sidebarContent={<LocationAwareSidebar />}
            mainContent={
              <div className="h-full w-full overflow-hidden">
                <BannerLayout />
              </div>
            }
          />
          <Toaster />
          <FloatingNotesContainer />
          <ReminderManager />
        </div>
      </SidebarCollapseProvider>
    </PWAWrapper>
  );
};

export default Layout;
