import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TooltipProvider } from '@/components/ui/tooltip';
import { useSidebarCollapse } from '@/contexts/SidebarContext';
import { useIsMobile } from '@/hooks/use-mobile';
import { Separator } from '@/components/ui/separator';
import NavigationMenu from './NavigationMenu';
import { useDashboardStatus } from '@/components/Dashboard/hooks/useDashboardStatus';

import { SidebarQuickActions } from './SidebarQuickActions';
import { SidebarFooter } from './SidebarFooter';
import { useSidebarKeyboardShortcuts } from './SidebarKeyboardShortcuts';
const sidebarVariants = {
  initial: {
    width: 'auto',
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1
    }
  },
  expanded: {
    width: 'auto',
    transition: {
      duration: 0.3,
      ease: [0.4, 0, 0.2, 1] as const,
      staggerChildren: 0.1
    }
  },
  collapsed: {
    width: 'auto',
    transition: {
      duration: 0.3,
      ease: [0.4, 0, 0.2, 1] as const,
      staggerChildren: 0.05,
      staggerDirection: -1
    }
  }
};
const sectionVariants = {
  initial: {
    opacity: 0,
    x: -100,
    transition: {
      duration: 0.4,
      ease: [0.4, 0, 0.2, 1] as const
    }
  },
  expanded: {
    opacity: 1,
    x: 0,
    y: 0,
    transition: {
      duration: 0.4,
      ease: [0.4, 0, 0.2, 1] as const
    }
  },
  collapsed: {
    opacity: 0.8,
    x: 0,
    y: -5,
    transition: {
      duration: 0.2,
      ease: [0.4, 0, 0.6, 1] as const
    }
  }
};
export function SidebarUnified() {
  const {
    isCollapsed
  } = useSidebarCollapse();
  const isMobile = useIsMobile();
  const { isDashboardInitialized, isLoading } = useDashboardStatus();
  const [isInitialLoad, setIsInitialLoad] = React.useState(true);

  // Set initial load to false after dashboard is initialized to trigger animations
  React.useEffect(() => {
    if (!isLoading && isDashboardInitialized) {
      const timer = setTimeout(() => {
        setIsInitialLoad(false);
      }, 300); // Slightly longer delay to sync with dashboard animation
      return () => clearTimeout(timer);
    }
  }, [isLoading, isDashboardInitialized]);

  // Enable keyboard shortcuts
  useSidebarKeyboardShortcuts();
  return <TooltipProvider delayDuration={200} skipDelayDuration={100}>
      <motion.div className="h-full bg-sidebar flex flex-col w-48" variants={sidebarVariants} initial="initial" animate={isInitialLoad ? "initial" : (isCollapsed ? "collapsed" : "expanded")} data-onboarding="sidebar">
        {/* Navigation Section */}
        <motion.div className="flex-shrink-0 px-1 py-1" variants={sectionVariants}>
          <NavigationMenu />
        </motion.div>

        <AnimatePresence>
          {!isCollapsed && <motion.div initial={{
          opacity: 0,
          height: 0
        }} animate={{
          opacity: 1,
          height: 'auto'
        }} exit={{
          opacity: 0,
          height: 0
        }} transition={{
          duration: 0.2
        }}>
              <Separator className="mx-2" />
            </motion.div>}
        </AnimatePresence>

        {/* Spacer to push footer to bottom */}
        <div className="flex-1"></div>

        {/* Footer Section */}
        <motion.div className="flex-shrink-0 px-1 py-1 border-t border-sidebar-border mt-auto" variants={sectionVariants}>
          <SidebarFooter />
        </motion.div>
      </motion.div>
    </TooltipProvider>;
}