
export type Theme = 'dark' | 'light' | 'system';

// List of all available theme classes
export const THEME_CLASSES = [
  'theme-pristine',
  'theme-pearl', 
  'theme-crystal',
  'theme-lavender',
  'theme-rose',
  'theme-mint',
  'theme-midnight',
  'theme-emerald',
  'theme-violet',
  'theme-sunset'
];

export const getSystemTheme = (): 'dark' | 'light' => {
  if (typeof window === 'undefined') return 'light';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

export const getResolvedTheme = (theme: Theme): 'dark' | 'light' => {
  if (theme === 'system') {
    return getSystemTheme();
  }
  return theme;
};

export const applyThemeToDocument = (theme: Theme) => {
  const root = window.document.documentElement;
  const resolvedTheme = getResolvedTheme(theme);
  
  // Add transition class for smooth theme change
  root.classList.add('theme-transitioning');
  
  // Add a small delay to start the fade effect
  setTimeout(() => {
    // Only remove basic light/dark classes, preserve custom theme classes
    root.classList.remove('light', 'dark');
    
    // Apply the resolved theme
    root.classList.add(resolvedTheme);
    
    // Remove transition class after animation completes
    setTimeout(() => {
      root.classList.remove('theme-transitioning');
    }, 400); // Match CSS transition duration
  }, 50); // Small delay for smooth start
  
  return resolvedTheme;
};

export const applyCustomTheme = (themeClass: string, mode: 'dark' | 'light' = 'light') => {
  const root = window.document.documentElement;
  
  // Remove existing theme classes
  root.classList.remove('light', 'dark', ...THEME_CLASSES);
  
  // Add the custom theme class and mode
  if (themeClass && THEME_CLASSES.includes(themeClass)) {
    root.classList.add(themeClass);
  }
  root.classList.add(mode);
  
  return { themeClass, mode };
};

export const toggleTheme = (currentTheme: Theme): Theme => {
  // Simple toggle between light and dark (ignore system for toggle)
  const resolvedTheme = getResolvedTheme(currentTheme);
  return resolvedTheme === 'dark' ? 'light' : 'dark';
};

export const isDarkMode = (theme: Theme): boolean => {
  return getResolvedTheme(theme) === 'dark';
};
