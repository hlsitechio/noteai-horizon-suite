import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Plus, Search, Settings, Bookmark, Archive } from 'lucide-react';
import { useSidebarCollapse } from '@/contexts/SidebarContext';
import { useNavigate } from 'react-router-dom';
import { QuickAction, QuickActionClickHandler } from './types';

const quickActionVariants = {
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  },
  hidden: {
    opacity: 0,
    scale: 0.95,
    transition: {
      staggerChildren: 0.05,
      staggerDirection: -1
    }
  }
};

const actionItemVariants = {
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.2,
      ease: [0.4, 0, 0.2, 1] as const
    }
  },
  hidden: {
    opacity: 0,
    x: -20,
    transition: {
      duration: 0.2,
      ease: [0.4, 0, 0.6, 1] as const
    }
  }
};

interface SidebarQuickActionsProps {
  onActionClick?: QuickActionClickHandler;
  maxCollapsedActions?: number;
}

export function SidebarQuickActions({ 
  onActionClick, 
  maxCollapsedActions = 3 
}: SidebarQuickActionsProps = {}) {
  const { isCollapsed } = useSidebarCollapse();
  const navigate = useNavigate();

  const quickActions: QuickAction[] = [
    {
      icon: Plus,
      label: 'New Note',
      description: 'Create a new note',
      action: () => navigate('/app/editor'),
      color: 'text-green-500'
    },
    {
      icon: Search,
      label: 'Search',
      description: 'Find notes and folders',
      action: () => navigate('/app/explorer'),
      color: 'text-blue-500'
    },
    {
      icon: Bookmark,
      label: 'Favorites',
      description: 'View favorite notes',
      action: () => navigate('/app/explorer?filter=favorites'),
      color: 'text-yellow-500'
    },
    {
      icon: Archive,
      label: 'Archive',
      description: 'Browse archived content',
      action: () => navigate('/app/explorer?filter=archived'),
      color: 'text-gray-500'
    },
    {
      icon: Settings,
      label: 'Settings',
      description: 'Configure your preferences',
      action: () => navigate('/app/settings'),
      color: 'text-purple-500',
      'data-onboarding': 'settings'
    }
  ];

  if (isCollapsed) {
    return (
      <motion.div
        className="space-y-2 px-2"
        variants={quickActionVariants}
        initial="hidden"
        animate="visible"
      >
        {quickActions.slice(0, maxCollapsedActions).map((action: QuickAction) => {
          const IconComponent = action.icon;
          return (
            <motion.div key={action.label} variants={actionItemVariants}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-9 w-9 p-0 rounded-lg hover:bg-sidebar-accent hover:scale-110 transition-all duration-200 group"
                    onClick={() => {
                      action.action();
                      onActionClick?.(action.action);
                    }}
                  >
                    <IconComponent className={`w-4 h-4 ${action.color} group-hover:scale-110 transition-transform duration-200`} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="right" className="animate-fade-in">
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
      className="space-y-1 px-2"
      variants={quickActionVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="mb-3">
        <h4 className="text-xs font-medium text-sidebar-foreground/70 uppercase tracking-wider">
          Quick Actions
        </h4>
      </div>
      {quickActions.map((action: QuickAction) => {
        const IconComponent = action.icon;
        return (
          <motion.div key={action.label} variants={actionItemVariants}>
            <Button
              variant="ghost"
              size="sm"
              className="w-full h-9 justify-start px-3 rounded-lg hover:bg-sidebar-accent hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 group"
              onClick={() => {
                action.action();
                onActionClick?.(action.action);
              }}
            >
              <IconComponent className={`w-4 h-4 mr-3 ${action.color} group-hover:scale-110 transition-transform duration-200`} />
              <span className="text-sm group-hover:text-sidebar-accent-foreground transition-colors duration-200">
                {action.label}
              </span>
            </Button>
          </motion.div>
        );
      })}
    </motion.div>
  );
}