
import React from 'react';
import { Outlet } from 'react-router-dom';
import { AppSidebar } from './AppSidebar';
import Header from './Header';
import { useIsMobile } from '../../hooks/use-mobile';
import { useReminderManager } from '../../hooks/useReminderManager';

interface LayoutProps {
  children?: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const isMobile = useIsMobile();
  
  // Initialize reminder manager
  useReminderManager();

  return (
    <div className="flex h-screen w-full bg-background">
      {!isMobile && <AppSidebar />}
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-auto p-4">
          {children || <Outlet />}
        </main>
      </div>
    </div>
  );
};

export default Layout;
