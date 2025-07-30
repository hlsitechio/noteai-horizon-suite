/**
 * Style and CSS utilities for enhanced development workflow
 */

/**
 * Optimized CSS variable getter with caching
 */
const cssVarCache = new Map<string, string>();

export function getCSSVariable(variableName: string, element?: HTMLElement): string {
  const cacheKey = `${variableName}-${element?.tagName || 'root'}`;
  
  if (cssVarCache.has(cacheKey)) {
    return cssVarCache.get(cacheKey)!;
  }
  
  const value = getComputedStyle(element || document.documentElement)
    .getPropertyValue(variableName)
    .trim();
  
  cssVarCache.set(cacheKey, value);
  return value;
}

/**
 * Efficient responsive breakpoint utilities
 */
export const breakpoints = {
  xs: 475,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1400,
} as const;

export type Breakpoint = keyof typeof breakpoints;

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = React.useState(false);
  
  React.useEffect(() => {
    const media = matchMedia(query);
    setMatches(media.matches);
    
    const listener = (e: MediaQueryListEvent) => setMatches(e.matches);
    media.addEventListener('change', listener);
    
    return () => media.removeEventListener('change', listener);
  }, [query]);
  
  return matches;
}

export function useBreakpoint(breakpoint: Breakpoint): boolean {
  return useMediaQuery(`(min-width: ${breakpoints[breakpoint]}px)`);
}

/**
 * Theme-aware color utilities
 */
export function getThemeColor(colorVar: string): string {
  return `hsl(${getCSSVariable(`--${colorVar}`)})`;
}

export function createThemeColorVariant(baseColor: string, opacity: number): string {
  const hslValue = getCSSVariable(`--${baseColor}`);
  return `hsl(${hslValue} / ${opacity})`;
}

/**
 * Animation utilities for consistent timing
 */
export const animations = {
  fast: 'var(--timing-fast, 150ms)',
  base: 'var(--timing-base, 300ms)',
  slow: 'var(--timing-slow, 500ms)',
  slower: 'var(--timing-slower, 750ms)',
} as const;

export const easings = {
  smooth: 'var(--easing-smooth, cubic-bezier(0.4, 0, 0.2, 1))',
  bounce: 'var(--easing-bounce, cubic-bezier(0.68, -0.55, 0.265, 1.55))',
  elastic: 'var(--easing-elastic, cubic-bezier(0.68, -0.6, 0.32, 1.6))',
} as const;

/**
 * Layout utilities
 */
export function createFlexCenter(direction: 'row' | 'column' = 'row') {
  return {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: direction,
  };
}

export function createGridAutoFit(minSize: string = '250px', gap: string = '1rem') {
  return {
    display: 'grid',
    gridTemplateColumns: `repeat(auto-fit, minmax(${minSize}, 1fr))`,
    gap,
  };
}

/**
 * Typography utilities
 */
export const typography = {
  hero: {
    fontSize: 'var(--font-size-hero, 3.5rem)',
    fontWeight: 'var(--font-weight-bold, 700)',
    lineHeight: '1.1',
  },
  display: {
    fontSize: 'var(--font-size-display, 2.5rem)',
    fontWeight: 'var(--font-weight-semibold, 600)',
    lineHeight: '1.2',
  },
  headline: {
    fontSize: 'var(--font-size-headline, 1.5rem)',
    fontWeight: 'var(--font-weight-medium, 500)',
    lineHeight: '1.3',
  },
} as const;

import React from 'react';