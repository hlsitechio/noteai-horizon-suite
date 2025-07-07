
import React from 'react';
import { Outlet } from 'react-router-dom';
import { ResizableSidebarContainer } from './ResizableSidebar';
import { Toaster } from '@/components/ui/sonner';
import { useEditMode } from '@/contexts/EditModeContext';
import { SidebarMain } from './Sidebar/SidebarMain';
import { SidebarCollapseProvider } from '@/contexts/SidebarContext';

const Layout: React.FC = () => {
  const { isSidebarEditMode } = useEditMode();
  
  return (
    <SidebarCollapseProvider>
      <div className="h-screen w-full bg-background overflow-hidden">
        <ResizableSidebarContainer
          sidebarDefaultSize={18}
          sidebarMinSize={15}
          sidebarMaxSize={50}
          isEditMode={isSidebarEditMode}
          sidebarContent={<SidebarMain />}
          mainContent={
            <div className="h-full w-full overflow-auto">
              <Outlet />
            </div>
          }
        />
        <Toaster />
      </div>
    </SidebarCollapseProvider>
  );
};

export default Layout;
