
import React from 'react';
import { DeviceFrameset } from 'react-device-frameset';
import 'react-device-frameset/styles/marvel-devices.min.css';

interface DeviceFrameProps {
  children: React.ReactNode;
  className?: string;
}

const DeviceFrame: React.FC<DeviceFrameProps> = ({ children, className = '' }) => {
  // Add custom styles to remove glowing border
  React.useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      .marvel-device .screen::after {
        display: none !important;
      }
      .marvel-device .screen {
        border: none !important;
        box-shadow: none !important;
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return (
    <div className={`flex items-center justify-center min-h-screen w-full bg-background ${className}`}>
      <div className="relative">
        <DeviceFrameset 
          device="Galaxy Note 8"
          zoom={0.8}
        >
          <div className="h-full w-full bg-background overflow-hidden border-0 shadow-none">
            {children}
          </div>
        </DeviceFrameset>
      </div>
    </div>
  );
};

export default DeviceFrame;
