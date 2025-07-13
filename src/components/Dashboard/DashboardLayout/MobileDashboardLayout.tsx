import React from 'react';
import KPIStats from '../KPIStats';
import { DashboardPanel } from '../DashboardPanel';
import { SelectedComponentsArea } from '../SelectedComponentsArea';
import { Note } from '@/types/note';

interface MobileDashboardLayoutProps {
  totalNotes: number;
  favoriteNotes: number;
  categoryCounts: Record<string, number>;
  weeklyNotes: number;
  notes: Note[];
}

export const MobileDashboardLayout: React.FC<MobileDashboardLayoutProps> = ({
  totalNotes,
  favoriteNotes,
  categoryCounts,
  weeklyNotes,
  notes
}) => {
  return (
    <div className="h-full overflow-y-auto">
      {/* KPI Stats */}
      <div className="p-3">
        <KPIStats
          totalNotes={totalNotes}
          favoriteNotes={favoriteNotes}
          categoryCounts={categoryCounts}
          weeklyNotes={weeklyNotes}
          notes={notes}
        />
      </div>
      
      {/* Dashboard Panels - Stacked on mobile */}
      <div className="space-y-3 p-3">
        <div className="text-xs font-medium text-muted-foreground mb-2">Dashboard Components</div>
        <DashboardPanel panelKey="topLeft" className="p-4 min-h-[200px]" />
        <DashboardPanel panelKey="topRight" className="p-4 min-h-[200px]" />
        <DashboardPanel panelKey="middleLeft" className="p-4 min-h-[200px]" />
        <DashboardPanel panelKey="middleRight" className="p-4 min-h-[200px]" />
        <DashboardPanel panelKey="bottomLeft" className="p-4 min-h-[200px]" />
        <DashboardPanel panelKey="bottomRight" className="p-4 min-h-[200px]" />
        
        {/* Selected Components Area - Mobile */}
        <SelectedComponentsArea className="min-h-[300px]" />
      </div>
    </div>
  );
};