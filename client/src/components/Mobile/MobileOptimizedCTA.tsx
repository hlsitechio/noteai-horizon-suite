import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Smartphone, Monitor, Tablet, Zap, Star, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { safeSendAnalyticsEvent } from '@/utils/safeAnalytics';

interface MobileOptimizedCTAProps {
  isVisible: boolean;
  onClose: () => void;
}

const MobileOptimizedCTA: React.FC<MobileOptimizedCTAProps> = ({ isVisible, onClose }) => {
  const [deviceType, setDeviceType] = useState<'mobile' | 'tablet' | 'desktop'>('desktop');

  useEffect(() => {
    const checkDevice = () => {
      const width = window.innerWidth;
      if (width < 768) setDeviceType('mobile');
      else if (width < 1024) setDeviceType('tablet');
      else setDeviceType('desktop');
    };

    checkDevice();
    window.addEventListener('resize', checkDevice);
    return () => window.removeEventListener('resize', checkDevice);
  }, []);

  const handleCTAClick = () => {
    safeSendAnalyticsEvent('mobile_cta_clicked', { device_type: deviceType });
    // Navigate to signup
    window.location.href = '/register';
  };

  if (!isVisible || deviceType === 'desktop') return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        className="fixed bottom-0 left-0 right-0 z-50 bg-gradient-to-r from-primary to-primary/90 text-primary-foreground p-4 shadow-2xl border-t border-primary/20"
      >
        <div className="flex items-center justify-between max-w-sm mx-auto">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              {deviceType === 'mobile' && <Smartphone className="w-4 h-4" />}
              {deviceType === 'tablet' && <Tablet className="w-4 h-4" />}
              <span className="font-semibold text-sm">Perfect for {deviceType}!</span>
            </div>
            <p className="text-xs opacity-90">
              Join 75K+ professionals on-the-go
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              onClick={handleCTAClick}
              className="bg-white text-primary hover:bg-white/90 font-semibold text-xs px-4"
            >
              Start Free
              <ArrowRight className="w-3 h-3 ml-1" />
            </Button>
            
            <button
              onClick={onClose}
              className="text-primary-foreground/70 hover:text-primary-foreground p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default MobileOptimizedCTA;