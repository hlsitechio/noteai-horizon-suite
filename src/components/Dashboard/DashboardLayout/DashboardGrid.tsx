import React from 'react';
import { DashboardPanel } from '../DashboardPanel';

interface DashboardGridProps {
  className?: string;
}

export const DashboardGrid: React.FC<DashboardGridProps> = ({ className }) => {
  return (
    <div className={className}>
      {/* Top Row - Two Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 px-2 md:px-3"> {/* Reduced gap from gap-6 to gap-4, reduced padding */}
        <div className="min-h-[300px]"> {/* Reduced height from 400px to 300px */}
          <DashboardPanel panelKey="topLeft" className="p-3 h-full" /> {/* Reduced padding from p-4 to p-3 */}
        </div>
        <div className="min-h-[300px]">
          <DashboardPanel panelKey="topRight" className="p-3 h-full" />
        </div>
      </div>
      
      {/* Middle Row - Two Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 px-2 md:px-3">
        <div className="min-h-[300px]">
          <DashboardPanel panelKey="middleLeft" className="p-3 h-full" />
        </div>
        <div className="min-h-[300px]">
          <DashboardPanel panelKey="middleRight" className="p-3 h-full" />
        </div>
      </div>
      
      {/* Bottom Row - Two Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 px-2 md:px-3">
        <div className="min-h-[300px]">
          <DashboardPanel panelKey="bottomLeft" className="p-3 h-full" />
        </div>
        <div className="min-h-[300px]">
          <DashboardPanel panelKey="bottomRight" className="p-3 h-full" />
        </div>
      </div>
    </div>
  );
};