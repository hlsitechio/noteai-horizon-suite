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

export function SidebarMain() {
  const { state, isMobile } = useSidebar();
  const { isSidebarEditMode } = useEditMode();
  const isCollapsed = state === 'collapsed';

  return (
    <TooltipProvider>
      <div className="h-full bg-sidebar">
        <PanelGroup direction="vertical" className="h-full">
          {/* Navigation Panel - Includes Header + Menu */}
          <Panel defaultSize={50} minSize={35} maxSize={65}>
            <div className="h-full flex flex-col">
              {/* Header */}
              <div className="p-3 pb-2 flex-shrink-0">
                <CustomSidebarHeader />
              </div>
              
              {/* Navigation Menu */}
              <div className="px-0 flex-1 overflow-y-auto">
                <div className="py-2">
                  <NavigationMenu isCollapsed={!isMobile && isCollapsed} />
                </div>
                
                {/* Collapsed Summary - only show when collapsed on desktop */}
                {!isMobile && isCollapsed && <CollapsedSummary />}
              </div>
            </div>
          </Panel>

          {/* Vertical Resize Handle */}
          <ResizableHandle className={isSidebarEditMode ? 'opacity-100' : 'opacity-30 hover:opacity-100'} />

          {/* Content Panel - Notes Section */}
          <Panel defaultSize={35} minSize={20} maxSize={50}>
            <div className="px-0 h-full overflow-y-auto">
              <NotesSection />
            </div>
          </Panel>

          {/* Vertical Resize Handle */}
          <ResizableHandle className={isSidebarEditMode ? 'opacity-100' : 'opacity-30 hover:opacity-100'} />

          {/* Footer Panel */}
          <Panel defaultSize={15} minSize={10} maxSize={25}>
            <div className="p-2 pt-1 h-full border-t border-sidebar-border flex items-center">
              <CustomSidebarFooter />
            </div>
          </Panel>
        </PanelGroup>
      </div>
    </TooltipProvider>
  );
}