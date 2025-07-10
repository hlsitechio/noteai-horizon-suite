import React from 'react';
import { 
  DashboardControls, 
  MainDashboardContent,
  EditLayoutModal 
} from '@/components/Dashboard';
import { Button } from '@/components/ui/button';
import { LayoutDashboard, BarChart3, Settings } from 'lucide-react';
import { useOptimizedNotes } from '@/contexts/OptimizedNotesContext';
import { useEditMode } from '@/contexts/EditModeContext';
import { useDashboardPanelSizes, useDashboardBanner } from '@/hooks';
import { useIsMobile } from '@/hooks/use-mobile';

const OptimizedDashboard: React.FC = () => {
  console.log('OptimizedDashboard: Component starting to render');
  
  const { notes } = useOptimizedNotes();
  console.log('OptimizedDashboard: Notes loaded', notes?.length || 0);
  
  const { isDashboardEditMode, isLoading } = useEditMode();
  console.log('OptimizedDashboard: Edit mode state', { isDashboardEditMode, isLoading });
  
  const [showEditLayoutModal, setShowEditLayoutModal] = React.useState(false);
  const isMobile = useIsMobile();
  console.log('OptimizedDashboard: Mobile state', isMobile);

  // Custom hooks for clean separation of concerns
  const { panelSizes, handleMainContentResize, handleHorizontalResize } = useDashboardPanelSizes();
  console.log('OptimizedDashboard: Panel sizes loaded', panelSizes);
  
  const { 
    selectedBannerUrl, 
    handleImageUpload, 
    handleVideoUpload, 
    handleAIGenerate, 
    handleImageSelect 
  } = useDashboardBanner();
  console.log('OptimizedDashboard: Banner state loaded', selectedBannerUrl);

  // Loading state
  if (isLoading) {
    console.log('OptimizedDashboard: Still loading...');
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4" />
          <p>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // Memoize computed values to prevent unnecessary re-renders
  const dashboardClassName = React.useMemo(() => 
    `h-full w-full transition-all duration-200 ${
      isDashboardEditMode ? 'ring-2 ring-primary/20 ring-inset' : ''
    }`, [isDashboardEditMode]
  );

  const memoizedMainContent = React.useMemo(() => (
    <MainDashboardContent
      notes={notes}
      analyticsSize={panelSizes.analytics}
      topSectionSize={panelSizes.topSection}
      bottomSectionSize={panelSizes.bottomSection}
      leftPanelsSize={panelSizes.leftPanels}
      rightPanelsSize={panelSizes.rightPanels}
      isDashboardEditMode={isDashboardEditMode}
      onMainContentResize={handleMainContentResize}
      onHorizontalResize={handleHorizontalResize}
    />
  ), [notes, panelSizes.analytics, panelSizes.topSection, panelSizes.bottomSection, panelSizes.leftPanels, panelSizes.rightPanels, isDashboardEditMode, handleMainContentResize, handleHorizontalResize]);

  return (
    <div className="w-full h-full bg-background">
      {!isMobile && <DashboardControls onEditLayoutClick={() => setShowEditLayoutModal(true)} />}
      
      {/* Main Content - No banner needed since it's handled by BannerLayout */}
      <div className={dashboardClassName}>
        {memoizedMainContent}
      </div>

      {/* Edit Layout Modal */}
      <EditLayoutModal
        open={showEditLayoutModal}
        onOpenChange={setShowEditLayoutModal}
        onImageUpload={handleImageUpload}
        onAIGenerate={handleAIGenerate}
        onVideoUpload={handleVideoUpload}
        onImageSelect={handleImageSelect}
      />
    </div>
  );
};

export default OptimizedDashboard;