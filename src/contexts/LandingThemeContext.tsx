import React, { createContext, useContext, useState, useEffect } from 'react';

export interface LandingTheme {
  id: string;
  name: string;
  description: string;
  icon: string;
  featured?: boolean;
  category: 'dark' | 'light';
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    muted: string;
  };
  gradient: string;
  buttonStyle: string;
  fonts: {
    heading: string;
    body: string;
    mono: string;
  };
  backgroundGradient: string;
}

export const landingThemes: LandingTheme[] = [
  {
    id: 'quantum-aurora',
    name: 'Quantum Aurora',
    description: 'Our signature cyberpunk-inspired dark theme',
    icon: '⚡',
    featured: true,
    category: 'dark',
    colors: {
      primary: '142 70% 60%', // softer green for better readability
      secondary: '60 80% 65%', // softer yellow
      accent: '300 60% 70%', // softer magenta
      muted: '180 40% 70%', // muted cyan
    },
    gradient: 'linear-gradient(135deg, hsl(142 100% 15%) 0%, hsl(300 100% 15%) 50%, hsl(60 100% 15%) 100%)',
    buttonStyle: 'bg-gradient-to-r from-green-500 to-yellow-500 hover:from-green-600 hover:to-yellow-600',
    fonts: {
      heading: 'Orbitron',
      body: 'Exo 2',
      mono: 'JetBrains Mono'
    },
    backgroundGradient: 'linear-gradient(135deg, hsl(142 15% 8%) 0%, hsl(0 0% 5%) 50%, hsl(300 10% 8%) 100%)'
  },
  {
    id: 'midnight-blue',
    name: 'Midnight Blue',
    description: 'Deep oceanic blues with ethereal accents',
    icon: '🌊',
    category: 'dark',
    colors: {
      primary: '220 80% 65%', // softer blue
      secondary: '200 70% 70%', // lighter, softer blue
      accent: '240 60% 75%', // accessible light blue
      muted: '210 30% 75%', // good contrast gray-blue
    },
    gradient: 'linear-gradient(135deg, hsl(220 40% 15%) 0%, hsl(240 30% 18%) 50%, hsl(200 30% 20%) 100%)',
    buttonStyle: 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700',
    fonts: {
      heading: 'Inter',
      body: 'Inter',
      mono: 'JetBrains Mono'
    },
    backgroundGradient: 'linear-gradient(135deg, hsl(220 40% 8%) 0%, hsl(0 0% 5%) 50%, hsl(240 20% 10%) 100%)'
  },
  {
    id: 'emerald-forest',
    name: 'Emerald Forest',
    description: 'Rich forest greens with natural depth',
    icon: '🌲',
    category: 'dark',
    colors: {
      primary: '120 60% 55%', // accessible forest green
      secondary: '140 50% 60%', // softer emerald
      accent: '160 40% 65%', // muted light green
      muted: '120 20% 70%', // good contrast muted green
    },
    gradient: 'linear-gradient(135deg, hsl(120 30% 12%) 0%, hsl(140 25% 15%) 50%, hsl(160 20% 18%) 100%)',
    buttonStyle: 'bg-gradient-to-r from-green-600 to-emerald-500 hover:from-green-700 hover:to-emerald-600',
    fonts: {
      heading: 'Exo 2',
      body: 'Inter',
      mono: 'JetBrains Mono'
    },
    backgroundGradient: 'linear-gradient(135deg, hsl(120 30% 8%) 0%, hsl(0 0% 5%) 50%, hsl(140 15% 10%) 100%)'
  },
  {
    id: 'violet-storm',
    name: 'Violet Storm',
    description: 'Mystical purples with electric energy',
    icon: '⚡',
    category: 'dark',
    colors: {
      primary: '270 70% 65%', // accessible purple
      secondary: '280 60% 70%', // softer light purple
      accent: '260 50% 75%', // good contrast lighter purple
      muted: '270 25% 75%', // accessible light purple-gray
    },
    gradient: 'linear-gradient(135deg, hsl(270 35% 15%) 0%, hsl(280 30% 18%) 50%, hsl(260 25% 20%) 100%)',
    buttonStyle: 'bg-gradient-to-r from-purple-500 to-violet-600 hover:from-purple-600 hover:to-violet-700',
    fonts: {
      heading: 'Orbitron',
      body: 'Inter',
      mono: 'JetBrains Mono'
    },
    backgroundGradient: 'linear-gradient(135deg, hsl(270 35% 8%) 0%, hsl(0 0% 5%) 50%, hsl(280 20% 10%) 100%)'
  },
  {
    id: 'orange-sunset',
    name: 'Orange Sunset',
    description: 'Warm sunset hues with fiery accents',
    icon: '🌅',
    category: 'dark',
    colors: {
      primary: '30 80% 60%', // accessible orange
      secondary: '45 70% 65%', // softer yellow-orange
      accent: '15 60% 70%', // good contrast light orange
      muted: '30 30% 75%', // accessible light orange-gray
    },
    gradient: 'linear-gradient(135deg, hsl(30 40% 15%) 0%, hsl(45 30% 18%) 50%, hsl(15 25% 20%) 100%)',
    buttonStyle: 'bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600',
    fonts: {
      heading: 'Exo 2',
      body: 'Inter',
      mono: 'JetBrains Mono'
    },
    backgroundGradient: 'linear-gradient(135deg, hsl(30 40% 8%) 0%, hsl(0 0% 5%) 50%, hsl(45 25% 10%) 100%)'
  },
  {
    id: 'crimson-shadow',
    name: 'Crimson Shadow',
    description: 'Deep crimson reds with shadowy elegance',
    icon: '🔥',
    category: 'dark',
    colors: {
      primary: '0 70% 60%', // accessible red
      secondary: '350 60% 65%', // softer pink-red
      accent: '10 50% 70%', // good contrast light red
      muted: '0 25% 75%', // accessible light red-gray
    },
    gradient: 'linear-gradient(135deg, hsl(0 40% 15%) 0%, hsl(350 30% 18%) 50%, hsl(10 25% 20%) 100%)',
    buttonStyle: 'bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700',
    fonts: {
      heading: 'Orbitron',
      body: 'Inter',
      mono: 'JetBrains Mono'
    },
    backgroundGradient: 'linear-gradient(135deg, hsl(0 40% 8%) 0%, hsl(0 0% 5%) 50%, hsl(350 20% 10%) 100%)'
  },
  // Light Themes
  {
    id: 'pristine-white',
    name: 'Pristine White',
    description: 'Ultra clean and minimal design',
    icon: '✨',
    featured: true,
    category: 'light',
    colors: {
      primary: '220 100% 50%', // blue
      secondary: '200 100% 40%', // darker blue
      accent: '240 100% 60%', // lighter blue
      muted: '210 15% 60%', // gray
    },
    gradient: 'linear-gradient(135deg, hsl(0 0% 98%) 0%, hsl(210 20% 95%) 100%)',
    buttonStyle: 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700',
    fonts: {
      heading: 'Inter',
      body: 'Inter',
      mono: 'JetBrains Mono'
    },
    backgroundGradient: 'radial-gradient(ellipse at top, hsl(210 20% 98%) 0%, hsl(0 0% 100%) 50%)'
  },
  {
    id: 'lavender-breeze',
    name: 'Lavender Breeze',
    description: 'Soft purple whites with gentle elegance',
    icon: '🌸',
    category: 'light',
    colors: {
      primary: '270 100% 50%', // purple
      secondary: '280 80% 40%', // darker purple
      accent: '260 90% 60%', // lighter purple
      muted: '270 15% 60%', // gray-purple
    },
    gradient: 'linear-gradient(135deg, hsl(270 20% 98%) 0%, hsl(280 15% 95%) 100%)',
    buttonStyle: 'bg-gradient-to-r from-purple-500 to-violet-600 hover:from-purple-600 hover:to-violet-700',
    fonts: {
      heading: 'Exo 2',
      body: 'Inter',
      mono: 'JetBrains Mono'
    },
    backgroundGradient: 'radial-gradient(ellipse at top, hsl(270 20% 98%) 0%, hsl(0 0% 100%) 50%)'
  }
];

interface LandingThemeContextType {
  currentTheme: LandingTheme;
  setTheme: (theme: LandingTheme) => void;
  themes: LandingTheme[];
  activeCategory: 'dark' | 'light';
  setActiveCategory: (category: 'dark' | 'light') => void;
}

const LandingThemeContext = createContext<LandingThemeContextType | undefined>(undefined);

export const useLandingTheme = () => {
  const context = useContext(LandingThemeContext);
  if (!context) {
    throw new Error('useLandingTheme must be used within a LandingThemeProvider');
  }
  return context;
};

interface LandingThemeProviderProps {
  children: React.ReactNode;
}

export const LandingThemeProvider: React.FC<LandingThemeProviderProps> = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState<LandingTheme>(landingThemes[0]);
  const [activeCategory, setActiveCategory] = useState<'dark' | 'light'>('dark');

  const setTheme = (theme: LandingTheme) => {
    setCurrentTheme(theme);
    setActiveCategory(theme.category);
    
    // Apply theme to CSS custom properties
    const root = document.documentElement;
    root.style.setProperty('--landing-primary', theme.colors.primary);
    root.style.setProperty('--landing-secondary', theme.colors.secondary);
    root.style.setProperty('--landing-accent', theme.colors.accent);
    root.style.setProperty('--landing-muted', theme.colors.muted);
    root.style.setProperty('--landing-gradient', theme.gradient);
    root.style.setProperty('--landing-background-gradient', theme.backgroundGradient);
    
    // Apply font families
    root.style.setProperty('--landing-font-heading', theme.fonts.heading);
    root.style.setProperty('--landing-font-body', theme.fonts.body);
    root.style.setProperty('--landing-font-mono', theme.fonts.mono);
  };

  useEffect(() => {
    // Set default theme on mount
    setTheme(currentTheme);
  }, []);

  return (
    <LandingThemeContext.Provider 
      value={{ 
        currentTheme, 
        setTheme, 
        themes: landingThemes,
        activeCategory,
        setActiveCategory
      }}
    >
      {children}
    </LandingThemeContext.Provider>
  );
};