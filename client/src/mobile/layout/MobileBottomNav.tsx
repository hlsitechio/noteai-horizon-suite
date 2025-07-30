
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FileText, Edit3, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';

const MobileBottomNav: React.FC = () => {
  const location = useLocation();

  const navItems = [
    { icon: FileText, label: 'Notes', path: '/mobile/notes' },
    { icon: Edit3, label: 'Write', path: '/mobile/editor' },
    { icon: Settings, label: 'Settings', path: '/mobile/settings' },
  ];

  return (
    <nav className="bg-background/95 backdrop-blur-md border-t border-border px-4 py-2 flex-shrink-0">
      <div className="flex justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          
          return (
            <Link key={item.path} to={item.path} className="flex-1">
              <Button
                variant="ghost"
                className={`w-full flex flex-col items-center gap-1 h-auto py-2 ${
                  isActive ? 'text-primary' : 'text-muted-foreground'
                }`}
              >
                <Icon className="h-5 w-5" />
                <span className="text-xs">{item.label}</span>
              </Button>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default MobileBottomNav;
