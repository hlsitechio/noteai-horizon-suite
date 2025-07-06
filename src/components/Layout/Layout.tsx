
import React from 'react';
import { Outlet } from 'react-router-dom';
import { ResizableSidebarContainer } from './ResizableSidebar';
import { Toaster } from '@/components/ui/sonner';

const Layout: React.FC = () => {
  return (
    <div className="min-h-screen w-full bg-background">
      <ResizableSidebarContainer
        sidebarDefaultSize={25}
        sidebarMinSize={15}
        sidebarMaxSize={50}
        isEditMode={true}
        enableVerticalResize={true}
        sidebarTopContent={
          <div className="h-full w-full bg-muted/5 p-4">
            <div className="text-center">
              <h3 className="font-semibold text-lg mb-2">Top Panel</h3>
              <p className="text-muted-foreground text-sm">Navigation & Controls</p>
            </div>
          </div>
        }
        sidebarBottomContent={
          <div className="h-full w-full bg-muted/10 p-4">
            <div className="text-center">
              <h3 className="font-semibold text-lg mb-2">Bottom Panel</h3>
              <p className="text-muted-foreground text-sm">Secondary content</p>
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
