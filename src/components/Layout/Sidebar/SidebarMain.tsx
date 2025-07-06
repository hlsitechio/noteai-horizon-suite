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
  const { settings, updateSidebarPanelSizes, isLoading } = useDashboardSettings();
  const saveTimeoutRef = useRef<NodeJS.Timeout>();
  const hasUserInteractedRef = useRef(false);
  const [isMounted, setIsMounted] = useState(false);

  // Fix hydration mismatch - only enable storage after mount
  useEffect(() => {
    setIsMounted(true);
  }, []);
  const createStorageHandler = () => {
    if (!isMounted) {
      // Prevent hydration mismatch
      return {
        getItem: () => "",
        setItem: () => {}
      };
    }
    
    if (isSidebarEditMode) {
      // In edit mode: allow full storage functionality
      return undefined; // Use default localStorage
    } else {
      // Not in edit mode: read-only storage (restore saved sizes but don't save new ones)
      return {
        getItem: (name: string) => {
          try {
            return localStorage.getItem(name) || "";
          } catch {
            return "";
          }
        },
        setItem: () => {} // Prevent writes when not in edit mode
      };
    }
  };

  // State for default panel sizes - updates when saved
  const [defaultSizes, setDefaultSizes] = useState(() => {
    const savedSizes = settings?.sidebar_panel_sizes || {};
    return {
      navigation: savedSizes.navigation || 40,
      content: savedSizes.content || 40,
      footer: savedSizes.footer || 20
    };
  });

  // Update default sizes when settings change
  useEffect(() => {
    console.log('Settings changed:', settings?.sidebar_panel_sizes);
    if (settings?.sidebar_panel_sizes && isMounted) {
      const newDefaultSizes = {
        navigation: settings.sidebar_panel_sizes.navigation || 40,
        content: settings.sidebar_panel_sizes.content || 40,
        footer: settings.sidebar_panel_sizes.footer || 20
      };
      console.log('Updating default sizes:', newDefaultSizes);
      setDefaultSizes(newDefaultSizes);
      
      // Clear localStorage to force panels to use new default sizes
      if (!isSidebarEditMode) {
        try {
          localStorage.removeItem('react-resizable-panels:sidebar-main');
          console.log('Cleared localStorage to use new default sizes');
        } catch (error) {
          console.warn('Failed to clear localStorage:', error);
        }
      }
    }
  }, [settings?.sidebar_panel_sizes, isMounted, isSidebarEditMode]);

  // Debug current state
  useEffect(() => {
    console.log('Current state:', { 
      defaultSizes, 
      isSidebarEditMode, 
      settingsSizes: settings?.sidebar_panel_sizes,
      isMounted 
    });
  }, [defaultSizes, isSidebarEditMode, settings?.sidebar_panel_sizes, isMounted]);

  // Track when user actually interacts with panels
  const handlePanelResizeStart = () => {
    hasUserInteractedRef.current = true;
  };

  const handleLayoutChange = (sizes: number[]) => {
    console.log('Layout change detected:', { sizes, editMode: isSidebarEditMode, defaultSizes });
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