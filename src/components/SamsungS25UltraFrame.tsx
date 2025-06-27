
import React from 'react';
import { motion } from 'framer-motion';

interface SamsungS25UltraFrameProps {
  children: React.ReactNode;
}

const SamsungS25UltraFrame: React.FC<SamsungS25UltraFrameProps> = ({ children }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="flex justify-center items-center min-h-screen bg-[#060517] p-4"
    >
      {/* Phone Frame - Portrait Only */}
      <div className="relative w-[360px] h-[780px] rounded-[50px] border-[14px] border-[#3a3a3f] bg-gradient-to-b from-[#1b1b1d] to-[#101013] shadow-2xl overflow-hidden">
        {/* Outer Glow & Glass effect */}
        <div className="absolute inset-0 rounded-[42px] border border-[#61699E]/30 shadow-inner shadow-[#58A6D0]/10 z-10 pointer-events-none" />

        {/* Speaker and camera layout */}
        <div className="absolute top-[10px] left-1/2 transform -translate-x-1/2 flex items-center gap-1 z-20">
          {/* Speaker grill */}
          <div className="w-[60px] h-[4px] rounded-full bg-[#48454D]" />
          {/* Hole-punch camera */}
          <div className="w-[8px] h-[8px] bg-[#27202C] rounded-full" />
        </div>

        {/* Screen */}
        <div className="absolute top-0 left-0 w-full h-full bg-background rounded-[36px] overflow-hidden z-0">
          {children}
        </div>
      </div>
    </motion.div>
  );
};

export default SamsungS25UltraFrame;
