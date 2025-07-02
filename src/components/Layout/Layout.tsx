
import React from 'react';
import { Outlet } from 'react-router-dom';
import { SidebarProvider } from '@/components/ui/sidebar';
import { SidebarMain } from './Sidebar/SidebarMain';
import { Toaster } from '@/components/ui/sonner';

const Layout: React.FC = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <SidebarMain />
        <main className="flex-1 overflow-hidden">
          <Outlet />
        </main>
        <Toaster />
      </div>
    </SidebarProvider>
  );
};

export default Layout;
