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

  // Only allow resize when in dashboard edit mode
  const handleMainContentResize = React.useCallback((sizes: number[]) => {
    if (isDashboardEditMode) {
      onMainContentResize(sizes);
    }
  }, [isDashboardEditMode, onMainContentResize]);

  const handleHorizontalResize = React.useCallback((sizes: number[]) => {
    if (isDashboardEditMode) {
      onHorizontalResize(sizes);
    }
  }, [isDashboardEditMode, onHorizontalResize]);

  return (
    <div className="h-full">
      <PanelGroup 
        direction="vertical" 
        className="h-full" 
        onLayout={handleMainContentResize}
        key={`main-content-${isDashboardEditMode}`} // Force re-render when edit mode changes
      >
        {/* Top Panel - KPI Stats */}
        <Panel 
          defaultSize={analyticsSize} 
          minSize={isDashboardEditMode ? 20 : analyticsSize} 
          maxSize={isDashboardEditMode ? 50 : analyticsSize}
        >
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
        
        {/* Only show resize handle when in edit mode */}
        {isDashboardEditMode && <HorizontalResizableHandle className="opacity-100" />}
        {!isDashboardEditMode && <div className="h-0" />}
        
        {/* Middle Panel - Two Boxes */}
        <Panel 
          defaultSize={topSectionSize} 
          minSize={isDashboardEditMode ? 25 : topSectionSize}
          maxSize={isDashboardEditMode ? 75 : topSectionSize}
        >
          <div className="h-full">
            <PanelGroup 
              direction="horizontal" 
              className="h-full" 
              onLayout={handleHorizontalResize}
              key={`horizontal-top-${isDashboardEditMode}`}
            >
              <Panel 
                defaultSize={leftPanelsSize} 
                minSize={isDashboardEditMode ? 30 : leftPanelsSize}
                maxSize={isDashboardEditMode ? 70 : leftPanelsSize}
              >
                <DashboardPanel panelKey="topLeft" />
              </Panel>
              
              {/* Only show resize handle when in edit mode */}
              {isDashboardEditMode && <HorizontalResizableHandle className="opacity-100" />}
              {!isDashboardEditMode && <div className="w-0" />}
              
              <Panel 
                defaultSize={rightPanelsSize} 
                minSize={isDashboardEditMode ? 30 : rightPanelsSize}
                maxSize={isDashboardEditMode ? 70 : rightPanelsSize}
              >
                <DashboardPanel panelKey="topRight" />
              </Panel>
            </PanelGroup>
          </div>
        </Panel>
        
        {/* Only show resize handle when in edit mode */}
        {isDashboardEditMode && <HorizontalResizableHandle className="opacity-100" />}
        {!isDashboardEditMode && <div className="h-0" />}
        
        {/* Bottom Panel - Two More Boxes */}
        <Panel 
          defaultSize={bottomSectionSize} 
          minSize={isDashboardEditMode ? 25 : bottomSectionSize}
          maxSize={isDashboardEditMode ? 75 : bottomSectionSize}
        >
          <div className="h-full">
            <PanelGroup 
              direction="horizontal" 
              className="h-full" 
              onLayout={handleHorizontalResize}
              key={`horizontal-bottom-${isDashboardEditMode}`}
            >
              <Panel 
                defaultSize={leftPanelsSize} 
                minSize={isDashboardEditMode ? 30 : leftPanelsSize}
                maxSize={isDashboardEditMode ? 70 : leftPanelsSize}
              >
                <DashboardPanel panelKey="bottomLeft" />
              </Panel>
              
              {/* Only show resize handle when in edit mode */}
              {isDashboardEditMode && <HorizontalResizableHandle className="opacity-100" />}
              {!isDashboardEditMode && <div className="w-0" />}
              
              <Panel 
                defaultSize={rightPanelsSize} 
                minSize={isDashboardEditMode ? 30 : rightPanelsSize}
                maxSize={isDashboardEditMode ? 70 : rightPanelsSize}
              >
                <DashboardPanel panelKey="bottomRight" />
              </Panel>
            </PanelGroup>
          </div>
        </Panel>
      </PanelGroup>
    </div>
  );
};