import { useEffect } from 'react';
import { initializeGradientEffects, getCurrentGradientConfig } from '@/utils/gradientEffects';

/**
 * Custom hook to initialize and manage gradient effects across the application
 * Should be used in the main App component or layout to ensure consistent effects
 */
export const useGradientEffects = () => {
  useEffect(() => {
    // Initialize gradient effects when the hook mounts
    initializeGradientEffects();
    
    // Clean up function (if needed for future extensions)
    return () => {
      // Future cleanup logic can go here
    };
  }, []);

  const config = getCurrentGradientConfig();
  
  return {
    config,
    isActive: config.intensity > 0,
    category: config.intensity === 0 ? 'Disabled' : 
              config.intensity < 0.5 ? 'Subtle' :
              config.intensity < 1 ? 'Normal' : 'Enhanced'
  };
};