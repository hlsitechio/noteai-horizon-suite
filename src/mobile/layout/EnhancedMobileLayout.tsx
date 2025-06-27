
import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import EnhancedMobileBottomNav from '../components/EnhancedMobileBottomNav';
import MobileDesktopViewButton from '../components/MobileDesktopViewButton';

const EnhancedMobileLayout: React.FC = () => {
  const location = useLocation();
  const isEditor = location.pathname === '/mobile/editor';

  return (
    <div className="h-full w-full flex flex-col bg-background overflow-hidden relative z-[10002]" style={{ isolation: 'isolate' }}>
      {/* Ensure no desktop interference */}
      <div className="absolute inset-0 bg-background z-[10003]">
        {/* Main Content - Full height within frame */}
        <main className={`flex-1 min-h-0 w-full overflow-hidden relative h-full ${isEditor ? '' : 'pb-16'}`}>
          <div className="h-full w-full overflow-hidden">
            <Outlet />
          </div>
        </main>
        
        {/* Enhanced Bottom Navigation - hidden in editor */}
        {!isEditor && (
          <div className="absolute bottom-0 left-0 right-0 z-[10004]">
            <EnhancedMobileBottomNav />
          </div>
        )}
        
        {/* Desktop View Button - positioned for frame */}
        <div className="absolute top-2 right-2 z-[10005]">
          <MobileDesktopViewButton />
        </div>
      </div>
    </div>
  );
};

export default EnhancedMobileLayout;
