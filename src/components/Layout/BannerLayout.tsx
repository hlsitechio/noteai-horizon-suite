import React from 'react';
import { Outlet } from 'react-router-dom';
import { TopNavigationBar } from '@/components/Dashboard/TopNavigationBar';
import { useIsMobile } from '@/hooks/use-mobile';

const BannerLayout: React.FC = () => {
  const isMobile = useIsMobile();

  // Mobile and desktop layout - top nav bar + content
  return (
    <div className="h-full w-full bg-background flex flex-col">
      {/* Top Navigation Bar - Always visible */}
      <div className="flex-shrink-0">
        <TopNavigationBar />
      </div>
      
      {/* Main Content */}
      <div className="flex-1 min-h-0 overflow-auto">
        <Outlet />
      </div>
    </div>
  );
};

export default BannerLayout;