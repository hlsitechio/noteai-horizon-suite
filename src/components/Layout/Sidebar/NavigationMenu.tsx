
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link, useLocation } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { useSidebarCollapse } from '@/contexts/SidebarContext';
import { PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import 'boxicons/css/boxicons.min.css';

const NavigationMenu: React.FC = () => {
  const location = useLocation();
  const isMobile = useIsMobile();
  
  // Add error handling for the context
  let isCollapsed = false;
  let toggleCollapse = () => {};
  
  try {
    const sidebarContext = useSidebarCollapse();
    isCollapsed = sidebarContext.isCollapsed;
    toggleCollapse = sidebarContext.toggleCollapse;
  } catch (error) {
    console.error('SidebarContext not available:', error);
  }

  const navigationItems = [
    { 
      icon: 'bx bx-grid-alt', 
      label: 'Dashboard', 
      path: '/app/dashboard',
      description: 'Overview and analytics'
    },
    { 
      icon: 'bx bx-file', 
      label: 'Notes', 
      path: '/app/notes',
      description: 'Browse and manage notes'
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
      icon: 'bx bx-list-ul', 
      label: 'Activity', 
      path: '/app/activity',
      description: 'Track your actions and history'
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
              className="w-full h-10 px-3 flex items-center justify-start hover:bg-sidebar-accent/50"
            >
              {isCollapsed ? (
                <PanelLeftOpen className="h-4 w-4" />
              ) : (
                <PanelLeftClose className="h-4 w-4" />
              )}
              {!isCollapsed && !isMobile && (
                <span className="ml-3 text-sm">Collapse</span>
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right">
            <p>{isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}</p>
          </TooltipContent>
        </Tooltip>
      </div>
      
      <nav className="space-y-1">
        {navigationItems.map((item) => {
        const isActive = location.pathname === item.path;
        
        const buttonContent = (
          <Button
            variant={isActive ? "secondary" : "ghost"}
            className={`w-full transition-all duration-200 ${
              isMobile 
                ? 'justify-center px-2 h-10' 
                : 'justify-start px-3 h-12'
            } ${
              isActive ? 'bg-sidebar-accent text-sidebar-accent-foreground' : 'hover:bg-sidebar-accent/50'
            }`}
          >
            <i className={`${item.icon} text-sm ${
              isMobile || isCollapsed ? '' : 'mr-3'
            } ${
              isActive ? 'text-sidebar-accent-foreground' : ''
            }`}></i>
            {!isMobile && !isCollapsed && (
              <div className="flex flex-col items-start">
                <span className="text-sm font-medium">{item.label}</span>
                <span className="text-xs text-sidebar-foreground/60">
                  {item.description}
                </span>
              </div>
            )}
          </Button>
        );

        return (
          <Link key={item.path} to={item.path}>
            {isMobile || isCollapsed ? (
              <Tooltip>
                <TooltipTrigger asChild>
                  {buttonContent}
                </TooltipTrigger>
                <TooltipContent side="right">
                  <div>
                    <p className="font-medium">{item.label}</p>
                    <p className="text-xs text-muted-foreground">{item.description}</p>
                  </div>
                </TooltipContent>
              </Tooltip>
            ) : (
              buttonContent
            )}
          </Link>
        );
        })}
      </nav>
    </div>
  );
};

export default NavigationMenu;
