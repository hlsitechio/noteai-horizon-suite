
import React, { createContext, useContext, ReactNode } from 'react';
import { useState, useEffect, useCallback } from 'react';

export interface GPUCapabilities {
  webGPUSupported: boolean;
  webGLSupported: boolean;
  preferredDevice: 'webgpu' | 'webgl' | 'cpu';
  isInitialized: boolean;
}

interface GPUAccelerationContextType {
  capabilities: GPUCapabilities;
  checkGPUSupport: () => Promise<GPUCapabilities>;
}

const GPUAccelerationContext = createContext<GPUAccelerationContextType | undefined>(undefined);

export const GPUAccelerationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [capabilities, setCapabilities] = useState<GPUCapabilities>({
    webGPUSupported: false,
    webGLSupported: false,
    preferredDevice: 'cpu',
    isInitialized: false,
  });

  const checkGPUSupport = useCallback(async () => {
    console.log('Checking GPU acceleration support...');
    
    // Check WebGPU support
    const webGPUSupported = 'gpu' in navigator && navigator.gpu !== undefined;
    
    // Check WebGL support
    const canvas = document.createElement('canvas');
    const webGLSupported = !!(
      canvas.getContext('webgl') || canvas.getContext('experimental-webgl')
    );

    let preferredDevice: 'webgpu' | 'webgl' | 'cpu' = 'cpu';
    
    if (webGPUSupported) {
      try {
        const adapter = await navigator.gpu?.requestAdapter();
        if (adapter) {
          preferredDevice = 'webgpu';
          console.log('WebGPU is available and preferred');
        }
      } catch (error) {
        console.log('WebGPU adapter request failed:', error);
      }
    }
    
    if (preferredDevice === 'cpu' && webGLSupported) {
      preferredDevice = 'webgl';
      console.log('WebGL is available and will be used');
    }

    const newCapabilities = {
      webGPUSupported,
      webGLSupported,
      preferredDevice,
      isInitialized: true,
    };

    setCapabilities(newCapabilities);
    console.log('GPU capabilities:', newCapabilities);
    
    return newCapabilities;
  }, []);

  useEffect(() => {
    checkGPUSupport();
  }, [checkGPUSupport]);

  return (
    <GPUAccelerationContext.Provider value={{ capabilities, checkGPUSupport }}>
      {children}
    </GPUAccelerationContext.Provider>
  );
};

export const useGPUAcceleration = () => {
  const context = useContext(GPUAccelerationContext);
  if (!context) {
    throw new Error('useGPUAcceleration must be used within a GPUAccelerationProvider');
  }
  return context;
};
