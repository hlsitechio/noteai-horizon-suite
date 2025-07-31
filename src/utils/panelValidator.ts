/**
 * Panel Layout Validator
 * Ensures panel sizes are valid and prevent layout warnings
 */
import React from 'react';

export interface PanelSizeConfig {
  sizes: number[];
  minSizes?: number[];
  maxSizes?: number[];
}

/**
 * Validates and normalizes panel sizes to prevent layout warnings
 */
export function validatePanelSizes(sizes: number[], minSizes?: number[]): number[] {
  if (!sizes || sizes.length === 0) {
    return [50, 50]; // Default to equal split
  }

  // Ensure all sizes are positive numbers
  const cleanSizes = sizes.map(size => {
    const numSize = Number(size);
    return isNaN(numSize) || numSize <= 0 ? 25 : numSize;
  });

  // Calculate total
  const total = cleanSizes.reduce((sum, size) => sum + size, 0);

  // If total is not 100, normalize
  if (Math.abs(total - 100) > 0.1) {
    const normalizedSizes = cleanSizes.map(size => (size / total) * 100);
    
    // Round to one decimal place and ensure they add up to 100
    const rounded = normalizedSizes.map(size => Math.round(size * 10) / 10);
    const roundedTotal = rounded.reduce((sum, size) => sum + size, 0);
    
    // Adjust the last element to ensure total is exactly 100
    if (Math.abs(roundedTotal - 100) > 0.1) {
      rounded[rounded.length - 1] = Math.round((100 - rounded.slice(0, -1).reduce((sum, size) => sum + size, 0)) * 10) / 10;
    }

    return rounded;
  }

  // Apply minimum sizes if provided
  if (minSizes && minSizes.length === cleanSizes.length) {
    const adjustedSizes = cleanSizes.map((size, index) => {
      const minSize = minSizes[index] || 10;
      return Math.max(size, minSize);
    });

    // Re-normalize if minimums were applied
    const adjustedTotal = adjustedSizes.reduce((sum, size) => sum + size, 0);
    if (Math.abs(adjustedTotal - 100) > 0.1) {
      return adjustedSizes.map(size => (size / adjustedTotal) * 100);
    }

    return adjustedSizes;
  }

  return cleanSizes;
}

/**
 * Creates default panel sizes for a given number of panels
 */
export function createDefaultPanelSizes(panelCount: number): number[] {
  if (panelCount <= 0) return [100];
  
  const equalSize = Math.round((100 / panelCount) * 10) / 10;
  const sizes = new Array(panelCount).fill(equalSize);
  
  // Ensure total is exactly 100
  const total = sizes.reduce((sum, size) => sum + size, 0);
  if (Math.abs(total - 100) > 0.1) {
    sizes[sizes.length - 1] = Math.round((100 - sizes.slice(0, -1).reduce((sum, size) => sum + size, 0)) * 10) / 10;
  }
  
  return sizes;
}

/**
 * Converts percentage sizes to CSS-compatible format
 */
export function sizesToCSSPercentages(sizes: number[]): string[] {
  const validSizes = validatePanelSizes(sizes);
  return validSizes.map(size => `${size}%`);
}

/**
 * Safe panel size hook for React components
 */
export function useSafePanelSizes(initialSizes: number[], minSizes?: number[]) {
  const [sizes, setSizes] = React.useState(() => validatePanelSizes(initialSizes, minSizes));

  const updateSizes = React.useCallback((newSizes: number[]) => {
    const validatedSizes = validatePanelSizes(newSizes, minSizes);
    setSizes(validatedSizes);
    return validatedSizes;
  }, [minSizes]);

  return [sizes, updateSizes] as const;
}

export default {
  validatePanelSizes,
  createDefaultPanelSizes,
  sizesToCSSPercentages,
  useSafePanelSizes
};