
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

const sidebarVariants = {
  expanded: {
    width: "var(--sidebar-width)",
    transition: {
      type: "spring" as const,
      stiffness: 400,
      damping: 30,
      duration: 0.3
    }
  },
  collapsed: {
    width: "7rem",
    transition: {
      type: "spring" as const,
      stiffness: 400,
      damping: 30,
      duration: 0.3
    }
  }
};

export function SidebarMain() {
  const { state } = useSidebar();
  const isCollapsed = state === 'collapsed';

  return (
    <TooltipProvider>
      <motion.div
        variants={sidebarVariants}
        animate={isCollapsed ? 'collapsed' : 'expanded'}
        className="bg-deep-carbon-900/95 backdrop-blur-md border-r border-deep-carbon-700/50 h-screen overflow-hidden shadow-premium z-40"
      >
        <Sidebar collapsible="icon" className="bg-transparent border-0 h-full flex flex-col">
          {/* Header */}
          <SidebarHeader className="p-3 pb-2 bg-deep-carbon-900/90 flex-shrink-0">
            <CustomSidebarHeader />
          </SidebarHeader>

          <SidebarContent className="px-0 bg-deep-carbon-900/80 flex-1 min-h-0 overflow-y-auto">
            {/* Navigation Menu */}
            <SidebarGroup className="py-2">
              <SidebarGroupContent>
                <NavigationMenu isCollapsed={isCollapsed} />
              </SidebarGroupContent>
            </SidebarGroup>

            {/* First Separator */}
            <SidebarSeparator className="mx-4 my-2 bg-deep-carbon-700/30" />

            {/* Collapsed Summary */}
            <CollapsedSummary />

            {/* Second Separator */}
            <SidebarSeparator className="mx-4 my-2 bg-deep-carbon-700/30" />

            {/* Notes Section - This is the main content area */}
            <NotesSection />
          </SidebarContent>

          {/* Footer Separator */}
          <SidebarSeparator className="mx-4 my-1 bg-deep-carbon-700/30" />

          {/* Footer with Notifications */}
          <SidebarFooter className="p-2 pt-1 z-30 bg-deep-carbon-900/90 flex-shrink-0">
            <CustomSidebarFooter />
          </SidebarFooter>
        </Sidebar>
      </motion.div>
    </TooltipProvider>
  );
}
