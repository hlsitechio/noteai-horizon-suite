
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSidebar } from '@/components/ui/sidebar';
import NotificationsPanel from '../NotificationsPanel';
import { SidebarMenuButton } from './SidebarMenuButton';
import { SidebarSignOutButton } from './SidebarActions';
import { SidebarCollapsedActions } from './SidebarCollapsedActions';

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

export function SidebarFooter() {
  const { state } = useSidebar();
  const [isNotificationsPanelOpen, setIsNotificationsPanelOpen] = useState(false);
  const isCollapsed = state === 'collapsed';

  const handleNotificationsClick = () => {
    setIsNotificationsPanelOpen(true);
  };

  return (
    <>
      <div className={`${isCollapsed ? 'px-2' : 'px-2'} relative z-20`}>
        <AnimatePresence>
          {!isCollapsed ? (
            <motion.div
              variants={contentVariants}
              initial="collapsed"
              animate="expanded"
              exit="collapsed"
              className="space-y-3"
            >
              <div className="space-y-2">
                <SidebarMenuButton isCollapsed={false} onNotificationsClick={handleNotificationsClick} />
                <SidebarSignOutButton />
              </div>
            </motion.div>
          ) : (
            <SidebarCollapsedActions onNotificationsClick={handleNotificationsClick} />
          )}
        </AnimatePresence>
      </div>
      
      <NotificationsPanel 
        isOpen={isNotificationsPanelOpen} 
        onClose={() => setIsNotificationsPanelOpen(false)} 
      />
    </>
  );
}
