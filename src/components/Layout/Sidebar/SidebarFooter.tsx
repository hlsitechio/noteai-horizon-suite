
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import NotificationsPanel from '../NotificationsPanel';
import { SidebarMenuButton } from './SidebarMenuButton';
import { SidebarSignOutButton } from './SidebarActions';
import { useIsMobile } from '@/hooks/use-mobile';

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
  const [isNotificationsPanelOpen, setIsNotificationsPanelOpen] = useState(false);
  const isMobile = useIsMobile();

  const handleNotificationsClick = () => {
    setIsNotificationsPanelOpen(true);
  };

  return (
    <>
      <div className="px-2 relative z-20">
        <AnimatePresence>
          <motion.div
            variants={contentVariants}
            initial="collapsed"
            animate="expanded"
            exit="collapsed"
            className="space-y-3"
          >
            <div className="space-y-2">
              <SidebarMenuButton 
                onNotificationsClick={handleNotificationsClick}
                isMobile={isMobile}
              />
              <SidebarSignOutButton isMobile={isMobile} />
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
      
      <NotificationsPanel 
        isOpen={isNotificationsPanelOpen} 
        onClose={() => setIsNotificationsPanelOpen(false)} 
      />
    </>
  );
}
