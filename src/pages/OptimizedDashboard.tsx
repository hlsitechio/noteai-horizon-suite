import React from 'react';
import { 
  ResizableDashboardContainer, 
  DashboardControls, 
  MainDashboardContent,
  EditLayoutModal 
} from '@/components/Dashboard';
import { BannerWithTopNav } from '@/components/Dashboard/BannerWithTopNav';
import { ResizableSidebarContainer } from '@/components/Layout/ResizableSidebar';
import { Button } from '@/components/ui/button';
import { LayoutDashboard, BarChart3, Settings } from 'lucide-react';
import { useOptimizedNotes } from '@/contexts/OptimizedNotesContext';
import { useEditMode } from '@/contexts/EditModeContext';
import { useDashboardPanelSizes, useDashboardBanner } from '@/hooks';
import { useIsMobile } from '@/hooks/use-mobile';

const OptimizedDashboard: React.FC = () => {
  const { notes } = useOptimizedNotes();
  const { isDashboardEditMode, isLoading } = useEditMode();
  const [showEditLayoutModal, setShowEditLayoutModal] = React.useState(false);
  const isMobile = useIsMobile();

  // Custom hooks for clean separation of concerns
  const { panelSizes, handleBannerResize, handleMainContentResize, handleHorizontalResize } = useDashboardPanelSizes();
  const { 
    selectedBannerUrl, 
    handleImageUpload, 
    handleVideoUpload, 
    handleAIGenerate, 
    handleImageSelect 
  } = useDashboardBanner();

  // Removed excessive console logging to prevent PostHog rate limiting

  // Memoize computed values to prevent unnecessary re-renders
  const dashboardClassName = React.useMemo(() => 
    `h-full w-full transition-all duration-200 ${
      isDashboardEditMode ? 'ring-2 ring-primary/20 ring-inset' : ''
    }`, [isDashboardEditMode]
  );

  const memoizedBannerContent = React.useMemo(() => (
    <BannerWithTopNav
      onImageUpload={handleImageUpload}
      onAIGenerate={handleAIGenerate}
      onVideoUpload={handleVideoUpload}
      onImageSelect={handleImageSelect}
      selectedImageUrl={selectedBannerUrl}
      isEditMode={isDashboardEditMode}
      onEditLayoutClick={() => setShowEditLayoutModal(true)}
    />
  ), [handleImageUpload, handleAIGenerate, handleVideoUpload, handleImageSelect, selectedBannerUrl, isDashboardEditMode]);

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
    <div className="w-full h-screen bg-background">
      {!isMobile && <DashboardControls onEditLayoutClick={() => setShowEditLayoutModal(true)} />}
      
      {/* Resizable Dashboard Container */}
      <div className={dashboardClassName}>
        <ResizableDashboardContainer
          bannerDefaultSize={isMobile ? 35 : panelSizes.banner}
          bannerMinSize={isMobile ? 30 : 25}
          bannerMaxSize={isMobile ? 60 : 80}
          isEditMode={isDashboardEditMode}
          onLayout={handleBannerResize}
          bannerContent={memoizedBannerContent}
          mainContent={memoizedMainContent}
        />
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