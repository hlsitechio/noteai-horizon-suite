import React from 'react';
import { motion, Variants } from 'framer-motion';
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
  middleSectionSize: number;
  bottomSectionSize: number;
  selectedComponentsSize: number;
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
  middleSectionSize,
  bottomSectionSize,
  selectedComponentsSize,
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
  const [isInitialLoad, setIsInitialLoad] = React.useState(true);

  // Set initial load to false after a short delay to trigger animations
  React.useEffect(() => {
    if (!isLoading && isDashboardInitialized) {
      const timer = setTimeout(() => {
        setIsInitialLoad(false);
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [isLoading, isDashboardInitialized]);
  
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

  // Animation variants for dashboard components
  const dashboardVariants: Variants = {
    initial: { 
      opacity: 0, 
      scale: 0.95 
    },
    animate: { 
      opacity: 1, 
      scale: 1,
      transition: {
        duration: 0.3,
        ease: "easeOut",
        staggerChildren: 0.1
      }
    }
  };

  const componentVariants: Variants = {
    initial: { 
      opacity: 0, 
      scale: 0.95 
    },
    animate: { 
      opacity: 1, 
      scale: 1,
      transition: {
        duration: 0.3,
        ease: "easeOut"
      }
    }
  };

  return (
    <motion.div 
      className="min-h-full overflow-auto"
      variants={dashboardVariants}
      initial="initial"
      animate={isInitialLoad ? "initial" : "animate"}
    >
      {/* When in edit mode, use resizable panels */}
      {isDashboardEditMode ? (
        <PanelGroup 
          direction="vertical" 
          className="h-full" 
          onLayout={handleMainContentResize}
          id="main-dashboard-content-panels"
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
          <motion.div className="h-full" variants={componentVariants}>
            <ScrollArea className="h-full">
              <div className="p-2 md:p-3">{/* Reduced padding from p-4 to p-3 */}
                <KPIStats
                  totalNotes={totalNotes}
                  favoriteNotes={favoriteNotes}
                  categoryCounts={categoryCounts}
                  weeklyNotes={weeklyNotes}
                  notes={notes}
                />
              </div>
            </ScrollArea>
          </motion.div>
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
          topSectionSize={middleSectionSize}
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
          topSectionSize={topSectionSize}
          bottomSectionSize={bottomSectionSize}
          leftPanelsSize={leftPanelsSize}
          rightPanelsSize={rightPanelsSize}
          isDashboardEditMode={isDashboardEditMode}
          onMainContentResize={handleMainContentResize}
          onHorizontalResize={handleHorizontalResize}
          createStorageHandler={createStorageHandler}
          startOrder={3}
        />
        
        {/* Final resize handle for Selected Components Area */}
        <HorizontalResizableHandle 
          className={isDashboardEditMode ? "opacity-100" : "opacity-0 pointer-events-none h-1"} 
        />
        
        {/* Selected Components Area Panel */}
        <Panel 
          id="selected-components-panel"
          order={4}
          defaultSize={selectedComponentsSize} 
          minSize={isDashboardEditMode ? 15 : undefined}
          maxSize={isDashboardEditMode ? 40 : undefined}
        >
          <motion.div className="h-full" variants={componentVariants}>
            <ScrollArea className="h-full">
              <div className="p-2 md:p-3">
                <SelectedComponentsArea />
              </div>
            </ScrollArea>
          </motion.div>
        </Panel>
      </PanelGroup>
      ) : (
        /* Normal scrollable layout when not in edit mode */
        <motion.div 
          className="space-y-4"
          variants={dashboardVariants}
          initial="initial"
          animate={isInitialLoad ? "initial" : "animate"}
        > {/* Reduced from space-y-6 to space-y-4 */}
          {/* KPI Stats */}
          <motion.div className="p-2 md:p-3" variants={componentVariants}> {/* Reduced padding */}
            <KPIStats
              totalNotes={totalNotes}
              favoriteNotes={favoriteNotes}
              categoryCounts={categoryCounts}
              weeklyNotes={weeklyNotes}
              notes={notes}
            />
          </motion.div>
          
          {/* Dashboard Grid */}
          <motion.div variants={componentVariants}>
            <DashboardGrid className="space-y-4" /> {/* Reduced from space-y-6 to space-y-4 */}
          </motion.div>

          {/* Selected Components Area */}
          <motion.div className="px-2 md:px-3 pb-4" variants={componentVariants}> {/* Reduced padding */}
            <SelectedComponentsArea className="min-h-[250px]" /> {/* Reduced from 300px to 250px */}
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
};