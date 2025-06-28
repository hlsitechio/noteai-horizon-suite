
import React, { createContext, useContext, useState, useEffect } from 'react';
import { DynamicAccentProvider } from './DynamicAccentContext';

interface AccentColorContextType {
  accentColor: string;
  accentColorHsl: string;
  setAccentColor: (color: string, hsl: string) => void;
}

const AccentColorContext = createContext<AccentColorContextType | undefined>(undefined);

interface AccentColorProviderProps {
  children: React.ReactNode;
}

export const AccentColorProvider: React.FC<AccentColorProviderProps> = ({ children }) => {
  const [accentColor, setAccentColorState] = useState<string>('#00CFDE');
  const [accentColorHsl, setAccentColorHslState] = useState<string>('187 100% 42%');

  // Load saved color from localStorage
  useEffect(() => {
    const savedColor = localStorage.getItem('accent-color');
    const savedHsl = localStorage.getItem('accent-color-hsl');
    if (savedColor && savedHsl) {
      setAccentColorState(savedColor);
      setAccentColorHslState(savedHsl);
      applyAccentColor(savedHsl);
    }
  }, []);

  const applyAccentColor = (hsl: string) => {
    // Update CSS custom properties
    document.documentElement.style.setProperty('--accent', hsl);
    document.documentElement.style.setProperty('--primary', hsl);
    document.documentElement.style.setProperty('--sidebar-primary', hsl);
    document.documentElement.style.setProperty('--sidebar-ring', hsl);
    document.documentElement.style.setProperty('--ring', hsl);
    document.documentElement.style.setProperty('--info', hsl);
  };

  const setAccentColor = (color: string, hsl: string) => {
    setAccentColorState(color);
    setAccentColorHslState(hsl);
    localStorage.setItem('accent-color', color);
    localStorage.setItem('accent-color-hsl', hsl);
    applyAccentColor(hsl);
  };

  return (
    <AccentColorContext.Provider value={{ accentColor, accentColorHsl, setAccentColor }}>
      <DynamicAccentProvider>
        {children}
      </DynamicAccentProvider>
    </AccentColorContext.Provider>
  );
};

export const useAccentColor = () => {
  const context = useContext(AccentColorContext);
  if (context === undefined) {
    throw new Error('useAccentColor must be used within an AccentColorProvider');
  }
  return context;
};

// Export the context itself for use in App.tsx
export { AccentColorContext };
