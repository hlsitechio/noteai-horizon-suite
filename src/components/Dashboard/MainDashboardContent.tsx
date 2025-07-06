import React from 'react';
import { PanelGroup, Panel } from 'react-resizable-panels';
import { ResizableHandle as HorizontalResizableHandle } from '@/components/ui/resizable';
import KPIStats from './KPIStats';
import { DashboardPanel } from './DashboardPanel';
import { Note } from '@/types/note';

interface MainDashboardContentProps {
  notes: Note[];
  analyticsSize: number;
  topSectionSize: number;
  bottomSectionSize: number;
  leftPanelsSize: number;
  rightPanelsSize: number;
  isDashboardEditMode: boolean;
  onMainContentResize: (sizes: number[]) => void;
  onHorizontalResize: (sizes: number[]) => void;
}

export const MainDashboardContent: React.FC<MainDashboardContentProps> = ({
  notes,
  analyticsSize,
  topSectionSize,
  bottomSectionSize,
  leftPanelsSize,
  rightPanelsSize,
  isDashboardEditMode,
  onMainContentResize,
  onHorizontalResize,
}) => {
  // Calculate stats for KPIStats
  const totalNotes = notes.length;
  const favoriteNotes = notes.filter(note => note.tags?.includes('favorite')).length;
  
  const categoryCounts = React.useMemo(() => {
    const counts: Record<string, number> = {};
    notes.forEach(note => {
      if (note.tags) {
        note.tags.forEach(tag => {
          if (tag !== 'favorite') {
            counts[tag] = (counts[tag] || 0) + 1;
          }
        });
      }
    });
    return counts;
  }, [notes]);

  const weeklyNotes = React.useMemo(() => {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    
    return notes.filter(note => {
      const noteDate = new Date(note.createdAt);
      return noteDate > oneWeekAgo;
    }).length;
  }, [notes]);

  const resizeHandleClass = isDashboardEditMode ? 'opacity-100' : 'opacity-30 hover:opacity-100';

  return (
    <div className="h-full">
      <PanelGroup direction="vertical" className="h-full" onLayout={onMainContentResize}>
        {/* Top Panel - KPI Stats */}
        <Panel defaultSize={analyticsSize} minSize={20} maxSize={50}>
          <div className="p-6 h-full overflow-y-auto">
            <KPIStats
              totalNotes={totalNotes}
              favoriteNotes={favoriteNotes}
              categoryCounts={categoryCounts}
              weeklyNotes={weeklyNotes}
              notes={notes}
            />
          </div>
        </Panel>
        
        <HorizontalResizableHandle className={resizeHandleClass} />
        
        {/* Middle Panel - Two Boxes */}
        <Panel defaultSize={topSectionSize} minSize={25}>
          <div className="h-full">
            <PanelGroup direction="horizontal" className="h-full" onLayout={onHorizontalResize}>
              <Panel defaultSize={leftPanelsSize} minSize={30}>
                <DashboardPanel panelKey="topLeft" />
              </Panel>
              
              <HorizontalResizableHandle className={resizeHandleClass} />
              
              <Panel defaultSize={rightPanelsSize} minSize={30}>
                <DashboardPanel panelKey="topRight" />
              </Panel>
            </PanelGroup>
          </div>
        </Panel>
        
        <HorizontalResizableHandle className={resizeHandleClass} />
        
        {/* Bottom Panel - Two More Boxes */}
        <Panel defaultSize={bottomSectionSize} minSize={25}>
          <div className="h-full">
            <PanelGroup direction="horizontal" className="h-full" onLayout={onHorizontalResize}>
              <Panel defaultSize={leftPanelsSize} minSize={30}>
                <DashboardPanel panelKey="bottomLeft" />
              </Panel>
              
              <HorizontalResizableHandle className={resizeHandleClass} />
              
              <Panel defaultSize={rightPanelsSize} minSize={30}>
                <DashboardPanel panelKey="bottomRight" />
              </Panel>
            </PanelGroup>
          </div>
        </Panel>
      </PanelGroup>
    </div>
  );
};