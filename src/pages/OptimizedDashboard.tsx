import React from 'react';
import { 
  ResizableDashboardContainer, 
  ResizableBannerSetup, 
  DashboardControls, 
  MainDashboardContent,
  EditLayoutModal 
} from '@/components/Dashboard';
import { useOptimizedNotes } from '@/contexts/OptimizedNotesContext';
import { useEditMode } from '@/contexts/EditModeContext';
import { useDashboardPanelSizes, useDashboardBanner } from '@/hooks';

const OptimizedDashboard: React.FC = () => {
  const { notes } = useOptimizedNotes();
  const { isDashboardEditMode } = useEditMode();
  const [showEditLayoutModal, setShowEditLayoutModal] = React.useState(false);

  // Custom hooks for clean separation of concerns
  const { panelSizes, handleBannerResize, handleMainContentResize, handleHorizontalResize } = useDashboardPanelSizes();
  const { 
    selectedBannerUrl, 
    handleImageUpload, 
    handleVideoUpload, 
    handleAIGenerate, 
    handleImageSelect 
  } = useDashboardBanner();

  return (
    <div className="w-full h-screen bg-background">
      <DashboardControls onEditLayoutClick={() => setShowEditLayoutModal(true)} />
      
      {/* Resizable Dashboard Container */}
      <div className={`h-full w-full transition-all duration-200 ${
        isDashboardEditMode ? 'ring-2 ring-primary/20 ring-inset' : ''
      }`}>
        <ResizableDashboardContainer
          bannerDefaultSize={panelSizes.banner}
          bannerMinSize={25}
          bannerMaxSize={80}
          isEditMode={isDashboardEditMode}
          onLayout={handleBannerResize}
          bannerContent={
            <ResizableBannerSetup
              onImageUpload={handleImageUpload}
              onAIGenerate={handleAIGenerate}
              onVideoUpload={handleVideoUpload}
              onImageSelect={handleImageSelect}
              selectedImageUrl={selectedBannerUrl}
              isEditMode={isDashboardEditMode}
            />
          }
          mainContent={
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
          }
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

export default React.memo(OptimizedDashboard);