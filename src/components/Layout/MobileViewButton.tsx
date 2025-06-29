
import React from 'react';
import { Smartphone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const MobileViewButton: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();

  // Only show for authorized user
  const isAllowedUser = user?.email === 'hlarosesurprenant@gmail.com';

  const handleMobileView = () => {
    // Map desktop routes to mobile routes
    const routeMapping: Record<string, string> = {
      '/app': '/mobile/dashboard',
      '/app/dashboard': '/mobile/dashboard',
      '/app/notes': '/mobile/notes',
      '/app/editor': '/mobile/editor',
      '/app/chat': '/mobile/chat',
      '/app/projects': '/mobile/projects',
      '/app/analytics': '/mobile/analytics',
      '/app/settings': '/mobile/settings'
    };

    const noteParam = searchParams.get('note');
    const mobileRoute = routeMapping[location.pathname] || '/mobile/dashboard';
    const mobileUrl = noteParam ? `${mobileRoute}?note=${noteParam}` : mobileRoute;
    
    console.log('Switching to mobile view:', { from: location.pathname, to: mobileUrl });
    navigate(mobileUrl);
  };

  // Show on main app pages only for allowed user
  if (!isAllowedUser || !location.pathname.startsWith('/app')) {
    return null;
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleMobileView}
      className="fixed bottom-4 right-4 z-50 shadow-lg bg-background/80 backdrop-blur-sm"
    >
      <Smartphone className="w-4 h-4 mr-2" />
      Mobile View
    </Button>
  );
};

export default MobileViewButton;
