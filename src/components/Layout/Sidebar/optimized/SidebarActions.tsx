import React, { memo, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Plus, Search, Settings, Bookmark, Archive } from 'lucide-react';
import { useSidebarCollapse } from '@/contexts/SidebarContext';
import { useNavigate } from 'react-router-dom';
import { sidebarAnimations, hoverProps } from './animations';

interface QuickAction {
  icon: React.ElementType;
  label: string;
  description: string;
  action: () => void;
  variant: 'default' | 'success' | 'info' | 'warning' | 'secondary';
}

const SidebarActions = memo(() => {
  const { isCollapsed } = useSidebarCollapse();
  const navigate = useNavigate();

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
      className="space-y-2"
      variants={sidebarAnimations.list}
    >
      <div className="px-2">
        <h4 className="text-xs font-medium text-muted-foreground/70 uppercase tracking-wider mb-2">
          Quick Actions
        </h4>
      </div>
      
      <div className="space-y-1">
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
      </div>
    </motion.div>
  );
});

SidebarActions.displayName = 'SidebarActions';

export { SidebarActions };