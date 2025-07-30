
import * as React from 'react';
import { Theme, applyThemeToDocument } from '../utils/themeUtils';

type ThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
} & React.HTMLAttributes<HTMLDivElement>;

type ThemeProviderState = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
};

const initialState: ThemeProviderState = {
  theme: 'system',
  setTheme: () => null,
};

const ThemeProviderContext = React.createContext<ThemeProviderState>(initialState);

export function ThemeProvider({
  children,
  defaultTheme = 'system',
  storageKey = 'online-note-ai-theme',
}: ThemeProviderProps) {
  const [theme, setTheme] = React.useState<Theme>(() => {
    if (typeof window !== 'undefined') {
    const stored = localStorage.getItem(storageKey) as Theme;
      return stored || defaultTheme;
    }
    return defaultTheme;
  });

  React.useEffect(() => {
    // Apply theme with smooth transition
    applyThemeToDocument(theme);
  }, [theme]);

  const setThemeValue = React.useCallback((newTheme: Theme) => {
    console.log('ThemeProvider: Setting theme from', theme, 'to', newTheme);
    
    // Store the new theme immediately
    localStorage.setItem(storageKey, newTheme);
    
    // Set theme state (this will trigger the useEffect above)
    setTheme(newTheme);
  }, [storageKey, theme]);

  const value = React.useMemo(() => ({
    theme,
    setTheme: setThemeValue,
  }), [theme, setThemeValue]);

  return (
    <ThemeProviderContext.Provider value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

export const useTheme = () => {
  const context = React.useContext(ThemeProviderContext);

  if (context === undefined)
    throw new Error('useTheme must be used within a ThemeProvider');

  return context;
};
