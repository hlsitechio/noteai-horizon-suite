
import React from 'react';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { AppSidebar } from './AppSidebar';
import Header from './Header';
import { useLocation } from 'react-router-dom';
import { useIsMobile } from '../../hooks/use-mobile';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const isMobile = useIsMobile();
  const isEditorPage = location.pathname === '/editor';

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background">
        <AppSidebar />
        <SidebarInset className="flex-1 min-w-0">
          <Header />
          <div className={`${
            isEditorPage 
              ? isMobile 
                ? "pt-16" 
                : "pt-24" 
              : isMobile 
                ? "p-4 pt-20" 
                : "p-6 pt-24"
          }`}>
            {children}
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default Layout;
