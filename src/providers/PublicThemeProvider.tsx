import React from 'react';

type PublicThemeProviderProps = {
  children: React.ReactNode;
};

/**
 * A minimal theme provider for public pages
 * Always uses system theme without user preferences
 */
export function PublicThemeProvider({ children }: PublicThemeProviderProps) {
  React.useEffect(() => {
    const root = window.document.documentElement;
    
    // Remove any user theme classes
    const themeClasses = [
      'theme-default',
      'theme-midnight', 
      'theme-emerald',
      'theme-violet',
      'theme-sunset',
      'theme-pure-black',
      'theme-clean-default'
    ];
    
    root.classList.remove(...themeClasses);
    
    // Apply system theme only
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    root.classList.remove('light', 'dark');
    root.classList.add(systemTheme);
    
    // Listen for system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      const newTheme = e.matches ? 'dark' : 'light';
      root.classList.remove('light', 'dark');
      root.classList.add(newTheme);
    };
    
    mediaQuery.addEventListener('change', handleChange);
    
    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, []);

  return <>{children}</>;
}