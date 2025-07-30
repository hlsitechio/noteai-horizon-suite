
import React from 'react';
import { motion } from 'framer-motion';
import { Slider } from '@/components/ui/slider';

interface FocusModeBackgroundProps {
  backgroundOpacity: number[];
  onBackgroundOpacityChange: (value: number[]) => void;
  isControlsVisible: boolean;
  isZenMode: boolean;
  isBackgroundHidden: boolean;
  onClose: () => void;
}

const FocusModeBackground: React.FC<FocusModeBackgroundProps> = ({
  backgroundOpacity,
  onBackgroundOpacityChange,
  isControlsVisible,
  isZenMode,
  isBackgroundHidden,
  onClose,
}) => {
  return (
    <>
      {/* Dynamic Blurred Background - Hidden when opacity is 100% */}
      {!isBackgroundHidden && (
        <motion.div 
          className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900"
          style={{ 
            backdropFilter: `blur(${Math.max(10, backgroundOpacity[0] / 10)}px)`,
            opacity: backgroundOpacity[0] / 100 
          }}
          onClick={!isZenMode ? onClose : undefined}
        />
      )}
      
      {/* Ambient Background Effects - Hidden when opacity is 100% */}
      {!isBackgroundHidden && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div 
            className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-full blur-3xl"
            animate={{ 
              x: [0, 100, 0],
              y: [0, -50, 0],
              scale: [1, 1.2, 1]
            }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          />
          <motion.div 
            className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-pink-500/10 to-orange-500/10 rounded-full blur-3xl"
            animate={{ 
              x: [0, -80, 0],
              y: [0, 60, 0],
              scale: [1, 0.8, 1]
            }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          />
        </div>
      )}

      {/* Floating Background Opacity Control */}
      {isControlsVisible && !isZenMode && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 20 }}
          className="absolute bottom-6 right-6 bg-black/20 backdrop-blur-xl rounded-2xl p-4"
        >
          <div className="flex items-center gap-3 text-white/80">
            <span className="text-sm font-medium">Ambience</span>
            <Slider
              value={backgroundOpacity}
              onValueChange={onBackgroundOpacityChange}
              max={100}
              min={60}
              step={5}
              className="w-24"
            />
          </div>
        </motion.div>
      )}
    </>
  );
};

export default FocusModeBackground;
