import React from 'react';
import { 
  DashboardControls, 
  MainDashboardContent,
  EditLayoutModal 
} from '@/components/Dashboard';
console.log('Dashboard components imported successfully:', { DashboardControls, MainDashboardContent, EditLayoutModal });
import { Button } from '@/components/ui/button';
import { LayoutDashboard, BarChart3, Settings } from 'lucide-react';
import { useOptimizedNotes } from '@/contexts/OptimizedNotesContext';
import { useEditMode } from '@/contexts/EditModeContext';
import { useDashboardWorkspace } from '@/hooks/useDashboardWorkspace';
import { useIsMobile } from '@/hooks/use-mobile';

const OptimizedDashboard: React.FC = () => {
  const { notes } = useOptimizedNotes();
  const { isDashboardEditMode, isLoading } = useEditMode();
  const [showEditLayoutModal, setShowEditLayoutModal] = React.useState(false);
  const isMobile = useIsMobile();

  // Custom hooks for clean separation of concerns
  const { 
    workspace, 
    getPanelSizes, 
    updatePanelSizes,
    getBannerSettings,
    updateBannerSelection 
  } = useDashboardWorkspace();
  
  const panelSizes = getPanelSizes();
  const { url: selectedBannerUrl } = getBannerSettings();

  const handleMainContentResize = async (sizes: number[]) => {
    if (sizes.length >= 5) {
      const newSizes = { ...panelSizes };
      newSizes.analytics = Math.round(sizes[0]);
      newSizes.topSection = Math.round(sizes[1]);    // Grid 1
      newSizes.middleSection = Math.round(sizes[2]);  // Grid 2
      newSizes.bottomSection = Math.round(sizes[3]);  // Grid 3
      newSizes.selectedComponents = Math.round(sizes[4]); // Selected Components
      await updatePanelSizes(newSizes);
    }
  };

  const handleHorizontalResize = async (sizes: number[]) => {
    if (sizes.length >= 2) {
      const newSizes = { ...panelSizes };
      newSizes.leftPanels = Math.round(sizes[0]);
      newSizes.rightPanels = Math.round(sizes[1]);
      await updatePanelSizes(newSizes);
    }
  };

  const handleImageUpload = async (file: File) => {
    console.log('Image upload:', file);
  };

  const handleVideoUpload = async (file: File) => {
    console.log('Video upload:', file);
  };

  const handleAIGenerate = async () => {
    console.log('AI generate');
  };

  const handleImageSelect = async (url: string) => {
    await updateBannerSelection(url, 'image');
  };

  // Memoize computed values to prevent unnecessary re-renders
  const dashboardClassName = React.useMemo(() => 
    `h-full w-full transition-all duration-200 ${
      isDashboardEditMode ? 'ring-2 ring-primary/20 ring-inset' : ''
    }`, [isDashboardEditMode]
  );

  // Memoize handlers for performance
  const memoizedHandlers = React.useMemo(() => ({
    onMainContentResize: handleMainContentResize,
    onHorizontalResize: handleHorizontalResize,
    onImageUpload: handleImageUpload,
    onVideoUpload: handleVideoUpload,
    onAIGenerate: handleAIGenerate,
    onImageSelect: handleImageSelect,
  }), [handleMainContentResize, handleHorizontalResize, handleImageUpload, handleVideoUpload, handleAIGenerate, handleImageSelect]);

  const memoizedMainContent = React.useMemo(() => (
    <MainDashboardContent
      notes={notes}
      analyticsSize={panelSizes.analytics}
      topSectionSize={panelSizes.topSection}
      middleSectionSize={panelSizes.middleSection}
      bottomSectionSize={panelSizes.bottomSection}
      selectedComponentsSize={panelSizes.selectedComponents}
      leftPanelsSize={panelSizes.leftPanels}
      rightPanelsSize={panelSizes.rightPanels}
      isDashboardEditMode={isDashboardEditMode}
      onMainContentResize={memoizedHandlers.onMainContentResize}
      onHorizontalResize={memoizedHandlers.onHorizontalResize}
    />
  ), [notes, panelSizes, isDashboardEditMode, memoizedHandlers]);

  return (
    <div className="w-full h-full bg-background" data-onboarding="dashboard">
      {!isMobile && <DashboardControls onEditLayoutClick={() => setShowEditLayoutModal(true)} />}
      
      {/* Main Content - No banner needed since it's handled by BannerLayout */}
      <div className={dashboardClassName}>
        {memoizedMainContent}
      </div>

      {/* Edit Layout Modal */}
      <EditLayoutModal
        open={showEditLayoutModal}
        onOpenChange={setShowEditLayoutModal}
        onImageUpload={memoizedHandlers.onImageUpload}
        onAIGenerate={memoizedHandlers.onAIGenerate}
        onVideoUpload={memoizedHandlers.onVideoUpload}
        onImageSelect={memoizedHandlers.onImageSelect}
      />
    </div>
  );
};

export default OptimizedDashboard;