import React from 'react';
import { motion } from 'framer-motion';
import {
  useSidebar,
} from '@/components/ui/sidebar';
import {
  TooltipProvider,
} from '@/components/ui/tooltip';
import { SidebarHeader as CustomSidebarHeader } from './SidebarHeader';
import NavigationMenu from './NavigationMenu';
import { CollapsedSummary } from './CollapsedSummary';
import { SidebarFooter as CustomSidebarFooter } from './SidebarFooter';
import { NotesSection } from './NotesSection';

export function SidebarMain() {
  const { state, isMobile } = useSidebar();
  const isCollapsed = state === 'collapsed';

  return (
    <TooltipProvider>
      <div className="h-full flex flex-col bg-sidebar">
        {/* Header */}
        <div className="p-3 pb-2 flex-shrink-0">
          <CustomSidebarHeader />
        </div>

        <div className="px-0 flex-1 min-h-0 overflow-y-auto">
          {/* Navigation Menu */}
          <div className="py-2">
            <div>
              <NavigationMenu isCollapsed={!isMobile && isCollapsed} />
            </div>
          </div>

          {/* Collapsed Summary - only show when collapsed on desktop */}
          {!isMobile && isCollapsed && <CollapsedSummary />}

          {/* Notes Section - This is the main content area */}
          <NotesSection />
        </div>

        {/* Footer with Notifications */}
        <div className="p-2 pt-1 z-30 flex-shrink-0 border-t border-sidebar-border">
          <CustomSidebarFooter />
        </div>
      </div>
    </TooltipProvider>
  );
}