
import React from 'react';
import { Outlet } from 'react-router-dom';
import { ResizableSidebarContainer } from './ResizableSidebar';
import { Toaster } from '@/components/ui/sonner';
import { useEditMode } from '@/contexts/EditModeContext';

const Layout: React.FC = () => {
  const { isSidebarEditMode } = useEditMode();
  
  return (
    <div className="min-h-screen w-full bg-background">
      <ResizableSidebarContainer
        sidebarDefaultSize={25}
        sidebarMinSize={15}
        sidebarMaxSize={50}
        isEditMode={isSidebarEditMode}
        enableVerticalResize={true}
        sidebarTopContent={
          <div className="h-full w-full bg-muted/5 p-4">
            <div className="text-center">
              <h3 className="font-semibold text-lg mb-2">Navigation</h3>
              <p className="text-muted-foreground text-sm">Main navigation & controls</p>
            </div>
          </div>
        }
        sidebarMiddleContent={
          <div className="h-full w-full bg-primary/5 p-4">
            <div className="text-center">
              <h3 className="font-semibold text-lg mb-2">Content</h3>
              <p className="text-muted-foreground text-sm">Notes & folders</p>
            </div>
          </div>
        }
        sidebarBottomContent={
          <div className="h-full w-full bg-accent/5 p-4">
            <div className="text-center">
              <h3 className="font-semibold text-lg mb-2">Settings & Profile</h3>
              <p className="text-muted-foreground text-sm">User settings & account</p>
            </div>
          </div>
        }
        mainContent={
          <div className="h-full w-full">
            <Outlet />
          </div>
        }
      />
      <Toaster />
    </div>
  );
};

export default Layout;
