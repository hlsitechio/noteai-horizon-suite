
import React, { useState } from 'react';
import { motion } from 'framer-motion';

type Orientation = 'portrait' | 'landscape';

interface SamsungS25UltraFrameProps {
  children: React.ReactNode;
}

const SamsungS25UltraFrame: React.FC<SamsungS25UltraFrameProps> = ({ children }) => {
  const [orientation, setOrientation] = useState<Orientation>('portrait');
  const isLandscape = orientation === 'landscape';

  const frameClasses = isLandscape
    ? 'w-[780px] h-[360px] rounded-[50px]'
    : 'w-[360px] h-[780px] rounded-[50px]';

  const screenClasses = isLandscape
    ? 'rounded-[36px]'
    : 'rounded-[36px]';

  const cameraPosition = isLandscape
    ? 'top-1/2 left-[10px] transform -translate-y-1/2 flex-col'
    : 'top-[10px] left-1/2 transform -translate-x-1/2 flex-col';

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="flex flex-col justify-center items-center p-8 bg-[#060517] min-h-screen gap-4"
    >
      {/* Toggle Button */}
      <button
        onClick={() => setOrientation(orientation === 'portrait' ? 'landscape' : 'portrait')}
        className="text-sm px-4 py-2 rounded bg-[#61699E] text-white hover:bg-[#48454D] transition"
      >
        Rotate to {orientation === 'portrait' ? 'Landscape' : 'Portrait'}
      </button>

      {/* Phone Frame */}
      <motion.div
        layout
        className={`relative ${frameClasses} border-[14px] border-[#3a3a3f] bg-gradient-to-b from-[#1b1b1d] to-[#101013] shadow-2xl overflow-hidden`}
      >
        {/* Outer Glow & Glass effect */}
        <div className="absolute inset-0 rounded-[42px] border border-[#61699E]/30 shadow-inner shadow-[#58A6D0]/10 z-10 pointer-events-none" />

        {/* Speaker and camera layout */}
        <div className={`absolute ${cameraPosition} flex items-center gap-1 z-20`}>
          {/* Speaker grill */}
          <div className={isLandscape ? 'h-[60px] w-[4px] rounded-full bg-[#48454D]' : 'w-[60px] h-[4px] rounded-full bg-[#48454D]'} />
          {/* Hole-punch camera */}
          <div className="w-[8px] h-[8px] bg-[#27202C] rounded-full" />
        </div>

        {/* Screen */}
        <div className={`absolute top-0 left-0 w-full h-full bg-[#BBBBc7] ${screenClasses} overflow-hidden z-0`}>
          {children}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default SamsungS25UltraFrame;
