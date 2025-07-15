
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link, useLocation } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { useSidebarCollapse } from '@/contexts/SidebarContext';

import { PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import { NavigationItem, SidebarContextError } from './types';
import 'boxicons/css/boxicons.min.css';

interface NavigationMenuProps {
  onNavigate?: (path: string) => void;
}

const NavigationMenu: React.FC<NavigationMenuProps> = ({ onNavigate }) => {
  const location = useLocation();
  const isMobile = useIsMobile();
  
  
  // Enhanced error handling with proper typing
  let isCollapsed = false;
  let toggleCollapse: () => void = () => {};
  
  try {
    const sidebarContext = useSidebarCollapse();
    isCollapsed = sidebarContext.isCollapsed;
    toggleCollapse = sidebarContext.toggleCollapse;
  } catch (error) {
    const contextError: SidebarContextError = {
      message: 'SidebarContext not available',
      context: 'SidebarContext',
      fallback: { isCollapsed: false, toggleCollapse: () => {} }
    };
    console.error('Navigation context error:', contextError);
  }

  const navigationItems: NavigationItem[] = [
    { 
      icon: 'bx bx-grid-alt', 
      label: 'Dashboard', 
      path: '/app/dashboard',
      description: 'Overview and analytics'
    },
    { 
      icon: 'bx bx-folder-open', 
      label: 'Explorer', 
      path: '/app/explorer',
      description: 'File manager and explorer'
    },
    { 
      icon: 'bx bx-folder', 
      label: 'Projects', 
      path: '/app/projects',
      description: 'Project workspaces'
    },
    { 
      icon: 'bx bx-edit', 
      label: 'Editor', 
      path: '/app/editor',
      description: 'Write and edit notes'
    },
    { 
      icon: 'bx bx-message-rounded', 
      label: 'AI Chat', 
      path: '/app/chat',
      description: 'AI-powered conversations'
    },
    { 
      icon: 'bx bx-calendar', 
      label: 'Calendar', 
      path: '/app/calendar',
      description: 'Schedule and manage events'
    },
    { 
      icon: 'bx bx-bar-chart', 
      label: 'Analytics', 
      path: '/app/analytics',
      description: 'Writing insights and stats'
    },
    { 
      icon: 'bx bx-search-alt', 
      label: 'SEO', 
      path: '/app/seo',
      description: 'SEO optimization and analysis'
    },
    { 
      icon: 'bx bx-list-ul', 
      label: 'Activity', 
      path: '/app/activity',
      description: 'Track your actions and history'
    },
    { 
      icon: 'bx bx-palette', 
      label: 'Themes', 
      path: '/app/themes',
      description: 'Beautiful theme gallery'
    },
  ];

  return (
    <div className="space-y-1">
      {/* Collapse Button */}
      <div className="px-2 mb-2">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleCollapse}
              className={`w-full h-10 flex items-center transition-all duration-200 group relative overflow-hidden hover:bg-sidebar-accent hover:text-sidebar-accent-foreground ${
                isCollapsed ? 'justify-center px-0' : 'justify-start px-3'
              }`}
            >
              <div className={`relative z-10 flex items-center ${isCollapsed ? 'justify-center' : ''}`}>
                {isCollapsed ? (
                  <PanelLeftOpen className="h-4 w-4 group-hover:scale-110 transition-transform duration-200" />
                ) : (
                  <>
                    <PanelLeftClose className="h-4 w-4 group-hover:scale-110 transition-transform duration-200" />
                    {!isMobile && (
                      <span className="ml-3 text-sm transition-colors duration-200">
                        Collapse
                      </span>
                    )}
                  </>
                )}
              </div>
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right" sideOffset={8}>
            <p>{isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}</p>
          </TooltipContent>
        </Tooltip>
      </div>
      
      <nav className="space-y-1">
        {navigationItems.map((item: NavigationItem) => {
        const isActive = location.pathname === item.path;
        
        const buttonContent = (
          <Button
            variant={isActive ? "secondary" : "ghost"}
            className={`w-full transition-all duration-300 group relative overflow-hidden ${
              isMobile 
                ? 'justify-center px-2 h-10' 
                : isCollapsed 
                  ? 'justify-center px-0 h-12 flex items-center' 
                  : 'justify-start px-3 h-12'
            } ${
              isActive 
                ? 'bg-sidebar-primary text-sidebar-primary-foreground shadow-sm' 
                : 'hover:bg-sidebar-accent hover:text-sidebar-accent-foreground hover:scale-[1.02] active:scale-[0.98]'
            }`}
          >
            <div className="relative z-10 flex items-center w-full">
              <i className={`${item.icon} text-sm transition-transform duration-200 ${
                isMobile || isCollapsed ? 'mx-auto' : 'mr-3'  
              } ${
                isActive ? 'text-sidebar-primary-foreground' : 'group-hover:scale-110'
              }`}></i>
              {!isMobile && !isCollapsed && (
                <div className="flex flex-col items-start transition-all duration-200">
                  <span className="text-sm font-medium">
                    {item.label}
                  </span>
                  <span className="text-xs text-sidebar-foreground/60">
                    {item.description}
                  </span>
                </div>
              )}
              {isActive && !isCollapsed && !isMobile && (
                <div className="ml-auto w-1 h-6 bg-sidebar-primary-foreground rounded-full opacity-80" />
              )}
            </div>
          </Button>
        );

        return (
          <div key={item.path}>
            {isMobile || isCollapsed ? (
              <Tooltip delayDuration={200}>
                <TooltipTrigger asChild>
                   <Link 
                     to={item.path} 
                     className="block"
                     onClick={() => onNavigate?.(item.path)}
                   >
                    {buttonContent}
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="right" sideOffset={12} className="bg-popover border border-border shadow-lg">
                  <div>
                    <p className="font-medium text-popover-foreground">{item.label}</p>
                    <p className="text-xs text-muted-foreground">{item.description}</p>
                  </div>
                </TooltipContent>
              </Tooltip>
            ) : (
              <Link 
                to={item.path} 
                className="block"
                onClick={() => onNavigate?.(item.path)}
              >
                {buttonContent}
              </Link>
            )}
          </div>
        );
        })}
      </nav>
    </div>
  );
};

export default NavigationMenu;
