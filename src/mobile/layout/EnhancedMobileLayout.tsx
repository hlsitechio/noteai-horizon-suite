
import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import EnhancedMobileBottomNav from '../components/EnhancedMobileBottomNav';
import MobileDesktopViewButton from '../components/MobileDesktopViewButton';

const EnhancedMobileLayout: React.FC = () => {
  const location = useLocation();
  const isEditor = location.pathname === '/mobile/editor';

  return (
    <div className="h-full w-full flex flex-col bg-background overflow-hidden">
      {/* Main Content - Full height within frame */}
      <main className={`flex-1 min-h-0 w-full overflow-hidden relative h-full ${isEditor ? '' : 'pb-16'}`}>
        <div className="h-full w-full overflow-hidden">
          <Outlet />
        </div>
      </main>
      
      {/* Enhanced Bottom Navigation - hidden in editor */}
      {!isEditor && (
        <div className="absolute bottom-0 left-0 right-0">
          <EnhancedMobileBottomNav />
        </div>
      )}
      
      {/* Desktop View Button - positioned for frame */}
      <div className="absolute top-2 right-2 z-10">
        <MobileDesktopViewButton />
      </div>
    </div>
  );
};

export default EnhancedMobileLayout;
