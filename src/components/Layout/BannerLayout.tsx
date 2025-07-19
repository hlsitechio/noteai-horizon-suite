import React from 'react';
import { Outlet } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';

const BannerLayout: React.FC = () => {
  const isMobile = useIsMobile();

  // Mobile and desktop layout - simple full-height content
  return (
    <div className="h-full w-full bg-background">
      <div className="flex-1 min-h-0 overflow-auto h-full">
        <Outlet />
      </div>
    </div>
  );
};

export default BannerLayout;