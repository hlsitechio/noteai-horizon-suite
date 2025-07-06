
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link, useLocation } from 'react-router-dom';
import 'boxicons/css/boxicons.min.css';

const NavigationMenu: React.FC = () => {
  const location = useLocation();

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
      icon: 'bx bx-bar-chart', 
      label: 'Analytics', 
      path: '/app/analytics',
      description: 'Writing insights and stats'
    },
    { 
      icon: 'bx bx-cog', 
      label: 'Settings', 
      path: '/app/settings',
      description: 'App preferences'
    },
  ];

  return (
    <div className="space-y-1">
      
      <nav className="space-y-1">
        {navigationItems.map((item) => {
        const isActive = location.pathname === item.path;
        
        return (
          <Link key={item.path} to={item.path}>
            <Button
              variant={isActive ? "secondary" : "ghost"}
              className={`w-full justify-start transition-all duration-200 px-3 h-12 ${
                isActive ? 'bg-sidebar-accent text-sidebar-accent-foreground' : 'hover:bg-sidebar-accent/50'
              }`}
            >
              <i className={`${item.icon} text-sm mr-3 ${
                isActive ? 'text-sidebar-accent-foreground' : ''
              }`}></i>
              <div className="flex flex-col items-start">
                <span className="text-sm font-medium">{item.label}</span>
                <span className="text-xs text-sidebar-foreground/60">
                  {item.description}
                </span>
              </div>
            </Button>
          </Link>
        );
        })}
      </nav>
    </div>
  );
};

export default NavigationMenu;
