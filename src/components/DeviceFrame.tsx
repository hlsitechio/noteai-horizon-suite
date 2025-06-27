
import React from 'react';
import { DeviceFrameset } from 'react-device-frameset';
import 'react-device-frameset/styles/marvel-devices.min.css';

interface DeviceFrameProps {
  children: React.ReactNode;
  className?: string;
}

const DeviceFrame: React.FC<DeviceFrameProps> = ({ children, className = '' }) => {
  return (
    <div className={`relative mx-auto ${className}`}>
      <DeviceFrameset 
        device="Galaxy Note 8"
        zoom={0.8}
      >
        <div className="h-full w-full bg-background overflow-hidden">
          {children}
        </div>
      </DeviceFrameset>
    </div>
  );
};

export default DeviceFrame;
