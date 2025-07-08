import React, { useRef, useEffect, useState } from 'react';
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
  const { settings, updateSidebarPanelSizes } = useDashboardSettings();
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const hasUserInteractedRef = useRef(false);
  const [isMounted, setIsMounted] = useState(false);

  // Fix hydration mismatch - only enable storage after mount
  useEffect(() => {
    setIsMounted(true);
  }, []);
  
  // Disable PanelGroup storage to prevent infinite loops
  const createStorageHandler = () => {
    return null; // Always return null to disable localStorage integration
  };

  // Static default panel sizes that don't change during render
  const getDefaultSizes = () => {
    if (!isMounted || !settings?.sidebar_panel_sizes) {
      return {
        navigation: 40,
        content: 40,
        footer: 20
      };
    }
    
    return {
      navigation: settings.sidebar_panel_sizes.navigation || 40,
      content: settings.sidebar_panel_sizes.content || 40,
      footer: settings.sidebar_panel_sizes.footer || 20
    };
  };

  const defaultSizes = getDefaultSizes();

  // Track when user actually interacts with panels
  const handlePanelResizeStart = () => {
    hasUserInteractedRef.current = true;
  };

  const handleLayoutChange = (sizes: number[]) => {
    // Only allow changes when in sidebar edit mode and user has interacted
    if (!isSidebarEditMode || !hasUserInteractedRef.current) return;
    
    if (sizes.length >= 3) {
      const newSizes = {
        navigation: Math.round(sizes[0]), 
        content: Math.round(sizes[1]),
        footer: Math.round(sizes[2])
      };
      
      // Check if sizes actually changed significantly (avoid micro-adjustments)
      const currentSizes = settings?.sidebar_panel_sizes || {};
      const hasSignificantChange = 
        Math.abs((currentSizes.navigation || 40) - newSizes.navigation) > 1 ||
        Math.abs((currentSizes.content || 40) - newSizes.content) > 1 ||
        Math.abs((currentSizes.footer || 20) - newSizes.footer) > 1;
      
      if (!hasSignificantChange) return;
      
      // Clear existing timeout
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
      
      // Debounced save with auto-lock
      saveTimeoutRef.current = setTimeout(async () => {
        const success = await updateSidebarPanelSizes(newSizes);
        
        if (success) {
          setIsSidebarEditMode(false);
          hasUserInteractedRef.current = false;
          toast.success('Sidebar layout saved and locked');
        } else {
          toast.error('Failed to save sidebar layout');
        }
      }, 1000);
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
          id="sidebar-main"
          storage={createStorageHandler()}
        >
          {/* Navigation Panel */}
          <Panel 
            id="navigation-panel"
            order={0}
            defaultSize={defaultSizes.navigation} 
            minSize={isSidebarEditMode ? 25 : undefined} 
            maxSize={isSidebarEditMode ? 50 : undefined}
          >
            <div className="px-0 h-full overflow-y-auto">
              <div className="py-2">
                <NavigationMenu />
              </div>
            </div>
          </Panel>

          {/* Vertical Resize Handle - Conditionally rendered */}
          {isSidebarEditMode && (
            <ResizableHandle 
              onMouseDown={handlePanelResizeStart}
              onTouchStart={handlePanelResizeStart}
            />
          )}

          {/* Content Panel - Notes Section */}
          <Panel 
            id="content-panel"
            order={1}
            defaultSize={defaultSizes.content} 
            minSize={isSidebarEditMode ? 20 : undefined} 
            maxSize={isSidebarEditMode ? 60 : undefined}
          >
            <div className="px-0 h-full overflow-y-auto">
              <NotesSection />
            </div>
          </Panel>

          {/* Vertical Resize Handle - Conditionally rendered */}
          {isSidebarEditMode && (
            <ResizableHandle 
              onMouseDown={handlePanelResizeStart}
              onTouchStart={handlePanelResizeStart}
            />
          )}

          {/* Footer Panel */}
          <Panel 
            id="footer-panel"
            order={2}
            defaultSize={defaultSizes.footer} 
            minSize={isSidebarEditMode ? 10 : undefined} 
            maxSize={isSidebarEditMode ? 25 : undefined}
          >
            <div className="h-full flex flex-col">
              <div className="p-2 pt-1 flex-1 border-t border-sidebar-border flex items-center">
                <CustomSidebarFooter />
              </div>
            </div>
          </Panel>
        </PanelGroup>
      </div>
    </TooltipProvider>
  );
}