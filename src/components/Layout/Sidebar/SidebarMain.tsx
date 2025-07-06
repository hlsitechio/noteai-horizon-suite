import React, { useRef, useEffect } from 'react';
import {
  TooltipProvider,
} from '@/components/ui/tooltip';
import { PanelGroup, Panel } from 'react-resizable-panels';
import { ResizableHandle } from '@/components/ui/resizable';
import NavigationMenu from './NavigationMenu';
import { SidebarFooter as CustomSidebarFooter } from './SidebarFooter';
import { NotesSection } from './NotesSection';
import { useEditMode } from '@/contexts/EditModeContext';
import { useDashboardSettings } from '@/hooks/useDashboardSettings';
import { useIsMobile } from '@/hooks/use-mobile';
import { toast } from 'sonner';

export function SidebarMain() {
  const isMobile = useIsMobile();
  const { isSidebarEditMode, setIsSidebarEditMode } = useEditMode();
  const { settings, updateSidebarPanelSizes, isLoading } = useDashboardSettings();
  const saveTimeoutRef = useRef<NodeJS.Timeout>();
  const hasUserInteractedRef = useRef(false);

  // Get saved panel sizes or use defaults
  const savedSizes = settings?.sidebar_panel_sizes || {};
  const navigationSize = savedSizes.navigation || 40;
  const contentSize = savedSizes.content || 40;
  const footerSize = savedSizes.footer || 20;

  // Track when user actually interacts with panels
  const handlePanelResizeStart = () => {
    hasUserInteractedRef.current = true;
  };

  const handleLayoutChange = (sizes: number[]) => {
    // Only allow changes when in sidebar edit mode
    if (!isSidebarEditMode) return;
    
    if (sizes.length >= 3) {
      const newSizes = {
        navigation: sizes[0], 
        content: sizes[1],
        footer: sizes[2]
      };
      
      // Clear existing timeout
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
      
      // Debounced save with auto-lock (only after initialization)
      saveTimeoutRef.current = setTimeout(async () => {
        console.log('Saving sidebar panel sizes:', newSizes);
        const success = await updateSidebarPanelSizes(newSizes);
        
        if (success) {
          console.log('Sidebar panel sizes saved successfully:', newSizes);
          
          // Auto-exit sidebar edit mode after successful save (only if user interacted)
          if (isSidebarEditMode && hasUserInteractedRef.current) {
            setIsSidebarEditMode(false);
            toast.success('Sidebar layout saved and locked');
          }
        } else {
          console.error('Failed to save sidebar panel sizes');
          toast.error('Failed to save sidebar layout');
        }
      }, 500); // 500ms debounce
    }
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, []);

  return (
    <TooltipProvider>
      <div className="h-full bg-sidebar">
        <PanelGroup 
          direction="vertical" 
          className="h-full"
          onLayout={handleLayoutChange}
          key={`sidebar-${isSidebarEditMode}`} // Force re-render when edit mode changes
        >
          {/* Navigation Panel */}
          <Panel 
            defaultSize={navigationSize} 
            minSize={isSidebarEditMode ? 25 : navigationSize} 
            maxSize={isSidebarEditMode ? 50 : navigationSize}
          >
            <div className="px-0 h-full overflow-y-auto">
              <div className="py-2">
                <NavigationMenu />
              </div>
            </div>
          </Panel>

          {/* Vertical Resize Handle - Always present but disabled when not in edit mode */}
          {isSidebarEditMode && (
            <ResizableHandle 
              className="opacity-100" 
              onMouseDown={handlePanelResizeStart}
              onTouchStart={handlePanelResizeStart}
            />
          )}
          {!isSidebarEditMode && <ResizableHandle className="opacity-0 pointer-events-none h-1" />}

          {/* Content Panel - Notes Section */}
          <Panel 
            defaultSize={contentSize} 
            minSize={isSidebarEditMode ? 20 : contentSize} 
            maxSize={isSidebarEditMode ? 60 : contentSize}
          >
            <div className="px-0 h-full overflow-y-auto">
              <NotesSection />
            </div>
          </Panel>

          {/* Vertical Resize Handle - Always present but disabled when not in edit mode */}
          {isSidebarEditMode && (
            <ResizableHandle 
              className="opacity-100" 
              onMouseDown={handlePanelResizeStart}
              onTouchStart={handlePanelResizeStart}
            />
          )}
          {!isSidebarEditMode && <ResizableHandle className="opacity-0 pointer-events-none h-1" />}

          {/* Footer Panel */}
          <Panel 
            defaultSize={footerSize} 
            minSize={isSidebarEditMode ? 10 : footerSize} 
            maxSize={isSidebarEditMode ? 25 : footerSize}
          >
            <div className="p-2 pt-1 h-full border-t border-sidebar-border flex items-center">
              <CustomSidebarFooter />
            </div>
          </Panel>
        </PanelGroup>
      </div>
    </TooltipProvider>
  );
}