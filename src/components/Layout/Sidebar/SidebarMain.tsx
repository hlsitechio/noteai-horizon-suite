
import React from 'react';
import { motion } from 'framer-motion';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarSeparator,
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
      <Sidebar collapsible="offcanvas" className="h-full flex flex-col">
        {/* Header */}
        <SidebarHeader className="p-3 pb-2 flex-shrink-0">
          <CustomSidebarHeader />
        </SidebarHeader>

        <SidebarContent className="px-0 flex-1 min-h-0 overflow-y-auto">
          {/* Navigation Menu */}
          <SidebarGroup className="py-2">
            <SidebarGroupContent>
              <NavigationMenu isCollapsed={!isMobile && isCollapsed} />
            </SidebarGroupContent>
          </SidebarGroup>

          {/* First Separator */}
          <SidebarSeparator className="mx-4 my-2" />

          {/* Collapsed Summary - only show when collapsed on desktop */}
          {!isMobile && isCollapsed && <CollapsedSummary />}

          {/* Second Separator - only show when collapsed on desktop */}
          {!isMobile && isCollapsed && <SidebarSeparator className="mx-4 my-2" />}

          {/* Notes Section - This is the main content area */}
          <NotesSection />
        </SidebarContent>

        {/* Footer Separator */}
        <SidebarSeparator className="mx-4 my-1" />

        {/* Footer with Notifications */}
        <SidebarFooter className="p-2 pt-1 z-30 flex-shrink-0">
          <CustomSidebarFooter />
        </SidebarFooter>
      </Sidebar>
    </TooltipProvider>
  );
}
