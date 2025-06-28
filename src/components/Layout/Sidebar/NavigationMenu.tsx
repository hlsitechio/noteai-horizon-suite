
import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  LayoutDashboard, 
  FileText, 
  Edit3, 
  MessageSquare, 
  Settings,
  BarChart3
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

interface NavigationMenuProps {
  isCollapsed: boolean;
}

const NavigationMenu: React.FC<NavigationMenuProps> = ({ isCollapsed }) => {
  const location = useLocation();

  const navigationItems = [
    { 
      icon: LayoutDashboard, 
      label: 'Dashboard', 
      path: '/app/dashboard',
      description: 'Overview and analytics'
    },
    { 
      icon: FileText, 
      label: 'Notes', 
      path: '/app/notes',
      description: 'Browse and manage notes'
    },
    { 
      icon: Edit3, 
      label: 'Editor', 
      path: '/app/editor',
      description: 'Write and edit notes'
    },
    { 
      icon: MessageSquare, 
      label: 'AI Chat', 
      path: '/app/chat',
      description: 'AI-powered conversations'
    },
    { 
      icon: BarChart3, 
      label: 'Analytics', 
      path: '/app/analytics',
      description: 'Writing insights and stats'
    },
    { 
      icon: Settings, 
      label: 'Settings', 
      path: '/app/settings',
      description: 'App preferences'
    },
  ];

  return (
    <nav className="space-y-1">
      {navigationItems.map((item) => {
        const Icon = item.icon;
        const isActive = location.pathname === item.path;
        
        return (
          <Link key={item.path} to={item.path}>
            <Button
              variant={isActive ? "secondary" : "ghost"}
              className={`w-full justify-start transition-all duration-200 ${
                isCollapsed ? 'px-2 h-10' : 'px-3 h-12'
              } ${isActive ? 'bg-sidebar-accent text-sidebar-accent-foreground' : 'hover:bg-sidebar-accent/50'}`}
            >
              <Icon className={`h-4 w-4 ${isCollapsed ? '' : 'mr-3'} ${
                isActive ? 'text-sidebar-accent-foreground' : ''
              }`} />
              {!isCollapsed && (
                <div className="flex flex-col items-start">
                  <span className="text-sm font-medium">{item.label}</span>
                  <span className="text-xs text-sidebar-foreground/60">
                    {item.description}
                  </span>
                </div>
              )}
            </Button>
          </Link>
        );
      })}
    </nav>
  );
};

export default NavigationMenu;
