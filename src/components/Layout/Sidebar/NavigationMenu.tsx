
import React from 'react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { 
  LayoutDashboard, 
  FileText, 
  Edit3, 
  Calendar, 
  MessageSquare, 
  Settings,
  FolderOpen,
  BarChart3
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

interface NavigationMenuProps {
  isCollapsed: boolean;
}

const NavigationMenu: React.FC<NavigationMenuProps> = ({ isCollapsed }) => {
  const location = useLocation();

  const navigationGroups = [
    // Core section
    {
      items: [
        { 
          icon: LayoutDashboard, 
          label: 'Dashboard', 
          path: '/app/dashboard',
          description: 'Overview and analytics'
        },
      ]
    },
    // Content section
    {
      items: [
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
      ]
    },
    // Analytics section
    {
      items: [
        { 
          icon: BarChart3, 
          label: 'Analytics', 
          path: '/app/analytics',
          description: 'Writing insights and stats'
        },
      ]
    },
    // Tools section
    {
      items: [
        { 
          icon: Calendar, 
          label: 'Calendar', 
          path: '/app/calendar',
          description: 'Schedule and events'
        },
        { 
          icon: MessageSquare, 
          label: 'AI Chat', 
          path: '/app/chat',
          description: 'AI-powered conversations'
        },
        { 
          icon: FolderOpen, 
          label: 'Projects', 
          path: '/app/projects',
          description: 'Project realms and workspaces'
        },
      ]
    },
    // Settings section
    {
      items: [
        { 
          icon: Settings, 
          label: 'Settings', 
          path: '/app/settings',
          description: 'App preferences'
        },
      ]
    }
  ];

  // Flatten all items to create a single list with separators between each item
  const allItems = navigationGroups.flatMap(group => group.items);

  return (
    <nav className="space-y-1">
      {allItems.map((item, index) => {
        const Icon = item.icon;
        const isActive = location.pathname === item.path;
        
        return (
          <div key={item.path}>
            <Link to={item.path}>
              <Button
                variant={isActive ? "secondary" : "ghost"}
                className={`w-full justify-start transition-all duration-200 ${
                  isCollapsed ? 'px-2' : 'px-3'
                } ${isActive ? 'bg-primary/10 text-primary' : 'hover:bg-accent'}`}
              >
                <Icon className={`h-4 w-4 ${isCollapsed ? '' : 'mr-3'} ${
                  isActive ? 'text-primary' : ''
                }`} />
                {!isCollapsed && (
                  <div className="flex flex-col items-start">
                    <span className="text-sm font-medium">{item.label}</span>
                    <span className="text-xs text-muted-foreground">
                      {item.description}
                    </span>
                  </div>
                )}
              </Button>
            </Link>
            
            {/* Add separator after each item except the last one */}
            {index < allItems.length - 1 && (
              <div className={`${isCollapsed ? 'px-2' : 'px-3'} py-2`}>
                <Separator className="bg-border/50" />
              </div>
            )}
          </div>
        );
      })}
    </nav>
  );
};

export default NavigationMenu;
