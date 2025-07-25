
import React, { useState, useEffect } from 'react';
import { OptimizedDOMUtils } from '@/utils/optimizedDOMUtils';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface FullscreenBannerProps {
  bannerData: {url: string, type: 'image' | 'video'} | null;
  isOpen: boolean;
  onClose: () => void;
}

const FullscreenBanner: React.FC<FullscreenBannerProps> = ({ 
  bannerData, 
  isOpen, 
  onClose 
}) => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Use optimized DOM utils to batch style changes
    OptimizedDOMUtils.manageBodyOverflow(isOpen);
    
    if (isOpen) {
      setIsLoaded(false);
    }

    return () => {
      OptimizedDOMUtils.manageBodyOverflow(false);
    };
  }, [isOpen]);

  const handleMediaLoad = () => {
    setIsLoaded(true);
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen]);

  if (!isOpen || !bannerData) return null;

  return (
    <div className="fixed inset-0 z-[9999] bg-black/95 backdrop-blur-sm">
      {/* Loading indicator */}
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-2 border-transparent border-t-accent"></div>
        </div>
      )}

      {/* Close button */}
      <Button
        variant="outline"
        size="icon"
        onClick={onClose}
        className="absolute top-6 right-6 z-10 bg-black/50 border-white/30 text-white hover:bg-black/70 hover:text-white"
      >
        <X className="h-5 w-5" />
      </Button>

      {/* ESC hint */}
      <div className="absolute top-6 left-6 z-10 text-white/70 text-sm">
        Press ESC to exit fullscreen
      </div>

      {/* Fullscreen content */}
      <div className="w-full h-full flex items-center justify-center">
        {bannerData.type === 'video' ? (
          <video
            src={bannerData.url}
            className="w-full h-full object-cover"
            autoPlay
            loop
            muted
            playsInline
            onLoadedData={handleMediaLoad}
            onCanPlay={handleMediaLoad}
            style={{
              maxWidth: '100vw',
              maxHeight: '100vh',
              width: 'auto',
              height: 'auto',
            }}
          />
        ) : (
          <img
            src={bannerData.url}
            alt="Fullscreen banner"
            className="max-w-full max-h-full object-contain"
            onLoad={handleMediaLoad}
            style={{
              width: 'auto',
              height: 'auto',
              maxWidth: '100vw',
              maxHeight: '100vh',
            }}
          />
        )}
      </div>

      {/* Click overlay to close */}
      <div 
        className="absolute inset-0 cursor-pointer" 
        onClick={onClose}
        style={{ zIndex: -1 }}
      />
    </div>
  );
};

export default FullscreenBanner;
