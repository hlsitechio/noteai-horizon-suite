import React, { memo } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Link, useLocation } from 'react-router-dom';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
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

  // Group navigation items by category
  const mainItems = navigationItems.filter(item => item.category === 'main' || !item.category);
  const toolItems = navigationItems.filter(item => item.category === 'tools');
  const settingItems = navigationItems.filter(item => item.category === 'settings');

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

  return (
    <nav className="space-y-4">
      {/* Main Navigation */}
      {renderSection(mainItems)}
      
      {/* Tools Section */}
      {toolItems.length > 0 && (
        <>
          {!isCollapsed && <div className="h-px bg-border/50 mx-2" />}
          {renderSection(toolItems, 'Tools')}
        </>
      )}
      
      {/* Settings Section */}
      {settingItems.length > 0 && (
        <>
          {!isCollapsed && <div className="h-px bg-border/50 mx-2" />}
          {renderSection(settingItems, 'Settings')}
        </>
      )}
    </nav>
  );
});

SidebarNavigation.displayName = 'SidebarNavigation';

export { SidebarNavigation };