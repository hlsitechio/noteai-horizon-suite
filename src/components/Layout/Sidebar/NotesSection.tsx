
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSidebar } from '@/components/ui/sidebar';
import { SidebarGroup } from '@/components/ui/sidebar';
import NotesTree from '../../Sidebar/NotesTree';

const contentVariants = {
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

export function NotesSection() {
  const { state } = useSidebar();
  const isCollapsed = state === 'collapsed';

  return (
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
  );
}
