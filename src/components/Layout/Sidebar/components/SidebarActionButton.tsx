// Unified action button component for sidebar
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { SidebarActionItem } from '../types';
import { sidebarAnimations } from '../animations';

interface SidebarActionButtonProps extends Omit<SidebarActionItem, 'variant'> {
  displayVariant?: 'full' | 'icon' | 'compact';
  size?: 'sm' | 'md' | 'lg';
  showTooltip?: boolean;
  className?: string;
  buttonVariant?: 'default' | 'destructive' | 'ghost';
}

export function SidebarActionButton({
  icon: Icon,
  label,
  onClick,
  disabled = false,
  badge,
  displayVariant = 'full',
  size = 'md',
  showTooltip = false,
  className = '',
  buttonVariant = 'default'
}: SidebarActionButtonProps) {

  const getButtonSize = () => {
    switch (size) {
      case 'sm':
        return 'h-8';
      case 'lg':
        return 'h-12';
      case 'md':
      default:
        return 'h-10';
    }
  };

  const getIconSize = () => {
    switch (size) {
      case 'sm':
        return 'w-4 h-4';
      case 'lg':
        return 'w-6 h-6';
      case 'md':
      default:
        return 'w-5 h-5';
    }
  };

  const renderButton = () => {
    const baseButton = (
      <motion.div
        variants={sidebarAnimations.buttonVariants}
        initial="initial"
        whileHover="hover"
        whileTap="tap"
        className="relative"
      >
        <Button
          variant="ghost"
          size="sm"
          onClick={onClick}
          disabled={disabled}
          className={`
            ${getButtonSize()} 
            ${displayVariant === 'icon' ? 'w-10 px-0' : 'w-full justify-start'}
            ${buttonVariant === 'destructive' ? 'hover:bg-destructive/10 hover:text-destructive' : ''}
            ${className}
          `}
        >
          <Icon className={`${getIconSize()} ${displayVariant !== 'icon' ? 'mr-2' : ''}`} />
          {displayVariant !== 'icon' && <span>{label}</span>}
          
          {badge && displayVariant === 'full' && (
            <Badge 
              variant={typeof badge === 'number' ? 'destructive' : 'secondary'} 
              className="ml-auto h-5 min-w-5 text-xs"
            >
              {typeof badge === 'number' && badge > 99 ? '99+' : badge}
            </Badge>
          )}
        </Button>
        
        {badge && displayVariant === 'icon' && (
          <Badge 
            variant={typeof badge === 'number' ? 'destructive' : 'secondary'}
            className="absolute -top-1 -right-1 h-4 min-w-4 p-0 text-xs"
          >
            {typeof badge === 'number' && badge > 99 ? '99+' : badge}
          </Badge>
        )}
      </motion.div>
    );

    if (showTooltip && displayVariant === 'icon') {
      return (
        <Tooltip>
          <TooltipTrigger asChild>
            {baseButton}
          </TooltipTrigger>
          <TooltipContent side="right">
            <p>{label}</p>
            {badge && <p className="text-xs opacity-75">({badge})</p>}
          </TooltipContent>
        </Tooltip>
      );
    }

    return baseButton;
  };

  return renderButton();
}