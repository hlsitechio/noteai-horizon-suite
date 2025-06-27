
import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const MobileSettings: React.FC = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate('/mobile/notes');
  };

  return (
    <div className="h-full overflow-y-auto bg-background">
      {/* Header */}
      <div className="sticky top-0 bg-background/95 backdrop-blur-md border-b border-border px-4 py-3 flex items-center space-x-3 z-10">
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-8 w-8 p-0"
          onClick={handleBack}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-lg font-semibold text-foreground">Settings</h1>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">⚙️</span>
          </div>
          <h2 className="text-xl font-semibold mb-2">Settings are now in the menu</h2>
          <p className="text-muted-foreground mb-4">
            Access all your settings from the hamburger menu (☰) for a better mobile experience.
          </p>
          <Button onClick={handleBack} variant="outline">
            Go back to Notes
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MobileSettings;
