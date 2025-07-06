import React from 'react';
import { motion } from 'framer-motion';
import {
  useSidebar,
} from '@/components/ui/sidebar';
import {
  TooltipProvider,
} from '@/components/ui/tooltip';
import { PanelGroup, Panel } from 'react-resizable-panels';
import { ResizableHandle } from '@/components/ui/resizable';
import { SidebarHeader as CustomSidebarHeader } from './SidebarHeader';
import NavigationMenu from './NavigationMenu';
import { CollapsedSummary } from './CollapsedSummary';
import { SidebarFooter as CustomSidebarFooter } from './SidebarFooter';
import { NotesSection } from './NotesSection';
import { useEditMode } from '@/contexts/EditModeContext';
import { useDashboardSettings } from '@/hooks/useDashboardSettings';

export function SidebarMain() {
  const { state, isMobile } = useSidebar();
  const { isSidebarEditMode } = useEditMode();
  const { settings, updateSidebarPanelSizes } = useDashboardSettings();
  const isCollapsed = state === 'collapsed';

  // Get saved panel sizes or use defaults
  const savedSizes = settings?.sidebar_panel_sizes || {};
  const headerSize = savedSizes.header || 15;
  const navigationSize = savedSizes.navigation || 35;
  const contentSize = savedSizes.content || 35;
  const footerSize = savedSizes.footer || 15;

  const handleLayoutChange = (sizes: number[]) => {
    if (sizes.length >= 4) {
      const newSizes = {
        header: sizes[0],
        navigation: sizes[1], 
        content: sizes[2],
        footer: sizes[3]
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
          {/* Header Panel - Fixed */}
          <Panel defaultSize={headerSize} minSize={10} maxSize={25}>
            <div className="p-3 pb-2 h-full flex items-center">
              <CustomSidebarHeader />
            </div>
          </Panel>

          {/* Vertical Resize Handle */}
          <ResizableHandle className={isSidebarEditMode ? 'opacity-100' : 'opacity-30 hover:opacity-100'} />

          {/* Navigation Panel */}
          <Panel defaultSize={navigationSize} minSize={25} maxSize={50}>
            <div className="px-0 h-full overflow-y-auto">
              <div className="py-2">
                <NavigationMenu isCollapsed={!isMobile && isCollapsed} />
              </div>
              
              {/* Collapsed Summary - only show when collapsed on desktop */}
              {!isMobile && isCollapsed && <CollapsedSummary />}
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