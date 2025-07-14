import { useEffect } from 'react';

/**
 * Hook to ensure public pages have clean default themes
 * Removes any user-specific theme classes that might be applied
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
    
    // Cleanup function to remove theme classes when component unmounts
    return () => {
      html.classList.remove(...themeClasses);
    };
  }, []);
};