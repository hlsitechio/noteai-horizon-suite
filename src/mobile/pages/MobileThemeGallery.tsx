import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import ThemeGallery from '@/components/ThemeGallery/ThemeGallery';

const MobileThemeGallery: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="h-full overflow-y-auto bg-background">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="sticky top-0 bg-background/95 backdrop-blur-md border-b border-border px-4 py-3 flex items-center space-x-3 z-10"
      >
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-8 w-8 p-0"
          onClick={() => navigate('/mobile/settings')}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-lg font-semibold text-foreground">Theme Gallery</h1>
          <p className="text-xs text-muted-foreground">Choose your perfect theme</p>
        </div>
      </motion.div>

      {/* Content */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="pb-20" // Extra padding for mobile navigation
      >
        <ThemeGallery 
          onThemeSelect={(themeId) => {
            console.log('Mobile theme selected:', themeId);
          }}
          className="px-4"
        />
      </motion.div>
    </div>
  );
};

export default MobileThemeGallery;