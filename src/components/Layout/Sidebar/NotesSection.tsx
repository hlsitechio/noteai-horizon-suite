
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSidebar } from '@/components/ui/sidebar';
import { SidebarGroup, SidebarGroupContent } from '@/components/ui/sidebar';
import NotesTree from '../../Sidebar/NotesTree';

const contentVariants = {
  expanded: {
    opacity: 1,
    height: 'auto',
    transition: {
      delay: 0.1,
      duration: 0.3
    }
  },
  collapsed: {
    opacity: 0,
    height: 0,
    transition: {
      duration: 0.2
    }
  }
};

export function NotesSection() {
  const { state } = useSidebar();
  const isCollapsed = state === 'collapsed';

  return (
    <SidebarGroup className="flex-1 min-h-0">
      <SidebarGroupContent className="h-full">
        <AnimatePresence>
          {!isCollapsed ? (
            <motion.div
              variants={contentVariants}
              initial="collapsed"
              animate="expanded"
              exit="collapsed"
              className="h-full overflow-hidden"
            >
              <div className="h-full overflow-y-auto">
                <NotesTree />
              </div>
            </motion.div>
          ) : (
            <div className="px-2 py-1">
              <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                <span className="text-xs font-medium text-primary">N</span>
              </div>
            </div>
          )}
        </AnimatePresence>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
