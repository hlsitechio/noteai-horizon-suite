import React from 'react';
import { motion } from 'framer-motion';
import { Image, Upload, Sparkles, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CompactBannerPlaceholderProps {
  onUploadClick?: () => void;
  onAIGenerateClick?: () => void;
  onGalleryClick?: () => void;
  onSettingsClick?: () => void;
}

const CompactBannerPlaceholder: React.FC<CompactBannerPlaceholderProps> = ({
  onUploadClick,
  onAIGenerateClick,
  onGalleryClick,
  onSettingsClick,
}) => {
  return (
    <motion.div
      className="flex items-center justify-center bg-gradient-to-br from-primary/5 via-secondary/10 to-accent/5 w-full h-full min-h-[200px]"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="text-center p-6 max-w-2xl">
        <motion.div
          className="flex justify-center mb-4 space-x-3"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="p-2 bg-primary/10 rounded-full">
            <Image className="w-5 h-5 text-primary" />
          </div>
          <div className="p-2 bg-secondary/10 rounded-full">
            <Upload className="w-5 h-5 text-secondary" />
          </div>
          <div className="p-2 bg-accent/10 rounded-full">
            <Sparkles className="w-5 h-5 text-accent" />
          </div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h3 className="text-lg font-semibold text-foreground mb-2">
            Add Your Banner
          </h3>
          <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
            Personalize your dashboard with a custom banner. Upload an image, generate with AI, or browse your gallery.
          </p>
          
          <div className="flex flex-wrap justify-center gap-2">
            <input
              type="file"
              accept="image/*,video/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) onUploadClick?.();
              }}
              className="hidden"
              id="banner-upload"
            />
            <label htmlFor="banner-upload">
              <Button variant="outline" size="sm" className="gap-2 cursor-pointer">
                <Upload className="w-4 h-4" />
                Upload
              </Button>
            </label>
            
            <Button 
              variant="outline" 
              size="sm" 
              className="gap-2"
              onClick={onAIGenerateClick}
            >
              <Sparkles className="w-4 h-4" />
              AI Generate
            </Button>
            
            <Button 
              variant="outline" 
              size="sm" 
              className="gap-2"
              onClick={onGalleryClick}
            >
              <Image className="w-4 h-4" />
              Gallery
            </Button>
            
            <Button 
              variant="ghost" 
              size="sm" 
              className="gap-2"
              onClick={onSettingsClick}
            >
              <Settings className="w-4 h-4" />
              Settings
            </Button>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default CompactBannerPlaceholder;