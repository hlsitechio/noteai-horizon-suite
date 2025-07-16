import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Palette, 
  Sparkles, 
  Moon, 
  Sun, 
  Gem, 
  Heart, 
  Zap, 
  Droplets,
  Flower2,
  Snowflake,
  Check,
  Eye,
  Flame
} from 'lucide-react';
import { useTheme } from '@/providers/ThemeProvider';
import { applyCustomTheme } from '@/utils/themeUtils';
import { toast } from '@/hooks/use-toast';

interface Theme {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<any>;
  category: 'dark' | 'light';
  preview: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
  };
  gradient: string;
  featured?: boolean;
}

const themes: Theme[] = [
  // Dark Themes
  {
    id: 'dark',
    name: 'Quantum Aurora',
    description: 'Our signature cyberpunk-inspired dark theme',
    icon: Zap,
    category: 'dark',
    preview: {
      primary: '#00FFA6',
      secondary: '#FFD700',
      accent: '#BF40BF',
      background: '#0A0B14'
    },
    gradient: 'linear-gradient(135deg, #00FFA6 0%, #FFD700 50%, #BF40BF 100%)',
    featured: true
  },
  {
    id: 'theme-midnight',
    name: 'Midnight Blue',
    description: 'Deep oceanic blues with ethereal accents',
    icon: Moon,
    category: 'dark',
    preview: {
      primary: '#4D9EFF',
      secondary: '#2B4C7A',
      accent: '#4D9EFF',
      background: '#0B1426'
    },
    gradient: 'linear-gradient(135deg, #4D9EFF 0%, #2B4C7A 100%)'
  },
  {
    id: 'theme-emerald',
    name: 'Emerald Forest',
    description: 'Rich forest greens with natural depth',
    icon: Droplets,
    category: 'dark',
    preview: {
      primary: '#10B981',
      secondary: '#065F46',
      accent: '#10B981',
      background: '#0A2F1F'
    },
    gradient: 'linear-gradient(135deg, #10B981 0%, #065F46 100%)'
  },
  {
    id: 'theme-violet',
    name: 'Violet Storm',
    description: 'Mystical purples with electric energy',
    icon: Sparkles,
    category: 'dark',
    preview: {
      primary: '#8B5CF6',
      secondary: '#4C1D95',
      accent: '#8B5CF6',
      background: '#1E0A3C'
    },
    gradient: 'linear-gradient(135deg, #8B5CF6 0%, #4C1D95 100%)'
  },
  {
    id: 'theme-sunset',
    name: 'Orange Sunset',
    description: 'Warm sunset hues with fiery accents',
    icon: Sun,
    category: 'dark',
    preview: {
      primary: '#F97316',
      secondary: '#DC2626',
      accent: '#EF4444',
      background: '#451A03'
    },
    gradient: 'linear-gradient(135deg, #F97316 0%, #DC2626 100%)'
  },
  {
    id: 'theme-crimson',
    name: 'Crimson Shadow',
    description: 'Deep crimson reds with shadowy elegance',
    icon: Flame,
    category: 'dark',
    preview: {
      primary: '#DC143C',
      secondary: '#8B0000',
      accent: '#FF1744',
      background: '#2D0A0A'
    },
    gradient: 'linear-gradient(135deg, #DC143C 0%, #8B0000 100%)'
  },

  // White/Light Themes
  {
    id: 'theme-pristine',
    name: 'Pristine White',
    description: 'Ultra clean and minimal design',
    icon: Snowflake,
    category: 'light',
    preview: {
      primary: '#3B82F6',
      secondary: '#E5E7EB',
      accent: '#F3F4F6',
      background: '#FFFFFF'
    },
    gradient: 'linear-gradient(135deg, #3B82F6 0%, #E5E7EB 100%)',
    featured: true
  },
  {
    id: 'theme-pearl',
    name: 'Pearl Elegance',
    description: 'Sophisticated pearl tones with subtle shimmer',
    icon: Gem,
    category: 'light',
    preview: {
      primary: '#4285F4',
      secondary: '#E8EBF0',
      accent: '#F0F2F5',
      background: '#FFFFFF'
    },
    gradient: 'linear-gradient(135deg, #4285F4 0%, #E8EBF0 100%)'
  },
  {
    id: 'theme-crystal',
    name: 'Crystal Clear',
    description: 'Transparent clarity with cool blues',
    icon: Droplets,
    category: 'light',
    preview: {
      primary: '#0EA5E9',
      secondary: '#E0F2FE',
      accent: '#F0F9FF',
      background: '#FFFFFF'
    },
    gradient: 'linear-gradient(135deg, #0EA5E9 0%, #E0F2FE 100%)'
  },
  {
    id: 'theme-lavender',
    name: 'Lavender Breeze',
    description: 'Soft purple whites with gentle elegance',
    icon: Flower2,
    category: 'light',
    preview: {
      primary: '#8B5CF6',
      secondary: '#EDE9FE',
      accent: '#F3F0FF',
      background: '#FFFFFF'
    },
    gradient: 'linear-gradient(135deg, #8B5CF6 0%, #EDE9FE 100%)'
  },
  {
    id: 'theme-rose',
    name: 'Rose Quartz',
    description: 'Warm pink whites with romantic charm',
    icon: Heart,
    category: 'light',
    preview: {
      primary: '#EC4899',
      secondary: '#FCE7F3',
      accent: '#FDF2F8',
      background: '#FFFFFF'
    },
    gradient: 'linear-gradient(135deg, #EC4899 0%, #FCE7F3 100%)'
  },
  {
    id: 'theme-mint',
    name: 'Mint Fresh',
    description: 'Cool mint whites with refreshing vibes',
    icon: Droplets,
    category: 'light',
    preview: {
      primary: '#059669',
      secondary: '#D1FAE5',
      accent: '#ECFDF5',
      background: '#FFFFFF'
    },
    gradient: 'linear-gradient(135deg, #059669 0%, #D1FAE5 100%)'
  }
];

interface ThemeGalleryProps {
  onThemeSelect?: (themeId: string) => void;
  className?: string;
}

export const ThemeGallery: React.FC<ThemeGalleryProps> = ({ 
  onThemeSelect,
  className 
}) => {
  const [selectedTheme, setSelectedTheme] = useState<string>('dark');
  const [activeTab, setActiveTab] = useState<'dark' | 'light'>('dark');
  const [previewTheme, setPreviewTheme] = useState<string | null>(null);
  const { setTheme, theme: currentTheme } = useTheme();

  const handleThemeSelect = (themeId: string) => {
    const selectedThemeData = themes.find(t => t.id === themeId);
    if (!selectedThemeData) return;

    // Apply custom theme using new utility function
    if (themeId === 'dark') {
      // Handle default dark theme
      setTheme('dark');
      const root = document.documentElement;
      root.classList.remove(...themes.filter(t => t.id !== 'dark').map(t => t.id));
    } else {
      // Apply custom theme class
      applyCustomTheme(themeId, selectedThemeData.category);
      setTheme(selectedThemeData.category);
    }

    setSelectedTheme(themeId);
    onThemeSelect?.(themeId);
    
    toast({
      title: "Theme Applied",
      description: `Switched to ${selectedThemeData.name}`,
    });
  };

  const handlePreview = (themeId: string | null) => {
    setPreviewTheme(themeId);
  };

  const filteredThemes = themes.filter(theme => theme.category === activeTab);

  return (
    <div className={`w-full max-w-7xl mx-auto p-6 ${className}`}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
          Theme Gallery
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Choose from our collection of ultra visual appealing themes. From dark cyberpunk aesthetics to pristine white elegance.
        </p>
      </motion.div>

      <Tabs 
        value={activeTab} 
        onValueChange={(value) => setActiveTab(value as 'dark' | 'light')}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto mb-8">
          <TabsTrigger value="dark" className="flex items-center gap-2">
            <Moon className="h-4 w-4" />
            Dark Themes
          </TabsTrigger>
          <TabsTrigger value="light" className="flex items-center gap-2">
            <Sun className="h-4 w-4" />
            White Themes
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-0">
          <motion.div 
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            <AnimatePresence mode="popLayout">
              {filteredThemes.map((theme, index) => {
                const IconComponent = theme.icon;
                const isSelected = selectedTheme === theme.id;
                const isCurrentTheme = currentTheme === theme.category && 
                  (theme.id === 'dark' ? !document.documentElement.classList.contains('theme-') : 
                   document.documentElement.classList.contains(theme.id));

                return (
                  <motion.div
                    key={theme.id}
                    layout
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                    onHoverStart={() => handlePreview(theme.id)}
                    onHoverEnd={() => handlePreview(null)}
                  >
                    <Card 
                      className={`
                        cursor-pointer transition-all duration-300 h-full group
                        ${isSelected || isCurrentTheme ? 'ring-2 ring-primary shadow-lg' : 'hover:shadow-md'}
                        ${theme.featured ? 'border-primary/50' : ''}
                      `}
                      onClick={() => handleThemeSelect(theme.id)}
                    >
                      <CardHeader className="pb-4">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            <div 
                              className="w-12 h-12 rounded-xl shadow-md flex items-center justify-center relative overflow-hidden"
                              style={{ background: theme.gradient }}
                            >
                              <IconComponent className="h-6 w-6 text-white relative z-10" />
                            </div>
                            <div>
                              <CardTitle className="text-lg flex items-center gap-2">
                                {theme.name}
                                {theme.featured && (
                                  <Badge variant="secondary" className="text-xs">
                                    Featured
                                  </Badge>
                                )}
                              </CardTitle>
                              <CardDescription className="text-sm">
                                {theme.description}
                              </CardDescription>
                            </div>
                          </div>
                          
                          {(isSelected || isCurrentTheme) && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center"
                            >
                              <Check className="w-4 h-4 text-white" />
                            </motion.div>
                          )}
                        </div>
                      </CardHeader>

                      <CardContent className="pt-0">
                        {/* Color Preview */}
                        <div className="grid grid-cols-4 gap-2 mb-4">
                          <div 
                            className="h-8 rounded-lg shadow-sm"
                            style={{ backgroundColor: theme.preview.primary }}
                            title="Primary"
                          />
                          <div 
                            className="h-8 rounded-lg shadow-sm"
                            style={{ backgroundColor: theme.preview.secondary }}
                            title="Secondary"
                          />
                          <div 
                            className="h-8 rounded-lg shadow-sm"
                            style={{ backgroundColor: theme.preview.accent }}
                            title="Accent"
                          />
                          <div 
                            className="h-8 rounded-lg shadow-sm border border-border"
                            style={{ backgroundColor: theme.preview.background }}
                            title="Background"
                          />
                        </div>

                        {/* Gradient Preview */}
                        <div 
                          className="h-16 rounded-lg shadow-sm relative overflow-hidden"
                          style={{ background: theme.gradient }}
                        >
                          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                          <div className="absolute bottom-2 left-2 text-white text-xs font-medium">
                            {theme.category === 'dark' ? 'Dark Mode' : 'Light Mode'}
                          </div>
                        </div>

                        {/* Preview Button */}
                        <Button
                          variant="ghost"
                          size="sm"
                          className="w-full mt-4 group-hover:bg-primary/5"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleThemeSelect(theme.id);
                          }}
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          Apply Theme
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </motion.div>
        </TabsContent>
      </Tabs>

      {/* Preview Info */}
      <AnimatePresence>
        {previewTheme && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-6 right-6 max-w-sm"
          >
            <Card className="shadow-xl border-primary/20 bg-background/95 backdrop-blur-sm">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Palette className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium">
                      {themes.find(t => t.id === previewTheme)?.name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Click to apply this theme
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ThemeGallery;