
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Moon, Sun, User, Settings, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useTheme } from '@/providers/ThemeProvider';
import { useAuth } from '../../contexts/AuthContext';
import { useNotifications } from '../../contexts/NotificationsContext';
import { toggleTheme, isDarkMode } from '@/utils/themeUtils';
import NotificationsPanel from './NotificationsPanel';

const badgeVariants = {
  animate: {
    scale: [1, 1.05, 1],
    transition: {
      duration: 2,
      repeat: Infinity,
      repeatType: "reverse" as const
    }
  }
};

const iconVariants = {
  hover: {
    scale: 1.1,
    rotate: 360,
    transition: {
      duration: 0.3
    }
  }
};

const Header: React.FC = () => {
  const { theme, setTheme } = useTheme();
  const { user, logout } = useAuth();
  const { unreadCount } = useNotifications();
  const navigate = useNavigate();
  const [isNotificationsPanelOpen, setIsNotificationsPanelOpen] = useState(false);

  const handleThemeToggle = () => {
    const newTheme = toggleTheme(theme);
    setTheme(newTheme);
  };

  const handleNotificationClick = () => {
    setIsNotificationsPanelOpen(true);
  };

  const handleProfileClick = () => {
    navigate('/settings');
  };

  const handleLogout = () => {
    logout();
  };

  const isCurrentlyDark = isDarkMode(theme);

  return (
    <>
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="fixed top-0 right-0 left-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border/50 md:left-[var(--sidebar-width)]"
      >
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <motion.div variants={badgeVariants} animate="animate">
                
              </motion.div>
              <motion.div variants={badgeVariants} animate="animate" transition={{ delay: 0.5 }}>
                
              </motion.div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Only Profile Dropdown remains */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full glass shadow-medium hover:bg-white/20 dark:hover:bg-slate-700/30">
                    <Avatar className="h-9 w-9">
                      <AvatarImage src={user?.avatar} alt={user?.name} />
                      <AvatarFallback>{user?.name?.[0]}</AvatarFallback>
                    </Avatar>
                  </Button>
                </motion.div>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 glass border-0 shadow-large dark:text-slate-200" align="end">
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center justify-start gap-2 p-2"
                >
                  <div className="flex flex-col space-y-1 leading-none">
                    <p className="font-medium">{user?.name}</p>
                    <p className="w-[200px] truncate text-sm text-muted-foreground">
                      {user?.email}
                    </p>
                  </div>
                </motion.div>
                <DropdownMenuSeparator />
                
                {/* Notifications */}
                <motion.div whileHover={{ x: 4 }} transition={{ duration: 0.2 }}>
                  <DropdownMenuItem 
                    className="hover:bg-white/20 dark:hover:bg-slate-700/30 cursor-pointer" 
                    onClick={handleNotificationClick}
                  >
                    <Bell className="mr-2 h-4 w-4" />
                    <span>Notifications</span>
                    {unreadCount > 0 && (
                      <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 1, repeat: Infinity, repeatType: "reverse" as const }}
                        className="ml-auto"
                      >
                        <Badge className="h-5 min-w-5 p-0 bg-red-500 border-0 text-xs">
                          {unreadCount > 99 ? '99+' : unreadCount}
                        </Badge>
                      </motion.div>
                    )}
                  </DropdownMenuItem>
                </motion.div>

                {/* Theme Toggle */}
                <motion.div whileHover={{ x: 4 }} transition={{ duration: 0.2 }}>
                  <DropdownMenuItem 
                    className="hover:bg-white/20 dark:hover:bg-slate-700/30 cursor-pointer" 
                    onClick={handleThemeToggle}
                  >
                    {isCurrentlyDark ? (
                      <>
                        <Sun className="mr-2 h-4 w-4" />
                        <span>Light Mode</span>
                      </>
                    ) : (
                      <>
                        <Moon className="mr-2 h-4 w-4" />
                        <span>Dark Mode</span>
                      </>
                    )}
                  </DropdownMenuItem>
                </motion.div>

                {/* Profile/Settings */}
                <motion.div whileHover={{ x: 4 }} transition={{ duration: 0.2 }}>
                  <DropdownMenuItem className="hover:bg-white/20 dark:hover:bg-slate-700/30 cursor-pointer" onClick={handleProfileClick}>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </DropdownMenuItem>
                </motion.div>

                <DropdownMenuSeparator />

                {/* Logout */}
                <motion.div whileHover={{ x: 4 }} transition={{ duration: 0.2 }}>
                  <DropdownMenuItem className="hover:bg-white/20 dark:hover:bg-slate-700/30 cursor-pointer" onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Sign Out</span>
                  </DropdownMenuItem>
                </motion.div>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </motion.header>

      <NotificationsPanel isOpen={isNotificationsPanelOpen} onClose={() => setIsNotificationsPanelOpen(false)} />
    </>
  );
};

export default Header;
