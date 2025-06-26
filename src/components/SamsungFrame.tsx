
import React from 'react';

interface SamsungFrameProps {
  children: React.ReactNode;
  className?: string;
}

const SamsungFrame: React.FC<SamsungFrameProps> = ({ children, className = '' }) => {
  return (
    <div className={`relative mx-auto ${className}`} style={{ width: '320px', height: '640px' }}>
      {/* Samsung Galaxy Frame */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-800 to-gray-900 rounded-[2.5rem] p-3 shadow-2xl">
        {/* Speaker */}
        <div className="absolute top-6 left-1/2 transform -translate-x-1/2 w-16 h-1 bg-gray-700 rounded-full"></div>
        
        {/* Camera */}
        <div className="absolute top-4 right-8 w-2 h-2 bg-gray-700 rounded-full"></div>
        
        {/* Screen */}
        <div className="w-full h-full bg-black rounded-[2rem] overflow-hidden relative">
          {/* Status Bar */}
          <div className="absolute top-0 left-0 right-0 h-6 bg-black z-10 flex items-center justify-between px-4 text-white text-xs">
            <span>9:41</span>
            <div className="flex items-center gap-1">
              <div className="w-4 h-2 border border-white rounded-sm">
                <div className="w-3 h-1 bg-white rounded-sm"></div>
              </div>
            </div>
          </div>
          
          {/* App Content */}
          <div className="pt-6 h-full">
            {children}
          </div>
          
          {/* Home Indicator */}
          <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-gray-400 rounded-full"></div>
        </div>
      </div>
    </div>
  );
};

export default SamsungFrame;
