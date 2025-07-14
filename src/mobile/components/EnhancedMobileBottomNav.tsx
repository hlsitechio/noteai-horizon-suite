
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, FileText, MessageCircle, Folder, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';

const EnhancedMobileBottomNav: React.FC = () => {
  const location = useLocation();

  const navItems = [
    { icon: Home, label: 'Home', path: '/mobile/dashboard' },
    { icon: FileText, label: 'Notes', path: '/mobile/notes' },
    { icon: MessageCircle, label: 'Chat', path: '/mobile/chat' },
    { icon: Folder, label: 'Projects', path: '/mobile/projects' },
    { icon: BarChart3, label: 'Analytics', path: '/mobile/analytics' },
  ];

  return (
    <nav className="bg-background/95 backdrop-blur-md border-t border-border/50 px-2 py-2 shadow-lg w-full h-[72px]">
      <div className="flex justify-around items-center max-w-full h-full">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          
          return (
            <Link key={item.path} to={item.path} className="flex-1 max-w-[60px]">
              <Button
                variant="ghost"
                className={`w-full flex flex-col items-center gap-0.5 h-auto py-2 px-1 transition-all duration-200 ${
                  isActive 
                    ? 'text-primary bg-primary/10 scale-105' 
                    : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
                }`}
              >
                <Icon className={`h-4 w-4 transition-all ${isActive ? 'scale-110' : ''}`} />
                <span className="text-[10px] font-medium leading-none">{item.label}</span>
                {isActive && (
                  <div className="w-1 h-1 bg-primary rounded-full mt-0.5" />
                )}
              </Button>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default EnhancedMobileBottomNav;
