
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

  // Only show for your email address
  const isAllowedUser = user?.email === 'hlarosesurprenant@gmail.com';

  const handleMobileView = () => {
    // Preserve note parameter when switching to mobile
    const noteParam = searchParams.get('note');
    const mobileUrl = noteParam 
      ? `/mobile/notes?note=${noteParam}` 
      : '/mobile/notes';
    
    navigate(mobileUrl);
  };

  // Show on notes and editor pages only for allowed user
  if (!isAllowedUser || (!location.pathname.includes('/notes') && !location.pathname.includes('/editor'))) {
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
