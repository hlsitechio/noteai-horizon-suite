
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
              className={`w-full h-10 px-0 flex items-center justify-center transition-all duration-200 group ${
                isCollapsed ? 'justify-center' : 'justify-center'
              } hover:bg-sidebar-accent/50`}
            >
              {isCollapsed ? (
                <PanelLeftOpen className="h-4 w-4 group-hover:scale-110 transition-transform duration-200" />
              ) : (
                <PanelLeftClose className="h-4 w-4 group-hover:scale-110 transition-transform duration-200" />
              )}
              {!isCollapsed && !isMobile && (
                <span className="ml-3 text-sm group-hover:text-sidebar-accent-foreground transition-colors duration-200">
                  Collapse
                </span>
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right">
            <p>{isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}</p>
          </TooltipContent>
        </Tooltip>
      </div>
      
      <nav className="space-y-1">
        {navigationItems.map((item, index) => {
        const isActive = location.pathname === item.path;
        
        const buttonContent = (
          <Button
            variant={isActive ? "secondary" : "ghost"}
            className={`w-full transition-all duration-300 group ${
              isMobile 
                ? 'justify-center px-2 h-10' 
                : isCollapsed 
                  ? 'justify-center px-0 h-12 flex items-center' // Better centering when collapsed
                  : 'justify-start px-3 h-12'
            } ${
              isActive 
                ? 'bg-sidebar-accent text-sidebar-accent-foreground shadow-sm' 
                : 'hover:bg-sidebar-accent/50 hover:scale-[1.02] active:scale-[0.98]'
            }`}
          >
            <i className={`${item.icon} text-sm transition-transform duration-200 ${
              isMobile || isCollapsed ? 'mx-auto' : 'mr-3'  // Center icon when collapsed/mobile
            } ${
              isActive ? 'text-sidebar-accent-foreground' : 'group-hover:scale-110'
            }`}></i>
            {!isMobile && !isCollapsed && (
              <div className="flex flex-col items-start transition-all duration-200">
                <span className="text-sm font-medium group-hover:text-sidebar-accent-foreground">
                  {item.label}
                </span>
                <span className="text-xs text-sidebar-foreground/60 group-hover:text-sidebar-foreground/80">
                  {item.description}
                </span>
              </div>
            )}
            {isActive && !isCollapsed && !isMobile && (
              <div className="ml-auto w-1 h-6 bg-sidebar-accent-foreground rounded-full opacity-80" />
            )}
          </Button>
        );

        return (
          <Link key={item.path} to={item.path} className="block">
            {isMobile || isCollapsed ? (
              <Tooltip>
                <TooltipTrigger asChild>
                  {buttonContent}
                </TooltipTrigger>
                <TooltipContent side="right" className="animate-fade-in">
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
