import { useEffect } from 'react';

/**
 * Hook to ensure public pages have clean default themes
 * Now mostly redundant due to ConditionalThemeProvider
 * but kept for additional safety and backwards compatibility
 */
export const usePublicPageTheme = () => {
  useEffect(() => {
    const html = document.documentElement;
    
    // Remove all user theme classes from public pages
    const themeClasses = [
      'theme-default',
      'theme-midnight', 
      'theme-emerald',
      'theme-violet',
      'theme-sunset',
      'theme-pure-black',
      'theme-clean-default'
    ];
    
    html.classList.remove(...themeClasses);
    
    // Ensure we're using system theme only
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    html.classList.remove('light', 'dark');
    html.classList.add(systemTheme);
    
    // Cleanup function to remove theme classes when component unmounts
    return () => {
      html.classList.remove(...themeClasses);
    };
  }, []);
};