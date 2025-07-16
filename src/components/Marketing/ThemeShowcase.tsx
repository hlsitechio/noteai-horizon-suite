import React from 'react';
import { motion } from 'framer-motion';
import { Eye, Palette } from 'lucide-react';
import { useLandingTheme } from '@/contexts/LandingThemeContext';
import { Button } from '@/components/ui/button';

const ThemeShowcase: React.FC = () => {
  const { themes, currentTheme, setTheme } = useLandingTheme();

  return (
    <section className="py-24 relative overflow-hidden">
      {/* Dynamic background based on current theme */}
      <div 
        className="absolute inset-0 opacity-10"
        style={{ background: currentTheme.gradient }}
      />
      
      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center mb-4">
            <Palette className="w-8 h-8 mr-3" style={{ color: `hsl(${currentTheme.colors.primary})` }} />
            <span className="text-sm font-medium uppercase tracking-wider opacity-70">
              Live Theme Demo
            </span>
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">
            Experience Our <span style={{ color: `hsl(${currentTheme.colors.primary})` }}>Dynamic Themes</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            See how each theme transforms your workspace. Click any theme below to preview it live on this page!
          </p>
        </motion.div>

        {/* Theme Toggle Switch */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="flex justify-center mb-12"
        >
          <div className="bg-background/80 backdrop-blur-sm border border-border rounded-full p-2 flex items-center space-x-2">
            <div className="w-6 h-6 rounded-full" style={{ backgroundColor: `hsl(${currentTheme.colors.primary})` }} />
            <span className="text-sm font-medium px-4">
              Current: {currentTheme.name}
            </span>
            <div className="w-6 h-6 rounded-full" style={{ backgroundColor: `hsl(${currentTheme.colors.accent})` }} />
          </div>
        </motion.div>

        {/* Theme Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {themes.map((theme, index) => (
            <motion.div
              key={theme.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
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
            >
              <div className="bg-card border border-border rounded-2xl p-6 hover:shadow-xl transition-all duration-300 group-hover:scale-[1.02]">
                {/* Theme Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{theme.icon}</span>
                    <div>
                      <h3 className="font-semibold text-foreground flex items-center">
                        {theme.name}
                        {theme.featured && (
                          <span className="ml-2 px-2 py-1 text-xs bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full">
                            Featured
                          </span>
                        )}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {theme.description}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Color Palette */}
                <div className="flex space-x-2 mb-4">
                  <div 
                    className="w-6 h-6 rounded-full border border-border"
                    style={{ backgroundColor: `hsl(${theme.colors.primary})` }}
                  />
                  <div 
                    className="w-6 h-6 rounded-full border border-border"
                    style={{ backgroundColor: `hsl(${theme.colors.secondary})` }}
                  />
                  <div 
                    className="w-6 h-6 rounded-full border border-border"
                    style={{ backgroundColor: `hsl(${theme.colors.accent})` }}
                  />
                  <div 
                    className="w-6 h-6 rounded-full border border-border"
                    style={{ backgroundColor: `hsl(${theme.colors.muted})` }}
                  />
                </div>

                {/* Preview Button */}
                <div 
                  className="h-12 rounded-xl mb-4 flex items-center justify-center text-white font-medium transition-all duration-300"
                  style={{ background: theme.gradient }}
                >
                  Dark Mode Preview
                </div>

                {/* Apply Button */}
                <Button
                  className={`w-full ${theme.buttonStyle} text-white border-0`}
                  onClick={(e) => {
                    e.stopPropagation();
                    setTheme(theme);
                  }}
                >
                  <Eye className="w-4 h-4 mr-2" />
                  {currentTheme.id === theme.id ? 'Current Theme' : 'Preview Theme'}
                </Button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Theme Features */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <div 
            className="inline-flex items-center px-6 py-3 rounded-full text-white font-medium"
            style={{ background: currentTheme.gradient }}
          >
            <Palette className="w-5 h-5 mr-2" />
            Live preview powered by {currentTheme.name}
          </div>
          <p className="mt-4 text-muted-foreground">
            Every theme is carefully crafted with accessibility and user experience in mind
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default ThemeShowcase;