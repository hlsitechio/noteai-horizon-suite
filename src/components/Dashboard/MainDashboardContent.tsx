import React from 'react';
import { PanelGroup, Panel } from 'react-resizable-panels';
import { ResizableHandle as HorizontalResizableHandle } from '@/components/ui/resizable';
import { ScrollArea } from '@/components/ui/scroll-area';
import KPIStats from './KPIStats';
import { DashboardPanel } from './DashboardPanel';
import { Note } from '@/types/note';
import { useIsMobile } from '@/hooks/use-mobile';

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
  const isMobile = useIsMobile();
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

  // Create storage handler that returns null to disable localStorage persistence
  // We handle persistence through our own system
  const createStorageHandler = () => {
    return null; // Always return null to disable localStorage integration
  };

  // On mobile, render a simpler stacked layout
  if (isMobile) {
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
        <div className="grid grid-cols-1 gap-3 p-3">
          <DashboardPanel panelKey="topLeft" className="p-4" />
          <DashboardPanel panelKey="topRight" className="p-4" />
          <DashboardPanel panelKey="bottomLeft" className="p-4" />
          <DashboardPanel panelKey="bottomRight" className="p-4" />
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-hidden">
      <PanelGroup 
        direction="vertical" 
        className="h-full" 
        onLayout={handleMainContentResize}
        id="main-dashboard-content"
        storage={createStorageHandler()}
      >
        {/* Top Panel - KPI Stats */}
        <Panel 
          id="analytics-panel"
          order={0}
          defaultSize={analyticsSize} 
          minSize={isDashboardEditMode ? 20 : undefined} 
          maxSize={isDashboardEditMode ? 50 : undefined}
        >
          <div className="h-full">
            <ScrollArea className="h-full">
              <div className="p-3 md:p-4">{/* Reduced padding from p-6 to p-4 */}
                <KPIStats
                  totalNotes={totalNotes}
                  favoriteNotes={favoriteNotes}
                  categoryCounts={categoryCounts}
                  weeklyNotes={weeklyNotes}
                  notes={notes}
                />
              </div>
            </ScrollArea>
          </div>
        </Panel>
        
        {/* Only show resize handle when in edit mode - Always present */}
        <HorizontalResizableHandle 
          className={isDashboardEditMode ? "opacity-100" : "opacity-0 pointer-events-none h-1"} 
        />
        
        {/* Middle Panel - Two Boxes */}
        <Panel 
          id="top-section-panel"
          order={1}
          defaultSize={topSectionSize} 
          minSize={isDashboardEditMode ? 25 : undefined}
          maxSize={isDashboardEditMode ? 75 : undefined}
        >
          <div className="h-full">
            <PanelGroup 
              direction="horizontal" 
              className="h-full" 
              onLayout={handleHorizontalResize}
              id="horizontal-top"
              storage={createStorageHandler()}
            >
              <Panel 
                id="top-left-panel"
                order={0}
                defaultSize={leftPanelsSize} 
                minSize={isDashboardEditMode ? 30 : undefined}
                maxSize={isDashboardEditMode ? 70 : undefined}
              >
                <div className="h-full">
                  <ScrollArea className="h-full">
                    <DashboardPanel panelKey="topLeft" />
                  </ScrollArea>
                </div>
              </Panel>
              
              {/* Only show resize handle when in edit mode - Always present */}
              <HorizontalResizableHandle 
                className={isDashboardEditMode ? "opacity-100" : "opacity-0 pointer-events-none w-1"} 
              />
              
              <Panel 
                id="top-right-panel"
                order={1}
                defaultSize={rightPanelsSize} 
                minSize={isDashboardEditMode ? 30 : undefined}
                maxSize={isDashboardEditMode ? 70 : undefined}
              >
                <div className="h-full">
                  <ScrollArea className="h-full">
                    <DashboardPanel panelKey="topRight" />
                  </ScrollArea>
                </div>
              </Panel>
            </PanelGroup>
          </div>
        </Panel>
        
        {/* Only show resize handle when in edit mode - Always present */}
        <HorizontalResizableHandle 
          className={isDashboardEditMode ? "opacity-100" : "opacity-0 pointer-events-none h-1"} 
        />
        
        {/* Bottom Panel - Two More Boxes */}
        <Panel 
          id="bottom-section-panel"
          order={2}
          defaultSize={bottomSectionSize} 
          minSize={isDashboardEditMode ? 25 : undefined}
          maxSize={isDashboardEditMode ? 75 : undefined}
        >
          <div className="h-full">
            <PanelGroup 
              direction="horizontal" 
              className="h-full" 
              onLayout={handleHorizontalResize}
              id="horizontal-bottom"
              storage={createStorageHandler()}
            >
              <Panel 
                id="bottom-left-panel"
                order={0}
                defaultSize={leftPanelsSize} 
                minSize={isDashboardEditMode ? 30 : undefined}
                maxSize={isDashboardEditMode ? 70 : undefined}
              >
                <div className="h-full">
                  <ScrollArea className="h-full">
                    <DashboardPanel panelKey="bottomLeft" />
                  </ScrollArea>
                </div>
              </Panel>
              
              {/* Only show resize handle when in edit mode - Always present */}
              <HorizontalResizableHandle 
                className={isDashboardEditMode ? "opacity-100" : "opacity-0 pointer-events-none w-1"} 
              />
              
              <Panel 
                id="bottom-right-panel"
                order={1}
                defaultSize={rightPanelsSize} 
                minSize={isDashboardEditMode ? 30 : undefined}
                maxSize={isDashboardEditMode ? 70 : undefined}
              >
                <div className="h-full">
                  <ScrollArea className="h-full">
                    <DashboardPanel panelKey="bottomRight" />
                  </ScrollArea>
                </div>
              </Panel>
            </PanelGroup>
          </div>
        </Panel>
      </PanelGroup>
    </div>
  );
};