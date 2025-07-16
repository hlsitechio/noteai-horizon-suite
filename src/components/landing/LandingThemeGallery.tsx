import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, Sparkles, Moon, Sun, Palette, Layers, Zap, Droplets } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ThemeCard {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
  featured?: boolean;
  colors: string[];
  gradient: string;
  category: 'dark' | 'light';
}

const themes: ThemeCard[] = [
  // Dark Themes
  {
    id: 'quantum-aurora',
    name: 'Quantum Aurora',
    description: 'Our signature cyberpunk-inspired dark theme',
    icon: Zap,
    featured: true,
    colors: ['#00ff88', '#ffdd00', '#dd00ff', '#00ddff'],
    gradient: 'linear-gradient(135deg, #00ff88 0%, #ffdd00 50%, #dd00ff 100%)',
    category: 'dark'
  },
  {
    id: 'midnight-blue',
    name: 'Midnight Blue',
    description: 'Deep oceanic blues with ethereal accents',
    icon: Moon,
    colors: ['#1e40af', '#3b82f6', '#60a5fa', '#93c5fd'],
    gradient: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)',
    category: 'dark'
  },
  {
    id: 'emerald-forest',
    name: 'Emerald Forest',
    description: 'Rich forest greens with natural depth',
    icon: Layers,
    colors: ['#059669', '#10b981', '#34d399', '#6ee7b7'],
    gradient: 'linear-gradient(135deg, #064e3b 0%, #059669 100%)',
    category: 'dark'
  },
  {
    id: 'violet-storm',
    name: 'Violet Storm',
    description: 'Mystical purples with electric energy',
    icon: Sparkles,
    colors: ['#7c3aed', '#8b5cf6', '#a78bfa', '#c4b5fd'],
    gradient: 'linear-gradient(135deg, #581c87 0%, #7c3aed 100%)',
    category: 'dark'
  },
  {
    id: 'orange-sunset',
    name: 'Orange Sunset',
    description: 'Warm sunset hues with fiery accents',
    icon: Sun,
    colors: ['#ea580c', '#f97316', '#fb923c', '#fdba74'],
    gradient: 'linear-gradient(135deg, #c2410c 0%, #ea580c 100%)',
    category: 'dark'
  },
  {
    id: 'crimson-shadow',
    name: 'Crimson Shadow',
    description: 'Deep crimson reds with shadowy elegance',
    icon: Droplets,
    colors: ['#dc2626', '#ef4444', '#f87171', '#fca5a5'],
    gradient: 'linear-gradient(135deg, #991b1b 0%, #dc2626 100%)',
    category: 'dark'
  },
  // Light Themes
  {
    id: 'pristine-white',
    name: 'Pristine White',
    description: 'Ultra clean and minimal design',
    icon: Sparkles,
    featured: true,
    colors: ['#3b82f6', '#ffffff', '#f8fafc', '#e2e8f0'],
    gradient: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
    category: 'light'
  },
  {
    id: 'pearl-elegance',
    name: 'Pearl Elegance',
    description: 'Sophisticated pearl tones with subtle shimmer',
    icon: Palette,
    colors: ['#3b82f6', '#f1f5f9', '#e2e8f0', '#cbd5e1'],
    gradient: 'linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)',
    category: 'light'
  },
  {
    id: 'crystal-clear',
    name: 'Crystal Clear',
    description: 'Transparent clarity with cool blues',
    icon: Droplets,
    colors: ['#0ea5e9', '#ffffff', '#f0f9ff', '#e0f2fe'],
    gradient: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)',
    category: 'light'
  },
  {
    id: 'lavender-breeze',
    name: 'Lavender Breeze',
    description: 'Soft purple whites with gentle elegance',
    icon: Layers,
    colors: ['#8b5cf6', '#ffffff', '#faf5ff', '#f3e8ff'],
    gradient: 'linear-gradient(135deg, #faf5ff 0%, #f3e8ff 100%)',
    category: 'light'
  },
  {
    id: 'rose-quartz',
    name: 'Rose Quartz',
    description: 'Warm pink whites with romantic charm',
    icon: Sparkles,
    colors: ['#ec4899', '#fdf2f8', '#fce7f3', '#fbcfe8'],
    gradient: 'linear-gradient(135deg, #fdf2f8 0%, #fce7f3 100%)',
    category: 'light'
  },
  {
    id: 'mint-fresh',
    name: 'Mint Fresh',
    description: 'Cool mint whites with refreshing vibes',
    icon: Layers,
    colors: ['#10b981', '#ffffff', '#f0fdf4', '#dcfce7'],
    gradient: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)',
    category: 'light'
  }
];

export const LandingThemeGallery: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'dark' | 'light'>('dark');
  const [hoveredTheme, setHoveredTheme] = useState<string | null>(null);

  const filteredThemes = themes.filter(theme => theme.category === activeTab);

  const handleApplyTheme = (themeId: string) => {
    // For landing page, this would just be a demo action
    console.log('Demo: Apply theme', themeId);
  };

  return (
    <section className="py-24 px-6 lg:px-8 relative">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.h2 
            className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent mb-6"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            Theme Gallery
          </motion.h2>
          <motion.p 
            className="text-lg text-muted-foreground max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Choose from our collection of ultra visual appealing themes. From dark
            cyberpunk aesthetics to pristine white elegance.
          </motion.p>
        </div>

        {/* Theme Toggle */}
        <motion.div 
          className="flex justify-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="inline-flex bg-card/50 backdrop-blur-sm border border-border/50 rounded-lg p-1">
            <button
              onClick={() => setActiveTab('dark')}
              className={cn(
                "flex items-center gap-2 px-6 py-3 rounded-md text-sm font-medium transition-all duration-200",
                activeTab === 'dark' 
                  ? "bg-background text-foreground shadow-sm" 
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Moon className="w-4 h-4" />
              Dark Themes
            </button>
            <button
              onClick={() => setActiveTab('light')}
              className={cn(
                "flex items-center gap-2 px-6 py-3 rounded-md text-sm font-medium transition-all duration-200",
                activeTab === 'light' 
                  ? "bg-background text-foreground shadow-sm" 
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Sun className="w-4 h-4" />
              White Themes
            </button>
          </div>
        </motion.div>

        {/* Theme Grid */}
        <AnimatePresence mode="wait">
          <motion.div 
            key={activeTab}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
          >
            {filteredThemes.map((theme, index) => (
              <motion.div
                key={theme.id}
                className="relative group"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                onHoverStart={() => setHoveredTheme(theme.id)}
                onHoverEnd={() => setHoveredTheme(null)}
              >
                <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-xl p-6 transition-all duration-300 hover:shadow-xl hover:shadow-primary/10 hover:border-primary/20">
                  {/* Theme Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                        <theme.icon className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground flex items-center gap-2">
                          {theme.name}
                          {theme.featured && (
                            <span className="text-xs bg-gradient-to-r from-primary to-accent text-primary-foreground px-2 py-0.5 rounded-full">
                              Featured
                            </span>
                          )}
                        </h3>
                        <p className="text-sm text-muted-foreground">{theme.description}</p>
                      </div>
                    </div>
                  </div>

                  {/* Color Palette */}
                  <div className="flex gap-2 mb-4">
                    {theme.colors.map((color, colorIndex) => (
                      <div
                        key={colorIndex}
                        className="w-12 h-6 rounded-md border border-border/20"
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>

                  {/* Preview Bar */}
                  <div className="relative mb-6">
                    <div 
                      className="h-16 rounded-lg border border-border/20 flex items-center justify-center text-sm font-medium text-white/90"
                      style={{ background: theme.gradient }}
                    >
                      {activeTab === 'dark' ? 'Dark Mode' : 'Light Mode'}
                    </div>
                  </div>

                  {/* Apply Button */}
                  <Button
                    onClick={() => handleApplyTheme(theme.id)}
                    variant="outline"
                    className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-200"
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    Apply Theme
                  </Button>
                </div>

                {/* Hover Glow Effect */}
                {hoveredTheme === theme.id && (
                  <motion.div
                    className="absolute inset-0 -z-10 rounded-xl"
                    style={{ 
                      background: `radial-gradient(circle at center, ${theme.colors[0]}20 0%, transparent 70%)`,
                      filter: 'blur(20px)'
                    }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  />
                )}
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
};