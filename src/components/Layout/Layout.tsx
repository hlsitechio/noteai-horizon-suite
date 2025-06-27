
import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
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

  if (isMobile) {
    return (
      <div className="flex flex-col h-screen bg-background">
        <Header />
        <main className="flex-1 overflow-hidden">
          {children || <Outlet />}
        </main>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-hidden">
          {children || <Outlet />}
        </main>
      </div>
    </div>
  );
};

export default Layout;
