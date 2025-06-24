
import React from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
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
import { SidebarHeader as CustomSidebarHeader } from './Sidebar/SidebarHeader';
import { NavigationMenu } from './Sidebar/NavigationMenu';
import { CollapsedSummary } from './Sidebar/CollapsedSummary';
import { SidebarFooter as CustomSidebarFooter } from './Sidebar/SidebarFooter';
import NotesTree from '../Sidebar/NotesTree';

const sidebarVariants: Variants = {
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

const contentVariants: Variants = {
  expanded: {
    opacity: 1,
    x: 0,
    transition: {
      delay: 0.1,
      duration: 0.2
    }
  },
  collapsed: {
    opacity: 0,
    x: -20,
    transition: {
      duration: 0.15
    }
  }
};

export function AppSidebar() {
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
          <SidebarHeader className="p-3 pb-2 bg-deep-carbon-900/90 flex-shrink-0">
            <CustomSidebarHeader />
          </SidebarHeader>

          <SidebarContent className="px-0 bg-deep-carbon-900/80 flex-1 min-h-0 overflow-y-auto">
            <SidebarGroup className="py-2">
              <SidebarGroupContent>
                <NavigationMenu />
              </SidebarGroupContent>
            </SidebarGroup>

            <SidebarSeparator className="mx-4 my-2 bg-deep-carbon-700/30" />

            <CollapsedSummary />

            {/* Notes Tree Section */}
            <AnimatePresence>
              {!isCollapsed && (
                <motion.div
                  variants={contentVariants}
                  initial="collapsed"
                  animate="expanded"
                  exit="collapsed"
                  className="flex-1 min-h-0"
                >
                  <SidebarGroup className="group-data-[collapsible=icon]:hidden px-2 flex-1 min-h-0">
                    <NotesTree />
                  </SidebarGroup>
                </motion.div>
              )}
            </AnimatePresence>
          </SidebarContent>

          <SidebarSeparator className="mx-4 my-1 bg-deep-carbon-700/30" />

          <SidebarFooter className="p-3 pt-2 z-30 bg-deep-carbon-900/90 flex-shrink-0">
            <CustomSidebarFooter />
          </SidebarFooter>
        </Sidebar>
      </motion.div>
    </TooltipProvider>
  );
}
