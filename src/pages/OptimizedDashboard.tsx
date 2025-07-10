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
import { useDashboardPanelSizes } from '@/hooks';
import { usePageBannerSettings } from '@/hooks/usePageBannerSettings';
import { useIsMobile } from '@/hooks/use-mobile';

const OptimizedDashboard: React.FC = () => {
  const { notes } = useOptimizedNotes();
  const { isDashboardEditMode, isLoading } = useEditMode();
  const [showEditLayoutModal, setShowEditLayoutModal] = React.useState(false);
  const isMobile = useIsMobile();

  // Custom hooks for clean separation of concerns
  const { panelSizes, handleMainContentResize, handleHorizontalResize } = useDashboardPanelSizes();
  const { 
    selectedBannerUrl, 
    handleImageUpload, 
    handleVideoUpload, 
    handleAIGenerate, 
    handleImageSelect 
  } = usePageBannerSettings();

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
      bottomSectionSize={panelSizes.bottomSection}
      leftPanelsSize={panelSizes.leftPanels}
      rightPanelsSize={panelSizes.rightPanels}
      isDashboardEditMode={isDashboardEditMode}
      onMainContentResize={memoizedHandlers.onMainContentResize}
      onHorizontalResize={memoizedHandlers.onHorizontalResize}
    />
  ), [notes, panelSizes, isDashboardEditMode, memoizedHandlers]);

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
        onImageUpload={memoizedHandlers.onImageUpload}
        onAIGenerate={memoizedHandlers.onAIGenerate}
        onVideoUpload={memoizedHandlers.onVideoUpload}
        onImageSelect={memoizedHandlers.onImageSelect}
      />
    </div>
  );
};

export default OptimizedDashboard;