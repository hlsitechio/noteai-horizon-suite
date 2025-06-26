
import React from 'react';
import { Monitor } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';

const MobileDesktopViewButton: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  const handleDesktopView = () => {
    // Preserve note parameter when switching to desktop
    const noteParam = searchParams.get('note');
    const desktopUrl = noteParam 
      ? `/app/notes?note=${noteParam}` 
      : '/app/notes';
    
    navigate(desktopUrl);
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleDesktopView}
      className="fixed top-4 right-4 z-50 shadow-lg bg-background/80 backdrop-blur-sm"
    >
      <Monitor className="w-4 h-4 mr-2" />
      Desktop View
    </Button>
  );
};

export default MobileDesktopViewButton;
