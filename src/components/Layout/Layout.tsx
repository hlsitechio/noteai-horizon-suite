
import React from 'react';
import { Outlet } from 'react-router-dom';
import { ResizableSidebarContainer } from './ResizableSidebar';
import { Toaster } from '@/components/ui/sonner';
import { useEditMode } from '@/contexts/EditModeContext';
import { SidebarMain } from './Sidebar/SidebarMain';
import { SidebarProvider, Sidebar, SidebarContent } from '@/components/ui/sidebar';

const Layout: React.FC = () => {
  const { isSidebarEditMode } = useEditMode();
  
  return (
    <SidebarProvider>
      <div className="min-h-screen w-full bg-background">
        <ResizableSidebarContainer
          sidebarDefaultSize={25}
          sidebarMinSize={15}
          sidebarMaxSize={50}
          isEditMode={isSidebarEditMode}
          sidebarContent={<SidebarMain />}
          mainContent={
            <div className="h-full w-full">
              <Outlet />
            </div>
          }
        />
        <Toaster />
      </div>
    </SidebarProvider>
  );
};

export default Layout;
