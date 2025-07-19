import React, { memo, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Plus, Search, Bookmark, Archive } from 'lucide-react';
import { useSidebarCollapse } from '@/contexts/SidebarContext';
import { useIsMobile } from '@/hooks/use-mobile';
import { sidebarAnimations, hoverProps } from './animations';
import { navigationItems } from './navigationData';

interface NavigationItemProps {
  item: (typeof navigationItems)[number];
  isActive: boolean;
  isCollapsed: boolean;
  isMobile: boolean;
}

interface QuickAction {
  icon: React.ElementType;
  label: string;
  description: string;
  action: () => void;
  variant: 'default' | 'success' | 'info' | 'warning' | 'secondary';
}

const NavigationItem = memo(({ item, isActive, isCollapsed, isMobile }: NavigationItemProps) => {
  const buttonContent = (
    <motion.div
      {...hoverProps}
    >
      <Button
        variant={isActive ? "default" : "ghost"}
        className={`w-full h-8 transition-all duration-200 group ${
          isCollapsed ? 'justify-center px-0' : 'justify-start px-2'
        } ${
          isActive 
            ? 'bg-primary text-primary-foreground shadow-sm' 
            : 'hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
        }`}
      >
        <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'justify-start gap-2'}`}>
          <i className={`${item.icon} text-sm transition-transform duration-200 ${
            isActive ? 'text-primary-foreground' : 'group-hover:scale-110'
          }`} />
          {!isCollapsed && (
            <span className="text-xs font-medium truncate">
              {item.label}
            </span>
          )}
          {isActive && !isCollapsed && (
            <div className="ml-auto w-1 h-4 bg-primary-foreground/80 rounded-full" />
          )}
        </div>
      </Button>
    </motion.div>
  );

  if (isCollapsed || isMobile) {
    return (
      <motion.div variants={sidebarAnimations.item}>
        <Tooltip delayDuration={200}>
          <TooltipTrigger asChild>
            <Link to={item.path} className="block">
              {buttonContent}
            </Link>
          </TooltipTrigger>
          <TooltipContent side="right" sideOffset={12}>
            <p className="font-medium">{item.label}</p>
            {item.description && (
              <p className="text-xs text-muted-foreground mt-1">{item.description}</p>
            )}
          </TooltipContent>
        </Tooltip>
      </motion.div>
    );
  }

  return (
    <motion.div variants={sidebarAnimations.item}>
      <Link to={item.path} className="block">
        {buttonContent}
      </Link>
    </motion.div>
  );
});

NavigationItem.displayName = 'NavigationItem';

const SidebarNavigation = memo(() => {
  const location = useLocation();
  const { isCollapsed } = useSidebarCollapse();
  const isMobile = useIsMobile();
  const navigate = useNavigate();

  // Group navigation items by category
  const mainItems = navigationItems.filter(item => item.category === 'main' || !item.category);

  const quickActions: QuickAction[] = [
    {
      icon: Plus,
      label: 'New Note',
      description: 'Create a new note',
      action: useCallback(() => navigate('/app/editor'), [navigate]),
      variant: 'success'
    },
    {
      icon: Search,
      label: 'Search',
      description: 'Find content',
      action: useCallback(() => navigate('/app/explorer'), [navigate]),
      variant: 'info'
    },
    {
      icon: Bookmark,
      label: 'Favorites',
      description: 'View favorites',
      action: useCallback(() => navigate('/app/explorer?filter=favorites'), [navigate]),
      variant: 'warning'
    },
    {
      icon: Archive,
      label: 'Activity',
      description: 'View recent activity',
      action: useCallback(() => navigate('/app/activity'), [navigate]),
      variant: 'secondary'
    }
  ];

  const getIconColorClass = (variant: QuickAction['variant']) => {
    switch (variant) {
      case 'success': return 'text-green-500';
      case 'info': return 'text-blue-500';
      case 'warning': return 'text-yellow-500';
      case 'secondary': return 'text-gray-500';
      default: return 'text-sidebar-foreground';
    }
  };

  const renderSection = (items: (typeof navigationItems)[number][], title?: string) => (
    <div className="space-y-1">
      {title && !isCollapsed && (
        <div className="px-2 py-1">
          <span className="text-xs font-medium text-muted-foreground/70 uppercase tracking-wider">
            {title}
          </span>
        </div>
      )}
      <motion.div 
        className="space-y-0.5"
        variants={sidebarAnimations.list}
      >
        {items.map((item) => (
          <NavigationItem
            key={item.path}
            item={item}
            isActive={location.pathname === item.path}
            isCollapsed={isCollapsed}
            isMobile={isMobile}
          />
        ))}
      </motion.div>
    </div>
  );

  const renderQuickActions = () => {
    if (isCollapsed) {
      return (
        <motion.div
          className="space-y-1"
          variants={sidebarAnimations.list}
        >
          {quickActions.slice(0, 3).map((action) => {
            const IconComponent = action.icon;
            return (
              <motion.div key={action.label} variants={sidebarAnimations.item}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <motion.div
                      {...hoverProps}
                    >
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                        onClick={action.action}
                      >
                        <IconComponent className={`w-4 h-4 ${getIconColorClass(action.variant)}`} />
                      </Button>
                    </motion.div>
                  </TooltipTrigger>
                  <TooltipContent side="right" sideOffset={8}>
                    <div>
                      <p className="font-medium">{action.label}</p>
                      <p className="text-xs text-muted-foreground">{action.description}</p>
                    </div>
                  </TooltipContent>
                </Tooltip>
              </motion.div>
            );
          })}
        </motion.div>
      );
    }

    return (
      <motion.div
        className="space-y-1"
        variants={sidebarAnimations.list}
      >
        {quickActions.map((action) => {
          const IconComponent = action.icon;
          return (
            <motion.div key={action.label} variants={sidebarAnimations.item}>
              <motion.div
                {...hoverProps}
              >
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full h-8 justify-start px-2 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground group"
                  onClick={action.action}
                >
                  <IconComponent className={`w-4 h-4 mr-2 transition-transform duration-200 group-hover:scale-110 ${getIconColorClass(action.variant)}`} />
                  <span className="text-xs">{action.label}</span>
                </Button>
              </motion.div>
            </motion.div>
          );
        })}
      </motion.div>
    );
  };

  return (
    <nav className="space-y-4">
      {/* Main Navigation */}
      {renderSection(mainItems)}
      
      {/* Quick Actions Section */}
      <div className="space-y-1">
        {!isCollapsed && (
          <div className="px-2 py-1">
            <span className="text-xs font-medium text-muted-foreground/70 uppercase tracking-wider">
              Quick Actions
            </span>
          </div>
        )}
        {renderQuickActions()}
      </div>
    </nav>
  );
});

SidebarNavigation.displayName = 'SidebarNavigation';

export { SidebarNavigation };