
import React from 'react';
import { Outlet } from 'react-router-dom';
import MobileHeader from './MobileHeader';
import MobileBottomNav from './MobileBottomNav';
import MobileDesktopViewButton from '../components/MobileDesktopViewButton';
import { useLocation } from 'react-router-dom';

const MobileLayout: React.FC = () => {
  const location = useLocation();
  const isEditor = location.pathname === '/mobile/editor';

  return (
    <div className="h-full w-full flex flex-col bg-background overflow-hidden relative">
      {/* Header - hidden in editor for distraction-free experience */}
      {!isEditor && <MobileHeader />}
      
      {/* Main Content */}
      <main className={`flex-1 min-h-0 w-full overflow-hidden ${isEditor ? 'h-full' : ''}`}>
        <Outlet />
      </main>
      
      {/* Bottom Navigation - hidden in editor */}
      {!isEditor && <MobileBottomNav />}
      
      {/* Desktop View Button - always visible */}
      <MobileDesktopViewButton />
    </div>
  );
};

export default MobileLayout;
