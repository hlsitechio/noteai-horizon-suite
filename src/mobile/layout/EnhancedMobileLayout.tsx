
import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import EnhancedMobileBottomNav from '../components/EnhancedMobileBottomNav';
import MobileDesktopViewButton from '../components/MobileDesktopViewButton';

const EnhancedMobileLayout: React.FC = () => {
  const location = useLocation();
  const isEditor = location.pathname === '/mobile/editor';

  return (
    <div className="h-full w-full flex flex-col bg-background overflow-hidden relative">
      {/* Main Content */}
      <main className={`flex-1 min-h-0 w-full overflow-hidden ${isEditor ? 'h-full' : ''}`}>
        <Outlet />
      </main>
      
      {/* Enhanced Bottom Navigation - hidden in editor */}
      {!isEditor && <EnhancedMobileBottomNav />}
      
      {/* Desktop View Button - always visible */}
      <MobileDesktopViewButton />
    </div>
  );
};

export default EnhancedMobileLayout;
