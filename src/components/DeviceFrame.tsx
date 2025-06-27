
import React from 'react';
import SamsungS25UltraFrame from './SamsungS25UltraFrame';

interface DeviceFrameProps {
  children: React.ReactNode;
  className?: string;
}

const DeviceFrame: React.FC<DeviceFrameProps> = ({ children, className = '' }) => {
  return (
    <div className={`flex items-center justify-center min-h-screen w-full bg-[#060517] ${className}`}>
      <SamsungS25UltraFrame>
        <div className="h-full w-full bg-background overflow-hidden">
          {children}
        </div>
      </SamsungS25UltraFrame>
    </div>
  );
};

export default DeviceFrame;
