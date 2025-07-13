import React from 'react';
import { Outlet } from 'react-router-dom';
import { Card } from '@/components/ui/card';

const EnhancedMobileLayout: React.FC = () => {
  return (
    <div className="h-full flex flex-col">
      <div className="flex-1">
        <Outlet />
      </div>
    </div>
  );
};

export default EnhancedMobileLayout;