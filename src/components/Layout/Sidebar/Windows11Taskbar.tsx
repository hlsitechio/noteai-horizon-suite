import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { useSidebarCollapse } from '@/contexts/SidebarContext';

interface NavigationItem {
  icon: string;
  label: string;
  path: string;
}

const navigationItems: NavigationItem[] = [
  { icon: 'bx bx-grid-alt', label: 'Dashboard', path: '/app/dashboard' },
  { icon: 'bx bx-folder-open', label: 'Explorer', path: '/app/explorer' },
  { icon: 'bx bx-folder', label: 'Projects', path: '/app/projects' },
  { icon: 'bx bx-edit', label: 'Editor', path: '/app/editor' },
  { icon: 'bx bx-message-rounded', label: 'AI Chat', path: '/app/chat' },
  { icon: 'bx bx-calendar', label: 'Calendar', path: '/app/calendar' },
  { icon: 'bx bx-bar-chart', label: 'Analytics', path: '/app/analytics' },
  { icon: 'bx bx-search-alt', label: 'SEO', path: '/app/seo' },
  { icon: 'bx bx-list-ul', label: 'Activity', path: '/app/activity' },
  { icon: 'bx bx-palette', label: 'Themes', path: '/app/themes' },
];

const additionalItems = [
  { icon: 'bx bx-user', label: 'Profile', path: '/app/profile' },
  { icon: 'bx bx-bell', label: 'Notifications', path: '/app/notifications' },
  { icon: 'bx bx-cog', label: 'Settings', path: '/app/settings' },
];

interface Windows11TaskbarProps {
  position: 'top' | 'bottom' | 'right';
  showStartButton?: boolean;
}

export function Windows11Taskbar({ position, showStartButton = true }: Windows11TaskbarProps) {
  const location = useLocation();
  const { isCollapsed, toggleCollapse } = useSidebarCollapse();

  const isActive = (path: string) => location.pathname === path;

  const TaskbarButton = ({ item, isStart = false }: { item: NavigationItem; isStart?: boolean }) => (
    <Tooltip>
      <TooltipTrigger asChild>
        <Link to={item.path}>
          <motion.div
            className={`
              relative flex items-center justify-center 
              ${position === 'bottom' ? 'w-12 h-12' : position === 'top' ? 'w-10 h-10' : 'w-14 h-14'}
              rounded-lg transition-all duration-200
              ${isActive(item.path) 
                ? 'bg-primary/20 text-primary shadow-lg' 
                : 'hover:bg-white/10 text-muted-foreground hover:text-foreground'
              }
              ${isStart ? 'bg-gradient-to-br from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700' : ''}
            `}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <i className={`${item.icon} text-lg`} />
            {isActive(item.path) && (
              <motion.div
                className={`absolute ${
                  position === 'bottom' ? 'bottom-0 left-1/2 transform -translate-x-1/2 w-6 h-1' :
                  position === 'top' ? 'top-0 left-1/2 transform -translate-x-1/2 w-6 h-1' :
                  'left-0 top-1/2 transform -translate-y-1/2 w-1 h-6'
                } bg-primary rounded-full`}
                layoutId={`indicator-${position}`}
              />
            )}
          </motion.div>
        </Link>
      </TooltipTrigger>
      <TooltipContent side={position === 'bottom' ? 'top' : position === 'top' ? 'bottom' : 'left'}>
        {item.label}
      </TooltipContent>
    </Tooltip>
  );

  const StartButton = () => (
    <Tooltip>
      <TooltipTrigger asChild>
        <motion.button
          onClick={toggleCollapse}
          className={`
            relative flex items-center justify-center 
            ${position === 'bottom' ? 'w-12 h-12' : position === 'top' ? 'w-10 h-10' : 'w-14 h-14'}
            rounded-lg transition-all duration-200
            bg-gradient-to-br from-blue-500 to-purple-600 text-white 
            hover:from-blue-600 hover:to-purple-700 shadow-lg
          `}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <i className="bx bx-windows text-lg" />
        </motion.button>
      </TooltipTrigger>
      <TooltipContent side={position === 'bottom' ? 'top' : position === 'top' ? 'bottom' : 'left'}>
        Start
      </TooltipContent>
    </Tooltip>
  );

  if (position === 'top') {
    return (
      <div className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="flex items-center justify-center gap-2 px-4 py-2">
          {showStartButton && <StartButton />}
          <div className="flex items-center gap-2">
            {navigationItems.map((item) => (
              <TaskbarButton key={item.path} item={item} />
            ))}
          </div>
          <div className="flex items-center gap-2 ml-4">
            {additionalItems.map((item) => (
              <TaskbarButton key={item.path} item={item} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (position === 'bottom') {
    return (
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-lg border-t border-border">
        <div className="flex items-center justify-center gap-3 px-6 py-3">
          {showStartButton && <StartButton />}
          <div className="flex items-center gap-3">
            {navigationItems.map((item) => (
              <TaskbarButton key={item.path} item={item} />
            ))}
          </div>
          <div className="flex items-center gap-3 ml-6">
            {additionalItems.map((item) => (
              <TaskbarButton key={item.path} item={item} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Right sidebar
  return (
    <div className="fixed right-0 top-0 bottom-0 z-40 w-20 bg-background/90 backdrop-blur-lg border-l border-border">
      <div className="flex flex-col items-center gap-3 py-6">
        {showStartButton && <StartButton />}
        <div className="flex flex-col items-center gap-3">
          {navigationItems.map((item) => (
            <TaskbarButton key={item.path} item={item} />
          ))}
        </div>
        <div className="flex flex-col items-center gap-3 mt-6">
          {additionalItems.map((item) => (
            <TaskbarButton key={item.path} item={item} />
          ))}
        </div>
      </div>
    </div>
  );
}