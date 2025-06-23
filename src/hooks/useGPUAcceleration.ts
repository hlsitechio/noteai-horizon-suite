
import { useState, useEffect, useCallback } from 'react';

export interface GPUCapabilities {
  webGPUSupported: boolean;
  webGLSupported: boolean;
  preferredDevice: 'webgpu' | 'webgl' | 'cpu';
  isInitialized: boolean;
}

export const useGPUAcceleration = () => {
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

  return {
    capabilities,
    checkGPUSupport,
  };
};
