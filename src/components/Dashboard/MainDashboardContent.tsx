import React from 'react';
import { PanelGroup, Panel } from 'react-resizable-panels';
import { ResizableHandle as HorizontalResizableHandle } from '@/components/ui/resizable';
import { ScrollArea } from '@/components/ui/scroll-area';
import KPIStats from './KPIStats';
import { DashboardPanel } from './DashboardPanel';
import { NewUserWelcome } from './NewUserWelcome';
import { Note } from '@/types/note';
import { useIsMobile } from '@/hooks/use-mobile';
import { useAuth } from '@/contexts/AuthContext';

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
  const { user } = useAuth();
  const [showNewUserWelcome, setShowNewUserWelcome] = React.useState(false);
  const [isCheckingUserStatus, setIsCheckingUserStatus] = React.useState(true);
  
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

  // Check if user needs dashboard initialization
  React.useEffect(() => {
    const checkUserStatus = async () => {
      if (!user) {
        setIsCheckingUserStatus(false);
        return;
      }

      // If user has no notes, show welcome
      const hasNoContent = notes.length === 0;
      
      if (hasNoContent) {
        setShowNewUserWelcome(true);
      }
      
      setIsCheckingUserStatus(false);
    };

    checkUserStatus();
  }, [user, notes.length]);

  const handleDashboardInitialized = () => {
    setShowNewUserWelcome(false);
  };

  // Show welcome screen if it's a new user
  if (showNewUserWelcome && !isCheckingUserStatus) {
    return (
      <div className="h-full overflow-y-auto">
        <NewUserWelcome 
          onDashboardInitialized={handleDashboardInitialized}
          className="py-8"
        />
      </div>
    );
  }

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
        <div className="space-y-3 p-3">
          <div className="text-xs font-medium text-muted-foreground mb-2">Dashboard Components</div>
          <DashboardPanel panelKey="topLeft" className="p-4 min-h-[200px]" />
          <DashboardPanel panelKey="topRight" className="p-4 min-h-[200px]" />
          <DashboardPanel panelKey="middleLeft" className="p-4 min-h-[200px]" />
          <DashboardPanel panelKey="middleRight" className="p-4 min-h-[200px]" />
          <DashboardPanel panelKey="bottomLeft" className="p-4 min-h-[200px]" />
          <DashboardPanel panelKey="bottomRight" className="p-4 min-h-[200px]" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-full overflow-auto">
      {/* When in edit mode, use resizable panels */}
      {isDashboardEditMode ? (
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
          id="middle-section-panel"
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
                <div className="h-full border-r border-border/50">
                  <ScrollArea className="h-full">
                    <DashboardPanel panelKey="topLeft" className="p-4 min-h-full" />
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
                    <DashboardPanel panelKey="topRight" className="p-4 min-h-full" />
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
        
        {/* Middle Panel - Two More Boxes */}
        <Panel 
          id="middle-section-panel"
          order={2}
          defaultSize={topSectionSize} 
          minSize={isDashboardEditMode ? 25 : undefined}
          maxSize={isDashboardEditMode ? 75 : undefined}
        >
          <div className="h-full">
            <PanelGroup 
              direction="horizontal" 
              className="h-full" 
              onLayout={handleHorizontalResize}
              id="horizontal-middle"
              storage={createStorageHandler()}
            >
              <Panel 
                id="middle-left-panel"
                order={0}
                defaultSize={leftPanelsSize} 
                minSize={isDashboardEditMode ? 30 : undefined}
                maxSize={isDashboardEditMode ? 70 : undefined}
              >
                <div className="h-full border-r border-border/50">
                  <ScrollArea className="h-full">
                    <DashboardPanel panelKey="middleLeft" className="p-4 min-h-full" />
                  </ScrollArea>
                </div>
              </Panel>
              
              {/* Only show resize handle when in edit mode - Always present */}
              <HorizontalResizableHandle 
                className={isDashboardEditMode ? "opacity-100" : "opacity-0 pointer-events-none w-1"} 
              />
              
              <Panel 
                id="middle-right-panel"
                order={1}
                defaultSize={rightPanelsSize} 
                minSize={isDashboardEditMode ? 30 : undefined}
                maxSize={isDashboardEditMode ? 70 : undefined}
              >
                <div className="h-full">
                  <ScrollArea className="h-full">
                    <DashboardPanel panelKey="middleRight" className="p-4 min-h-full" />
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
          order={3}
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
                <div className="h-full border-r border-border/50">
                  <ScrollArea className="h-full">
                    <DashboardPanel panelKey="bottomLeft" className="p-4 min-h-full" />
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
                    <DashboardPanel panelKey="bottomRight" className="p-4 min-h-full" />
                  </ScrollArea>
                </div>
              </Panel>
            </PanelGroup>
          </div>
        </Panel>
      </PanelGroup>
      ) : (
        /* Normal scrollable layout when not in edit mode */
        <div className="space-y-6">
          {/* KPI Stats */}
          <div className="p-3 md:p-4">
            <KPIStats
              totalNotes={totalNotes}
              favoriteNotes={favoriteNotes}
              categoryCounts={categoryCounts}
              weeklyNotes={weeklyNotes}
              notes={notes}
            />
          </div>
          
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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 px-3 md:px-4 pb-6">
            <div className="min-h-[400px]">
              <DashboardPanel panelKey="bottomLeft" className="p-4 h-full" />
            </div>
            <div className="min-h-[400px]">
              <DashboardPanel panelKey="bottomRight" className="p-4 h-full" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};