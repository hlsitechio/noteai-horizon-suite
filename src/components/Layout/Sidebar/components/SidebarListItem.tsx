// Unified list item component for sidebar
import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { SidebarListItem as SidebarListItemType } from '../types';
import { sidebarAnimations } from '../animations';

interface SidebarListItemProps {
  item: SidebarListItemType;
  variant?: 'default' | 'compact' | 'minimal';
  showBadge?: boolean;
  className?: string;
}

export function SidebarListItem({
  item,
  variant = 'default',
  showBadge = true,
  className = ''
}: SidebarListItemProps) {
  const {
    id,
    title,
    icon: Icon,
    iconColor,
    href,
    onClick,
    badge,
    isActive = false
  } = item;

  const getIconSize = () => {
    switch (variant) {
      case 'minimal':
        return 'w-3 h-3';
      case 'compact':
        return 'w-4 h-4';
      case 'default':
      default:
        return 'w-4 h-4';
    }
  };

  const getTextSize = () => {
    switch (variant) {
      case 'minimal':
        return 'text-xs';
      case 'compact':
        return 'text-xs';
      case 'default':
      default:
        return 'text-sm';
    }
  };

  const getPadding = () => {
    switch (variant) {
      case 'minimal':
        return 'p-1';
      case 'compact':
        return 'p-2';
      case 'default':
      default:
        return 'p-2';
    }
  };

  const handleClick = (e: React.MouseEvent) => {
    if (onClick) {
      e.preventDefault();
      onClick();
    }
  };

  const content = (
    <motion.div
      className={`flex items-center w-full ${getPadding()}`}
      variants={sidebarAnimations.listItemVariants}
      initial="hidden"
      animate="visible"
      exit="hidden"
    >
      {Icon && (
        <Icon 
          className={`${getIconSize()} mr-2 flex-shrink-0 ${
            iconColor || (isActive ? 'text-accent' : 'text-sidebar-foreground/70')
          }`}
        />
      )}
      
      <span className={`truncate flex-1 ${getTextSize()} ${
        isActive ? 'font-medium text-accent' : 'text-sidebar-foreground'
      }`}>
        {title}
      </span>
      
      {showBadge && badge && (
        <Badge 
          variant={isActive ? 'default' : 'secondary'} 
          className="ml-2 h-4 min-w-4 text-xs"
        >
          {badge}
        </Badge>
      )}
    </motion.div>
  );

  return (
    <SidebarMenuItem className={className}>
      <SidebarMenuButton
        asChild={!!href}
        isActive={isActive}
        className={`
          w-full hover:bg-sidebar-accent hover:text-accent-foreground transition-colors
          ${isActive ? 'bg-sidebar-accent text-accent-foreground' : ''}
        `}
        onClick={!href ? handleClick : undefined}
      >
        {href ? (
          <Link to={href} className="flex items-center w-full">
            {content}
          </Link>
        ) : (
          <div className="flex items-center w-full cursor-pointer">
            {content}
          </div>
        )}
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}