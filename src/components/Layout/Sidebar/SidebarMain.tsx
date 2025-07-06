import React from 'react';
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

export function SidebarMain() {
  const isMobile = useIsMobile();
  const { isSidebarEditMode } = useEditMode();
  const { settings, updateSidebarPanelSizes } = useDashboardSettings();

  // Get saved panel sizes or use defaults
  const savedSizes = settings?.sidebar_panel_sizes || {};
  const navigationSize = savedSizes.navigation || 40;
  const contentSize = savedSizes.content || 40;
  const footerSize = savedSizes.footer || 20;

  const handleLayoutChange = (sizes: number[]) => {
    if (sizes.length >= 3) {
      const newSizes = {
        navigation: sizes[0], 
        content: sizes[1],
        footer: sizes[2]
      };
      updateSidebarPanelSizes(newSizes);
    }
  };

  return (
    <TooltipProvider>
      <div className="h-full bg-sidebar">
        <PanelGroup 
          direction="vertical" 
          className="h-full"
          onLayout={handleLayoutChange}
        >
          {/* Navigation Panel */}
          <Panel defaultSize={navigationSize} minSize={25} maxSize={50}>
            <div className="px-0 h-full overflow-y-auto">
              <div className="py-2">
                <NavigationMenu />
              </div>
            </div>
          </Panel>

          {/* Vertical Resize Handle */}
          <ResizableHandle className={isSidebarEditMode ? 'opacity-100' : 'opacity-30 hover:opacity-100'} />

          {/* Content Panel - Notes Section */}
          <Panel defaultSize={contentSize} minSize={20} maxSize={60}>
            <div className="px-0 h-full overflow-y-auto">
              <NotesSection />
            </div>
          </Panel>

          {/* Vertical Resize Handle */}
          <ResizableHandle className={isSidebarEditMode ? 'opacity-100' : 'opacity-30 hover:opacity-100'} />

          {/* Footer Panel */}
          <Panel defaultSize={footerSize} minSize={10} maxSize={25}>
            <div className="p-2 pt-1 h-full border-t border-sidebar-border flex items-center">
              <CustomSidebarFooter />
            </div>
          </Panel>
        </PanelGroup>
      </div>
    </TooltipProvider>
  );
}