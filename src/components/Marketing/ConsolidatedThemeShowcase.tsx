import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, Palette, Moon, Sun, Sparkles } from 'lucide-react';
import { useLandingTheme } from '@/contexts/LandingThemeContext';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const ConsolidatedThemeShowcase: React.FC = () => {
  const { themes, currentTheme, setTheme, activeCategory, setActiveCategory } = useLandingTheme();
  const [hoveredTheme, setHoveredTheme] = useState<string | null>(null);

  const filteredThemes = themes.filter(theme => theme.category === activeCategory);

  return (
    <section className="py-24 relative overflow-hidden">
      {/* Dynamic background based on current theme */}
      <div 
        className="absolute inset-0 opacity-10"
        style={{ background: currentTheme.backgroundGradient }}
      />
      
      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative">
        {/* Enhanced Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center mb-6">
            <Palette className="w-10 h-10 mr-4" style={{ color: `hsl(${currentTheme.colors.primary})` }} />
            <div>
              <span className="text-sm font-medium uppercase tracking-wider opacity-70 block">
                Interactive Theme Gallery
              </span>
              <div className="flex items-center justify-center mt-2">
                <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: `hsl(${currentTheme.colors.primary})` }} />
                <span className="text-xs font-medium">
                  Currently: {currentTheme.name}
                </span>
                <div className="w-3 h-3 rounded-full ml-2" style={{ backgroundColor: `hsl(${currentTheme.colors.accent})` }} />
              </div>
            </div>
          </div>
          
          <h2 
            className="text-4xl lg:text-6xl font-bold mb-6"
            style={{ 
              fontFamily: `var(--landing-font-heading), sans-serif`,
              background: `linear-gradient(135deg, hsl(${currentTheme.colors.primary}), hsl(${currentTheme.colors.accent}))`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}
          >
            Experience Our Dynamic Themes
          </h2>
          
          <p 
            className="text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed"
            style={{ fontFamily: `var(--landing-font-body), sans-serif` }}
          >
            Watch as your entire workspace transforms with each theme. Every color, font, and gradient 
            changes instantly to create a completely new visual experience that matches your style.
          </p>
        </motion.div>

        {/* Theme Category Toggle */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="flex justify-center mb-12"
        >
          <div 
            className="inline-flex backdrop-blur-sm border rounded-full p-2 relative"
            style={{ 
              backgroundColor: `hsl(${currentTheme.colors.primary} / 0.1)`,
              borderColor: `hsl(${currentTheme.colors.primary} / 0.2)`
            }}
          >
            <button
              onClick={() => setActiveCategory('dark')}
              className={cn(
                "flex items-center gap-3 px-6 py-3 rounded-full text-sm font-medium transition-all duration-300 relative z-10",
                activeCategory === 'dark' 
                  ? "text-white shadow-lg" 
                  : "text-muted-foreground hover:text-foreground"
              )}
              style={activeCategory === 'dark' ? {
                background: `linear-gradient(135deg, hsl(${currentTheme.colors.primary}), hsl(${currentTheme.colors.secondary}))`
              } : {}}
            >
              <Moon className="w-4 h-4" />
              <span style={{ fontFamily: `var(--landing-font-body), sans-serif` }}>
                Dark Themes
              </span>
              <span className="text-xs opacity-70">({themes.filter(t => t.category === 'dark').length})</span>
            </button>
            <button
              onClick={() => setActiveCategory('light')}
              className={cn(
                "flex items-center gap-3 px-6 py-3 rounded-full text-sm font-medium transition-all duration-300 relative z-10",
                activeCategory === 'light' 
                  ? "text-white shadow-lg" 
                  : "text-muted-foreground hover:text-foreground"
              )}
              style={activeCategory === 'light' ? {
                background: `linear-gradient(135deg, hsl(${currentTheme.colors.primary}), hsl(${currentTheme.colors.secondary}))`
              } : {}}
            >
              <Sun className="w-4 h-4" />
              <span style={{ fontFamily: `var(--landing-font-body), sans-serif` }}>
                Light Themes
              </span>
              <span className="text-xs opacity-70">({themes.filter(t => t.category === 'light').length})</span>
            </button>
          </div>
        </motion.div>

        {/* Theme Grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            {filteredThemes.map((theme, index) => (
              <motion.div
                key={theme.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className={`relative group cursor-pointer ${
                  currentTheme.id === theme.id 
                    ? 'ring-2 ring-offset-2 ring-offset-background' 
                    : ''
                }`}
                style={currentTheme.id === theme.id ? {
                  '--tw-ring-color': `hsl(${currentTheme.colors.primary})`,
                } as React.CSSProperties : {}}
                onClick={() => setTheme(theme)}
                onMouseEnter={() => setHoveredTheme(theme.id)}
                onMouseLeave={() => setHoveredTheme(null)}
              >
                <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-6 hover:shadow-xl transition-all duration-300 group-hover:scale-[1.02] overflow-hidden relative">
                  {/* Theme Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{theme.icon}</span>
                      <div>
                        <h3 
                          className="font-semibold text-foreground flex items-center"
                          style={{ fontFamily: `${theme.fonts.heading}, sans-serif` }}
                        >
                          {theme.name}
                          {theme.featured && (
                            <span className="ml-2 px-2 py-1 text-xs text-white rounded-full bg-gradient-to-r from-purple-500 to-pink-500">
                              Featured
                            </span>
                          )}
                        </h3>
                        <p 
                          className="text-sm text-muted-foreground"
                          style={{ fontFamily: `${theme.fonts.body}, sans-serif` }}
                        >
                          {theme.description}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Color Palette */}
                  <div className="flex space-x-2 mb-4">
                    <div 
                      className="w-8 h-8 rounded-full border-2 border-white/20 shadow-sm"
                      style={{ backgroundColor: `hsl(${theme.colors.primary})` }}
                    />
                    <div 
                      className="w-8 h-8 rounded-full border-2 border-white/20 shadow-sm"
                      style={{ backgroundColor: `hsl(${theme.colors.secondary})` }}
                    />
                    <div 
                      className="w-8 h-8 rounded-full border-2 border-white/20 shadow-sm"
                      style={{ backgroundColor: `hsl(${theme.colors.accent})` }}
                    />
                    <div 
                      className="w-8 h-8 rounded-full border-2 border-white/20 shadow-sm"
                      style={{ backgroundColor: `hsl(${theme.colors.muted})` }}
                    />
                  </div>

                  {/* Font Preview */}
                  <div className="mb-4 space-y-1">
                    <div 
                      className="text-sm font-bold"
                      style={{ 
                        fontFamily: `${theme.fonts.heading}, sans-serif`,
                        color: `hsl(${theme.colors.primary})`
                      }}
                    >
                      {theme.fonts.heading}
                    </div>
                    <div 
                      className="text-xs"
                      style={{ 
                        fontFamily: `${theme.fonts.body}, sans-serif`,
                        color: `hsl(${theme.colors.secondary})`
                      }}
                    >
                      {theme.fonts.body} • {theme.fonts.mono}
                    </div>
                  </div>

                  {/* Preview Gradient */}
                  <div 
                    className="h-16 rounded-xl mb-6 flex items-center justify-center text-white font-medium text-sm shadow-inner relative overflow-hidden"
                    style={{ background: theme.gradient }}
                  >
                    <div className="absolute inset-0 bg-black/10"></div>
                    <span className="relative z-10" style={{ fontFamily: `${theme.fonts.heading}, sans-serif` }}>
                      {activeCategory === 'dark' ? 'Dark Mode Preview' : 'Light Mode Preview'}
                    </span>
                  </div>

                  {/* Apply Button */}
                  <Button
                    className={`w-full text-white border-0 font-medium transition-all duration-300 ${
                      currentTheme.id === theme.id ? 'opacity-80' : ''
                    }`}
                    style={{ 
                      background: `linear-gradient(135deg, hsl(${theme.colors.primary}), hsl(${theme.colors.secondary}))`,
                      fontFamily: `${theme.fonts.body}, sans-serif`
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      setTheme(theme);
                    }}
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    {currentTheme.id === theme.id ? 'Active Theme' : 'Preview Theme'}
                  </Button>

                  {/* Hover Glow Effect */}
                  {hoveredTheme === theme.id && (
                    <motion.div
                      className="absolute inset-0 -z-10 rounded-2xl"
                      style={{ 
                        background: `radial-gradient(circle at center, hsl(${theme.colors.primary} / 0.2) 0%, transparent 70%)`,
                        filter: 'blur(20px)'
                      }}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    />
                  )}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Live Demo Footer */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <div 
            className="inline-flex items-center px-8 py-4 rounded-full text-white font-medium shadow-lg"
            style={{ 
              background: currentTheme.gradient,
              fontFamily: `var(--landing-font-body), sans-serif`
            }}
          >
            <Sparkles className="w-5 h-5 mr-3" />
            Live preview powered by {currentTheme.name}
            <div className="w-2 h-2 rounded-full bg-white/50 ml-3 animate-pulse"></div>
          </div>
          <p 
            className="mt-6 text-muted-foreground text-sm"
            style={{ fontFamily: `var(--landing-font-body), sans-serif` }}
          >
            Every theme includes custom fonts, colors, and gradients • Changes apply instantly across the entire website
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default ConsolidatedThemeShowcase;