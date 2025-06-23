
import React from 'react';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { AppSidebar } from './AppSidebar';
import Header from './Header';
import { useLocation, Outlet } from 'react-router-dom';
import { useIsMobile } from '../../hooks/use-mobile';
import { CursorProvider } from '../../contexts/CursorContext';
import CustomCursor from '../CustomCursor/CustomCursor';
import CursorInteractionHandlers from '../CustomCursor/CursorInteractionHandlers';

const Layout: React.FC = () => {
  const location = useLocation();
  const isMobile = useIsMobile();
  const isEditorPage = location.pathname === '/app/editor';
  const isDashboardPage = location.pathname === '/app/dashboard';

  return (
    <CursorProvider>
      <SidebarProvider>
        <div className="flex min-h-screen w-full bg-background">
          <AppSidebar />
          <SidebarInset className="flex-1 min-w-0 w-full">
            {/* Only show header on non-editor pages */}
            {!isEditorPage && <Header />}
            <div className={`w-full ${
              isEditorPage 
                ? "h-screen" // Full height for editor
                : isDashboardPage
                  ? isMobile
                    ? "pt-16"
                    : "p-6 pt-24"
                  : isMobile 
                    ? "p-4 pt-20" 
                    : "p-6 pt-24"
            }`}>
              <Outlet />
            </div>
          </SidebarInset>
        </div>
        <CustomCursor />
        <CursorInteractionHandlers />
      </SidebarProvider>
    </CursorProvider>
  );
};

export default Layout;
