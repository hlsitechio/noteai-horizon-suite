import React from 'react';
import { DashboardPanel } from '../DashboardPanel';

interface DashboardGridProps {
  className?: string;
}

export const DashboardGrid: React.FC<DashboardGridProps> = ({ className }) => {
  return (
    <div className={className}>
      {/* Top Row - Two Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 px-3 md:px-4">
        <div className="min-h-[400px]">
          <DashboardPanel panelKey="topLeft" className="p-4 h-full" />
        </div>
        <div className="min-h-[400px]">
          <DashboardPanel panelKey="topRight" className="p-4 h-full" />
        </div>
      </div>
      
      {/* Middle Row - Two Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 px-3 md:px-4">
        <div className="min-h-[400px]">
          <DashboardPanel panelKey="middleLeft" className="p-4 h-full" />
        </div>
        <div className="min-h-[400px]">
          <DashboardPanel panelKey="middleRight" className="p-4 h-full" />
        </div>
      </div>
      
      {/* Bottom Row - Two Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 px-3 md:px-4">
        <div className="min-h-[400px]">
          <DashboardPanel panelKey="bottomLeft" className="p-4 h-full" />
        </div>
        <div className="min-h-[400px]">
          <DashboardPanel panelKey="bottomRight" className="p-4 h-full" />
        </div>
      </div>
    </div>
  );
};