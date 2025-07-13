import React from 'react';
import { PanelGroup, Panel } from 'react-resizable-panels';
import { ResizableHandle as HorizontalResizableHandle } from '@/components/ui/resizable';
import { ScrollArea } from '@/components/ui/scroll-area';
import KPIStats from './KPIStats';
import { SelectedComponentsArea } from './SelectedComponentsArea';
import { Note } from '@/types/note';
import { useIsMobile } from '@/hooks/use-mobile';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useDashboardStatus } from './hooks/useDashboardStatus';
import { MobileDashboardLayout } from './DashboardLayout/MobileDashboardLayout';
import { DashboardGrid } from './DashboardLayout/DashboardGrid';
import { ResizableDashboardGrid } from './DashboardLayout/ResizableDashboardGrid';
import { DashboardLoadingState, RedirectLoadingState } from './DashboardLayout/DashboardLoadingStates';

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
  const navigate = useNavigate();
  const { isDashboardInitialized, isLoading } = useDashboardStatus();
  
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

  // Redirect new users to onboarding if they haven't initialized dashboard yet
  React.useEffect(() => {
    if (!isLoading && !isDashboardInitialized && user) {
      navigate('/setup', { replace: true });
    }
  }, [isDashboardInitialized, isLoading, user, navigate]);

  // Show loading state while checking dashboard status
  if (isLoading) {
    return <DashboardLoadingState />;
  }

  // If user should be redirected to onboarding, show loading while redirecting
  if (!isDashboardInitialized && user) {
    return <RedirectLoadingState />;
  }

  // Create storage handler that returns null to disable localStorage persistence
  // We handle persistence through our own system
  const createStorageHandler = () => {
    return null; // Always return null to disable localStorage integration
  };

  // On mobile, render a simpler stacked layout
  if (isMobile) {
    return (
      <MobileDashboardLayout
        totalNotes={totalNotes}
        favoriteNotes={favoriteNotes}
        categoryCounts={categoryCounts}
        weeklyNotes={weeklyNotes}
        notes={notes}
      />
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
        
        {/* Dashboard Grid Panels */}
        <ResizableDashboardGrid
          topSectionSize={topSectionSize}
          bottomSectionSize={bottomSectionSize}
          leftPanelsSize={leftPanelsSize}
          rightPanelsSize={rightPanelsSize}
          isDashboardEditMode={isDashboardEditMode}
          onMainContentResize={handleMainContentResize}
          onHorizontalResize={handleHorizontalResize}
          createStorageHandler={createStorageHandler}
          startOrder={1}
        />
        
        <ResizableDashboardGrid
          topSectionSize={topSectionSize}
          bottomSectionSize={bottomSectionSize}
          leftPanelsSize={leftPanelsSize}
          rightPanelsSize={rightPanelsSize}
          isDashboardEditMode={isDashboardEditMode}
          onMainContentResize={handleMainContentResize}
          onHorizontalResize={handleHorizontalResize}
          createStorageHandler={createStorageHandler}
          startOrder={2}
        />
        
        <ResizableDashboardGrid
          topSectionSize={bottomSectionSize}
          bottomSectionSize={bottomSectionSize}
          leftPanelsSize={leftPanelsSize}
          rightPanelsSize={rightPanelsSize}
          isDashboardEditMode={isDashboardEditMode}
          onMainContentResize={handleMainContentResize}
          onHorizontalResize={handleHorizontalResize}
          createStorageHandler={createStorageHandler}
          startOrder={3}
        />
        
        {/* Only show resize handle when in edit mode - Always present */}
        <HorizontalResizableHandle 
          className={isDashboardEditMode ? "opacity-100" : "opacity-0 pointer-events-none h-1"} 
        />
        
        {/* Selected Components Area Panel */}
        <Panel 
          id="selected-components-panel"
          order={4}
          defaultSize={25} 
          minSize={isDashboardEditMode ? 15 : undefined}
          maxSize={isDashboardEditMode ? 40 : undefined}
        >
          <div className="h-full">
            <ScrollArea className="h-full">
              <div className="p-3 md:p-4">
                <SelectedComponentsArea />
              </div>
            </ScrollArea>
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
          
          {/* Dashboard Grid */}
          <DashboardGrid className="space-y-6" />

          {/* Selected Components Area */}
          <div className="px-3 md:px-4 pb-6">
            <SelectedComponentsArea className="min-h-[300px]" />
          </div>
        </div>
      )}
    </div>
  );
};