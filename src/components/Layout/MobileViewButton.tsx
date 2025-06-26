
import React from 'react';
import { Smartphone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';

const MobileViewButton: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  const handleMobileView = () => {
    // Preserve note parameter when switching to mobile
    const noteParam = searchParams.get('note');
    const mobileUrl = noteParam 
      ? `/mobile/notes?note=${noteParam}` 
      : '/mobile/notes';
    
    navigate(mobileUrl);
  };

  // Only show on notes page for now
  if (!location.pathname.includes('/notes')) return null;

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleMobileView}
      className="fixed bottom-4 right-4 z-50 shadow-lg"
    >
      <Smartphone className="w-4 h-4 mr-2" />
      Mobile View
    </Button>
  );
};

export default MobileViewButton;
