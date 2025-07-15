import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import ThemeGallery from '@/components/ThemeGallery/ThemeGallery';

const ThemeGalleryPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-background/95 backdrop-blur-sm border-b border-border/50 sticky top-0 z-50"
      >
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={() => navigate(-1)}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
            
            <div className="text-center">
              <h1 className="text-lg font-semibold">Theme Gallery</h1>
              <p className="text-sm text-muted-foreground">
                Choose your perfect theme
              </p>
            </div>
            
            <div className="w-20" /> {/* Spacer for centering */}
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="py-8"
      >
        <ThemeGallery 
          onThemeSelect={(themeId) => {
            console.log('Theme selected:', themeId);
          }}
        />
      </motion.div>
    </div>
  );
};

export default ThemeGalleryPage;