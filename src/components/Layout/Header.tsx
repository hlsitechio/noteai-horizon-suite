
import React from 'react';
import { useIsMobile } from '../../hooks/use-mobile';
import { Button } from '@/components/ui/button';
import { Bell, Menu } from 'lucide-react';

const Header: React.FC = () => {
  const isMobile = useIsMobile();

  return (
    <header className="flex items-center justify-between p-4 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex items-center gap-4">
        {isMobile && (
          <Button variant="ghost" size="sm">
            <Menu className="w-4 h-4" />
          </Button>
        )}
        <h1 className="text-lg font-semibold">Online Note AI</h1>
      </div>
      
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm">
          <Bell className="w-4 h-4" />
        </Button>
      </div>
    </header>
  );
};

export default Header;
