
import React from 'react';
import { Monitor } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';

const MobileDesktopViewButton: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  const handleDesktopView = () => {
    // Map mobile routes to desktop routes
    const routeMapping: Record<string, string> = {
      '/mobile/dashboard': '/app/dashboard',
      '/mobile/notes': '/app/notes',
      '/mobile/editor': '/app/editor',
      '/mobile/chat': '/app/chat',
      '/mobile/projects': '/app/projects',
      '/mobile/analytics': '/app/analytics',
      '/mobile/settings': '/app/settings'
    };

    const noteParam = searchParams.get('note');
    const desktopRoute = routeMapping[location.pathname] || '/app/dashboard';
    const desktopUrl = noteParam ? `${desktopRoute}?note=${noteParam}` : desktopRoute;
    
    navigate(desktopUrl);
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleDesktopView}
      className="h-8 px-2 text-xs shadow-lg bg-background/80 backdrop-blur-sm"
    >
      <Monitor className="w-3 h-3 mr-1" />
      Desktop
    </Button>
  );
};

export default MobileDesktopViewButton;
