
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { LogOut, Bell, Moon, Sun, Settings, MoreVertical } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useSidebar } from '@/components/ui/sidebar';
import { useAuth } from '../../../contexts/AuthContext';
import { useNotifications } from '../../../contexts/NotificationsContext';
import NotificationsPanel from '../NotificationsPanel';
import { SidebarProfile } from './SidebarProfile';
import { SidebarActions, SidebarSignOutButton } from './SidebarActions';

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
  const { user, logout } = useAuth();
  const { unreadCount } = useNotifications();
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
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-full justify-start h-9 rounded-lg hover:bg-accent/10 transition-colors relative"
                      >
                        <MoreVertical className="w-4 h-4 mr-2" />
                        Menu
                        {unreadCount > 0 && (
                          <motion.div
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ duration: 1, repeat: Infinity, repeatType: "reverse" as const }}
                            className="ml-auto"
                          >
                            <Badge className="h-4 min-w-4 p-0 bg-red-500 border-0 text-xs">
                              {unreadCount > 99 ? '99+' : unreadCount}
                            </Badge>
                          </motion.div>
                        )}
                      </Button>
                    </motion.div>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent side="top" align="start" className="w-56">
                    <SidebarProfile />
                    <DropdownMenuSeparator />
                    <SidebarActions onNotificationsClick={handleNotificationsClick} />
                  </DropdownMenuContent>
                </DropdownMenu>

                <SidebarSignOutButton />
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="flex flex-col items-center space-y-4"
            >
              <Tooltip>
                <TooltipTrigger asChild>
                  <motion.div whileHover={{ scale: 1.05 }}>
                    <Avatar className="w-12 h-12 ring-2 ring-primary/20 cursor-pointer">
                      <AvatarImage src={user?.avatar} />
                      <AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary/10">
                        {user?.name?.[0]}
                      </AvatarFallback>
                    </Avatar>
                  </motion.div>
                </TooltipTrigger>
                <TooltipContent side="right">
                  <p>{user?.name}</p>
                  <p className="text-xs text-muted-foreground">{user?.email}</p>
                </TooltipContent>
              </Tooltip>
              
              <div className="flex flex-col items-center space-y-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="w-11 h-11 rounded-xl hover:bg-accent/10 relative"
                        >
                          <MoreVertical className="w-5 h-5" />
                          {unreadCount > 0 && (
                            <motion.div
                              animate={{ scale: [1, 1.2, 1] }}
                              transition={{ duration: 1, repeat: Infinity, repeatType: "reverse" as const }}
                              className="absolute -top-1 -right-1"
                            >
                              <Badge className="h-4 min-w-4 p-0 bg-red-500 border-0 text-xs">
                                {unreadCount > 99 ? '99+' : unreadCount}
                              </Badge>
                            </motion.div>
                          )}
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent side="right">
                        <p>Menu</p>
                      </TooltipContent>
                    </Tooltip>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent side="right" align="start" className="w-56">
                    <SidebarProfile />
                    <DropdownMenuSeparator />
                    <SidebarActions onNotificationsClick={handleNotificationsClick} />
                  </DropdownMenuContent>
                </DropdownMenu>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="w-11 h-11 rounded-xl hover:bg-destructive/10 hover:text-destructive transition-colors"
                      onClick={logout}
                    >
                      <LogOut className="w-5 h-5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="right">
                    <p>Sign Out</p>
                  </TooltipContent>
                </Tooltip>
              </div>
            </motion.div>
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
