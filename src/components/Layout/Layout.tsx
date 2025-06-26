
import React from 'react';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { AppSidebar } from './AppSidebar';
import Header from './Header';
import { useLocation, Outlet } from 'react-router-dom';
import { useIsMobile } from '../../hooks/use-mobile';
import { UnifiedDragDropProvider } from './UnifiedDragDropProvider';
import { FloatingNotesProvider } from '../../contexts/FloatingNotesContext';
import SecureGlobalAICopilot from '../Global/SecureGlobalAICopilot';
import FloatingNotesContainer from '../FloatingNotes/FloatingNotesContainer';
import MobileViewButton from './MobileViewButton';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const isMobile = useIsMobile();
  const isEditorPage = location.pathname === '/app/editor';
  const isDashboardPage = location.pathname === '/app/dashboard';

  return (
    <FloatingNotesProvider>
      <UnifiedDragDropProvider>
        <SidebarProvider>
          <div className="flex min-h-screen w-full bg-background overflow-hidden">
            <AppSidebar />
            <SidebarInset className="flex-1 min-w-0 w-full flex flex-col">
              {/* Only show header on non-editor and non-dashboard pages */}
              {!isEditorPage && !isDashboardPage && <Header />}
              <div className={`w-full h-full flex-1 min-h-0 ${
                isEditorPage 
                  ? "h-screen" // Full height for editor
                  : isDashboardPage
                    ? "h-screen overflow-hidden" // Full height for dashboard with no overflow
                    : isMobile 
                      ? "p-4 pt-20" 
                      : "p-6 pt-24"
              }`}>
                {children || <Outlet />}
              </div>
            </SidebarInset>
            
            {/* Secure Global AI Copilot - Available on all app pages */}
            <SecureGlobalAICopilot />
            
            {/* Floating Notes Container - Available on all app pages */}
            <FloatingNotesContainer />
            
            {/* Mobile View Button */}
            <MobileViewButton />
          </div>
        </SidebarProvider>
      </UnifiedDragDropProvider>
    </FloatingNotesProvider>
  );
};

export default Layout;
