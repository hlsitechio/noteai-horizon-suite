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
      primary: '142 100% 50%', // bright green
      secondary: '60 100% 50%', // yellow
      accent: '300 100% 50%', // magenta
      muted: '180 100% 50%', // cyan
    },
    gradient: 'linear-gradient(135deg, hsl(142 100% 15%) 0%, hsl(300 100% 15%) 50%, hsl(60 100% 15%) 100%)',
    buttonStyle: 'bg-gradient-to-r from-green-500 to-yellow-500 hover:from-green-600 hover:to-yellow-600',
    fonts: {
      heading: 'Orbitron',
      body: 'Exo 2',
      mono: 'JetBrains Mono'
    },
    backgroundGradient: 'radial-gradient(ellipse at top, hsl(142 100% 5%) 0%, hsl(0 0% 0%) 50%)'
  },
  {
    id: 'midnight-blue',
    name: 'Midnight Blue',
    description: 'Deep oceanic blues with ethereal accents',
    icon: '🌊',
    category: 'dark',
    colors: {
      primary: '220 100% 50%', // bright blue
      secondary: '200 100% 60%', // light blue
      accent: '240 100% 70%', // lighter blue
      muted: '210 50% 80%', // very light blue
    },
    gradient: 'linear-gradient(135deg, hsl(220 100% 15%) 0%, hsl(240 80% 20%) 50%, hsl(200 60% 25%) 100%)',
    buttonStyle: 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700',
    fonts: {
      heading: 'Inter',
      body: 'Inter',
      mono: 'JetBrains Mono'
    },
    backgroundGradient: 'radial-gradient(ellipse at top, hsl(220 100% 5%) 0%, hsl(0 0% 0%) 50%)'
  },
  {
    id: 'emerald-forest',
    name: 'Emerald Forest',
    description: 'Rich forest greens with natural depth',
    icon: '🌲',
    category: 'dark',
    colors: {
      primary: '120 100% 40%', // forest green
      secondary: '140 80% 50%', // emerald
      accent: '160 60% 60%', // light green
      muted: '120 30% 70%', // muted green
    },
    gradient: 'linear-gradient(135deg, hsl(120 100% 10%) 0%, hsl(140 80% 15%) 50%, hsl(160 60% 20%) 100%)',
    buttonStyle: 'bg-gradient-to-r from-green-600 to-emerald-500 hover:from-green-700 hover:to-emerald-600',
    fonts: {
      heading: 'Exo 2',
      body: 'Inter',
      mono: 'JetBrains Mono'
    },
    backgroundGradient: 'radial-gradient(ellipse at top, hsl(120 100% 5%) 0%, hsl(0 0% 0%) 50%)'
  },
  {
    id: 'violet-storm',
    name: 'Violet Storm',
    description: 'Mystical purples with electric energy',
    icon: '⚡',
    category: 'dark',
    colors: {
      primary: '270 100% 50%', // bright purple
      secondary: '280 80% 60%', // light purple
      accent: '260 90% 70%', // lighter purple
      muted: '270 40% 80%', // very light purple
    },
    gradient: 'linear-gradient(135deg, hsl(270 100% 15%) 0%, hsl(280 80% 20%) 50%, hsl(260 60% 25%) 100%)',
    buttonStyle: 'bg-gradient-to-r from-purple-500 to-violet-600 hover:from-purple-600 hover:to-violet-700',
    fonts: {
      heading: 'Orbitron',
      body: 'Exo 2',
      mono: 'JetBrains Mono'
    },
    backgroundGradient: 'radial-gradient(ellipse at top, hsl(270 100% 5%) 0%, hsl(0 0% 0%) 50%)'
  },
  {
    id: 'orange-sunset',
    name: 'Orange Sunset',
    description: 'Warm sunset hues with fiery accents',
    icon: '🌅',
    category: 'dark',
    colors: {
      primary: '30 100% 50%', // bright orange
      secondary: '45 100% 60%', // yellow-orange
      accent: '15 90% 70%', // light orange
      muted: '30 50% 80%', // very light orange
    },
    gradient: 'linear-gradient(135deg, hsl(30 100% 15%) 0%, hsl(45 80% 20%) 50%, hsl(15 60% 25%) 100%)',
    buttonStyle: 'bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600',
    fonts: {
      heading: 'Exo 2',
      body: 'Inter',
      mono: 'JetBrains Mono'
    },
    backgroundGradient: 'radial-gradient(ellipse at top, hsl(30 100% 5%) 0%, hsl(0 0% 0%) 50%)'
  },
  {
    id: 'crimson-shadow',
    name: 'Crimson Shadow',
    description: 'Deep crimson reds with shadowy elegance',
    icon: '🔥',
    category: 'dark',
    colors: {
      primary: '0 100% 50%', // bright red
      secondary: '350 80% 60%', // pink-red
      accent: '10 90% 70%', // light red
      muted: '0 40% 80%', // very light red
    },
    gradient: 'linear-gradient(135deg, hsl(0 100% 15%) 0%, hsl(350 80% 20%) 50%, hsl(10 60% 25%) 100%)',
    buttonStyle: 'bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700',
    fonts: {
      heading: 'Orbitron',
      body: 'Exo 2',
      mono: 'JetBrains Mono'
    },
    backgroundGradient: 'radial-gradient(ellipse at top, hsl(0 100% 5%) 0%, hsl(0 0% 0%) 50%)'
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