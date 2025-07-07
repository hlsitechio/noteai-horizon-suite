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

const OptimizedDashboard: React.FC = () => {
  const { notes } = useOptimizedNotes();
  const { isDashboardEditMode, isLoading } = useEditMode();
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

  console.log('Dashboard render - isDashboardEditMode:', isDashboardEditMode, 'isLoading:', isLoading);

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

  const dashboardMainContent = React.useMemo(() => (
    <div className="h-full">
      <DashboardControls onEditLayoutClick={() => setShowEditLayoutModal(true)} />
      
      {/* Resizable Dashboard Container */}
      <div className={dashboardClassName}>
        <ResizableDashboardContainer
          bannerDefaultSize={panelSizes.banner}
          bannerMinSize={25}
          bannerMaxSize={80}
          isEditMode={isDashboardEditMode}
          onLayout={handleBannerResize}
          bannerContent={memoizedBannerContent}
          mainContent={memoizedMainContent}
        />
      </div>
    </div>
  ), [dashboardClassName, panelSizes.banner, isDashboardEditMode, handleBannerResize, memoizedBannerContent, memoizedMainContent]);

  return (
    <div className="w-full h-screen bg-background">
      <ResizableSidebarContainer
        sidebarDefaultSize={20}
        sidebarMinSize={15}
        sidebarMaxSize={35}
        isEditMode={isDashboardEditMode}
        sidebarContent={
          <div className="p-4">
            <h2 className="text-lg font-semibold mb-4">Dashboard Controls</h2>
            <div className="space-y-2">
              <Button variant="outline" size="sm" className="w-full justify-start">
                <LayoutDashboard className="w-4 h-4 mr-2" />
                Overview
              </Button>
              <Button variant="ghost" size="sm" className="w-full justify-start">
                <BarChart3 className="w-4 h-4 mr-2" />
                Analytics
              </Button>
              <Button variant="ghost" size="sm" className="w-full justify-start">
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </Button>
            </div>
          </div>
        }
        mainContent={dashboardMainContent}
      />

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