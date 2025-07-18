import React, { memo, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Bell, Settings, LogOut, User, Moon, Sun } from 'lucide-react';
import { useSidebarCollapse } from '@/contexts/SidebarContext';
import { useAuth } from '@/contexts/AuthContext';
import { useNotifications } from '@/contexts/NotificationsContext';
import { useTheme } from '@/providers/ThemeProvider';
import { useNavigate } from 'react-router-dom';
import { isDarkMode, toggleTheme } from '@/utils/themeUtils';
import { sidebarAnimations, hoverProps } from './animations';
import NotificationsPanel from '../../NotificationsPanel';

const SidebarFooter = memo(() => {
  const { isCollapsed } = useSidebarCollapse();
  const { logout } = useAuth();
  const { unreadCount } = useNotifications();
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();
  const [isNotificationsPanelOpen, setIsNotificationsPanelOpen] = useState(false);

  const isCurrentlyDark = isDarkMode(theme);

  const handleNotificationsClick = useCallback(() => {
    setIsNotificationsPanelOpen(true);
  }, []);

  const handleThemeToggle = useCallback(() => {
    const newTheme = toggleTheme(theme);
    setTheme(newTheme);
  }, [theme, setTheme]);

  const handleSettingsClick = useCallback(() => {
    navigate('/app/settings');
  }, [navigate]);

  const handleProfileClick = useCallback(() => {
    navigate('/app/settings?tab=profile');
  }, [navigate]);

  const footerActions = [
    {
      icon: User,
      label: 'Profile',
      onClick: handleProfileClick,
      variant: 'ghost' as const
    },
    {
      icon: Bell,
      label: 'Notifications',
      onClick: handleNotificationsClick,
      variant: 'ghost' as const,
      badge: unreadCount > 0 ? unreadCount : undefined
    },
    {
      icon: isCurrentlyDark ? Sun : Moon,
      label: isCurrentlyDark ? 'Light Mode' : 'Dark Mode',
      onClick: handleThemeToggle,
      variant: 'ghost' as const
    },
    {
      icon: Settings,
      label: 'Settings',
      onClick: handleSettingsClick,
      variant: 'ghost' as const
    }
  ];

  if (isCollapsed) {
    return (
      <>
        <motion.div
          className="space-y-1"
          variants={sidebarAnimations.list}
        >
          {/* Essential actions in collapsed mode */}
          {footerActions.slice(1, 3).map((action) => {
            const IconComponent = action.icon;
            return (
              <motion.div key={action.label} variants={sidebarAnimations.item}>
                <Tooltip>
                  <TooltipTrigger asChild>
                <motion.div
                  {...hoverProps}
                >
                      <Button
                        variant={action.variant}
                        size="sm"
                        className="h-8 w-8 p-0 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground relative"
                        onClick={action.onClick}
                      >
                        <IconComponent className="w-4 h-4" />
                        {action.badge && (
                          <div className="absolute -top-1 -right-1 h-3 w-3 bg-destructive rounded-full flex items-center justify-center">
                            <span className="text-xs text-destructive-foreground font-medium">
                              {action.badge > 9 ? '9+' : action.badge}
                            </span>
                          </div>
                        )}
                      </Button>
                    </motion.div>
                  </TooltipTrigger>
                  <TooltipContent side="right" sideOffset={8}>
                    <p>{action.label}</p>
                    {action.badge && <p className="text-xs text-muted-foreground">({action.badge})</p>}
                  </TooltipContent>
                </Tooltip>
              </motion.div>
            );
          })}
          
          {/* Sign out button */}
          <motion.div variants={sidebarAnimations.item}>
            <Tooltip>
              <TooltipTrigger asChild>
            <motion.div
              {...hoverProps}
            >
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                    onClick={logout}
                  >
                    <LogOut className="w-4 h-4" />
                  </Button>
                </motion.div>
              </TooltipTrigger>
              <TooltipContent side="right" sideOffset={8}>
                <p>Sign Out</p>
              </TooltipContent>
            </Tooltip>
          </motion.div>
        </motion.div>

        <NotificationsPanel 
          isOpen={isNotificationsPanelOpen} 
          onClose={() => setIsNotificationsPanelOpen(false)} 
        />
      </>
    );
  }

  return (
    <>
      <motion.div
        className="space-y-1"
        variants={sidebarAnimations.list}
      >
        {/* Expanded footer actions */}
        {footerActions.map((action) => {
          const IconComponent = action.icon;
          return (
            <motion.div key={action.label} variants={sidebarAnimations.item}>
            <motion.div
              {...hoverProps}
            >
                <Button
                  variant={action.variant}
                  size="sm"
                  className="w-full h-8 justify-start px-2 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground group"
                  onClick={action.onClick}
                >
                  <IconComponent className="w-4 h-4 mr-2 transition-transform duration-200 group-hover:scale-110" />
                  <span className="text-xs">{action.label}</span>
                  {action.badge && (
                    <Badge 
                      variant="destructive" 
                      className="ml-auto h-4 min-w-4 text-xs"
                    >
                      {action.badge > 99 ? '99+' : action.badge}
                    </Badge>
                  )}
                </Button>
              </motion.div>
            </motion.div>
          );
        })}

        {/* Sign out button */}
        <motion.div variants={sidebarAnimations.item}>
          <motion.div
            {...hoverProps}
          >
            <Button
              variant="ghost"
              size="sm"
              className="w-full h-8 justify-start px-2 text-destructive hover:text-destructive hover:bg-destructive/10 group"
              onClick={logout}
            >
              <LogOut className="w-4 h-4 mr-2 transition-transform duration-200 group-hover:scale-110" />
              <span className="text-xs">Sign Out</span>
            </Button>
          </motion.div>
        </motion.div>
      </motion.div>

      <NotificationsPanel 
        isOpen={isNotificationsPanelOpen} 
        onClose={() => setIsNotificationsPanelOpen(false)} 
      />
    </>
  );
});

SidebarFooter.displayName = 'SidebarFooter';

export { SidebarFooter };