
import React from 'react';

interface FullscreenHintProps {
  showControls: boolean;
  isVisible: boolean;
}

const FullscreenHint: React.FC<FullscreenHintProps> = ({ showControls, isVisible }) => {
  if (!isVisible) return null;

  return (
    <div className={`absolute bottom-2 left-2 z-10 transition-all duration-300 ${
      showControls ? 'opacity-100' : 'opacity-0'
    } text-white/90 text-xs bg-black/30 backdrop-blur-sm px-2 py-1 rounded-full`}>
      Click to view fullscreen
    </div>
  );
};

export default FullscreenHint;
