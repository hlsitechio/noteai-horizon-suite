// Gradient Effects Utility System
// Provides cross-page consistency and dynamic gradient management

export interface GradientConfig {
  intensity: number;
  gradientIntensity: number;
  glowIntensity: number;
  holographicOpacity: number;
  neuralGlowIntensity: number;
}

export const DEFAULT_GRADIENT_CONFIG: GradientConfig = {
  intensity: 1.0,
  gradientIntensity: 1.0,
  glowIntensity: 1.0,
  holographicOpacity: 0.8,
  neuralGlowIntensity: 0.6,
};

/**
 * Apply gradient effects system-wide
 * This function ensures all pages have consistent gradient and glow effects
 */
export const applyGradientEffects = (intensity: number): void => {
  const root = document.documentElement;
  
  // Core intensity variables
  root.style.setProperty('--glow-intensity', intensity.toString());
  root.style.setProperty('--gradient-intensity', intensity.toString());
  root.style.setProperty('--gradient-opacity-multiplier', intensity.toString());
  
  // Extended glow properties
  root.style.setProperty('--glow-opacity', (intensity * 0.8).toString());
  root.style.setProperty('--glow-blur', `${intensity * 20}px`);
  root.style.setProperty('--glow-spread', `${intensity * 10}px`);
  
  // Dynamic shadow system
  const shadowIntensityFactor = Math.max(0.1, intensity);
  root.style.setProperty('--shadow-glow', `0 0 ${shadowIntensityFactor * 60}px hsl(var(--primary) / ${shadowIntensityFactor * 0.4})`);
  root.style.setProperty('--shadow-elegant', `0 ${shadowIntensityFactor * 15}px ${shadowIntensityFactor * 35}px ${-shadowIntensityFactor * 5}px hsl(var(--foreground) / ${shadowIntensityFactor * 0.12})`);
  root.style.setProperty('--shadow-premium', `0 ${shadowIntensityFactor * 25}px ${shadowIntensityFactor * 50}px ${-shadowIntensityFactor * 12}px hsl(var(--primary) / ${shadowIntensityFactor * 0.3})`);
  root.style.setProperty('--shadow-soft', `0 ${shadowIntensityFactor * 4}px ${shadowIntensityFactor * 20}px hsl(var(--foreground) / ${shadowIntensityFactor * 0.08})`);
  root.style.setProperty('--shadow-inner', `inset 0 ${shadowIntensityFactor * 2}px ${shadowIntensityFactor * 10}px hsl(var(--foreground) / ${shadowIntensityFactor * 0.1})`);
  root.style.setProperty('--shadow-primary-glow', `0 0 ${shadowIntensityFactor * 40}px hsl(var(--primary) / ${shadowIntensityFactor * 0.5})`);
  
  // Special effects
  applyHolographicEffects(intensity);
  applyAnimationEffects(intensity);
  updateGradientClasses(intensity);
};

/**
 * Apply holographic and neural effects
 */
export const applyHolographicEffects = (intensity: number): void => {
  const root = document.documentElement;
  
  const neuralIntensity = intensity * 0.6;
  root.style.setProperty('--neural-glow-intensity', neuralIntensity.toString());
  root.style.setProperty('--holographic-opacity', (intensity * 0.8).toString());
  
  // Update neural nodes if they exist
  const neuralNodes = document.querySelectorAll('.neural-node');
  neuralNodes.forEach(node => {
    (node as HTMLElement).style.setProperty('--node-intensity', neuralIntensity.toString());
  });
};

/**
 * Apply animation intensity effects
 */
export const applyAnimationEffects = (intensity: number): void => {
  const root = document.documentElement;
  
  root.style.setProperty('--pulse-intensity', intensity.toString());
  root.style.setProperty('--glow-animation-intensity', intensity.toString());
  root.style.setProperty('--border-glow-intensity', (intensity * 0.7).toString());
};

/**
 * Update dynamic gradient classes based on intensity
 */
export const updateGradientClasses = (intensity: number): void => {
  const gradientElements = document.querySelectorAll('[data-gradient-responsive]');
  
  gradientElements.forEach(element => {
    const htmlElement = element as HTMLElement;
    const gradientType = htmlElement.dataset.gradientType || 'primary';
    
    // Apply dynamic gradient classes based on intensity
    if (intensity === 0) {
      htmlElement.classList.remove('bg-gradient-to-r', 'bg-gradient-to-br', 'bg-gradient-to-bl');
      htmlElement.classList.add('bg-muted');
    } else if (intensity < 0.5) {
      htmlElement.style.setProperty('--gradient-opacity', '0.3');
    } else if (intensity > 1.2) {
      htmlElement.classList.add('premium-gradient-enhanced');
    }
  });
};

/**
 * Initialize gradient effects system on page load
 */
export const initializeGradientEffects = (): void => {
  const savedIntensity = localStorage.getItem('glow-effect-intensity');
  const intensity = savedIntensity ? parseInt(savedIntensity, 10) / 100 : 1.0;
  
  applyGradientEffects(intensity);
  
  // Set up mutation observer for dynamic content
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        if (node.nodeType === Node.ELEMENT_NODE) {
          const element = node as Element;
          if (element.hasAttribute('data-gradient-responsive')) {
            updateGradientClasses(intensity);
          }
        }
      });
    });
  });
  
  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
};

/**
 * Get current gradient configuration
 */
export const getCurrentGradientConfig = (): GradientConfig => {
  const savedIntensity = localStorage.getItem('glow-effect-intensity');
  const intensity = savedIntensity ? parseInt(savedIntensity, 10) / 100 : 1.0;
  
  return {
    intensity,
    gradientIntensity: intensity,
    glowIntensity: intensity,
    holographicOpacity: intensity * 0.8,
    neuralGlowIntensity: intensity * 0.6,
  };
};

/**
 * Save gradient configuration
 */
export const saveGradientConfig = (config: Partial<GradientConfig>): void => {
  const currentConfig = getCurrentGradientConfig();
  const newConfig = { ...currentConfig, ...config };
  
  localStorage.setItem('glow-effect-intensity', Math.round(newConfig.intensity * 100).toString());
  applyGradientEffects(newConfig.intensity);
};

/**
 * Calculate intensity from percentage
 */
export const calculateIntensityFromPercentage = (percentage: number): number => {
  return Math.max(0, Math.min(1.5, percentage / 100));
};

/**
 * Get intensity category for UI display
 */
export const getIntensityCategory = (percentage: number): string => {
  if (percentage === 0) return 'Disabled';
  if (percentage < 50) return 'Subtle';
  if (percentage < 100) return 'Normal';
  if (percentage <= 150) return 'Enhanced';
  return 'Maximum';
};

/**
 * Gradient utility classes for dynamic application
 */
export const GRADIENT_CLASSES = {
  primary: 'bg-gradient-to-r from-primary/10 to-primary/5',
  secondary: 'bg-gradient-to-br from-secondary/10 to-accent/5',
  hero: 'bg-gradient-to-br from-primary/5 to-accent/3',
  premium: 'bg-gradient-to-r from-primary to-accent',
  glass: 'bg-gradient-to-br from-background/70 to-background/30',
  holographic: 'bg-gradient-to-r from-primary via-accent to-secondary',
} as const;

export type GradientType = keyof typeof GRADIENT_CLASSES;