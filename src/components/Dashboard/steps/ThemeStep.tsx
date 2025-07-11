import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Palette, Sunset, Moon, Zap } from 'lucide-react';

interface ThemeStepProps {
  onThemeSelected: (theme: string) => void;
  onSkip: () => void;
  onBackToComponents: () => void;
  className?: string;
}

const themes = [
  {
    id: 'default',
    name: 'Classic',
    description: 'Clean and professional look',
    icon: Palette,
    preview: 'bg-gradient-to-br from-blue-50 to-indigo-100',
    colors: ['bg-blue-500', 'bg-indigo-500', 'bg-purple-500']
  },
  {
    id: 'sunset',
    name: 'Sunset',
    description: 'Warm oranges and reds',
    icon: Sunset,
    preview: 'bg-gradient-to-br from-orange-50 to-red-100',
    colors: ['bg-orange-500', 'bg-red-500', 'bg-pink-500']
  },
  {
    id: 'dark',
    name: 'Dark Mode',
    description: 'Easy on the eyes',
    icon: Moon,
    preview: 'bg-gradient-to-br from-gray-800 to-gray-900',
    colors: ['bg-gray-600', 'bg-gray-700', 'bg-gray-800']
  },
  {
    id: 'neon',
    name: 'Neon',
    description: 'Vibrant and energetic',
    icon: Zap,
    preview: 'bg-gradient-to-br from-green-50 to-cyan-100',
    colors: ['bg-green-500', 'bg-cyan-500', 'bg-emerald-500']
  }
];

export const ThemeStep: React.FC<ThemeStepProps> = ({ 
  onThemeSelected, 
  onSkip, 
  onBackToComponents,
  className 
}) => {
  const [selectedTheme, setSelectedTheme] = useState<string>('default');

  const handleFinish = () => {
    onThemeSelected(selectedTheme);
  };

  return (
    <div className={`max-w-4xl mx-auto p-6 space-y-6 ${className}`}>
      <Card className="text-center border-primary/20 bg-gradient-to-br from-primary/5 via-background to-purple-500/5">
        <CardHeader>
          <CardTitle className="text-2xl font-bold flex items-center justify-center gap-2">
            <Palette className="h-6 w-6" />
            Choose Your Theme
          </CardTitle>
          <CardDescription className="text-lg">
            Customize your dashboard's appearance to match your style
          </CardDescription>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {themes.map((theme) => {
          const IconComponent = theme.icon;
          const isSelected = selectedTheme === theme.id;
          
          return (
            <Card 
              key={theme.id}
              className={`cursor-pointer transition-all duration-200 hover:scale-105 ${
                isSelected 
                  ? 'ring-2 ring-primary border-primary/50 shadow-lg' 
                  : 'border-border/50 hover:border-primary/30'
              }`}
              onClick={() => setSelectedTheme(theme.id)}
            >
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-lg ${theme.preview} flex items-center justify-center shadow-md`}>
                    <IconComponent className="h-6 w-6 text-foreground/70" />
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg mb-1">{theme.name}</h3>
                    <p className="text-muted-foreground text-sm mb-3">{theme.description}</p>
                    
                    <div className="flex gap-2">
                      {theme.colors.map((color, index) => (
                        <div 
                          key={index}
                          className={`w-4 h-4 rounded-full ${color} shadow-sm`}
                        />
                      ))}
                    </div>
                  </div>
                  
                  {isSelected && (
                    <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                      <div className="w-2 h-2 bg-white rounded-full" />
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="flex justify-between items-center pt-4">
        <Button variant="ghost" onClick={onBackToComponents} className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back to Components
        </Button>
        
        <div className="flex gap-3">
          <Button variant="outline" onClick={onSkip}>
            Skip Theme Setup
          </Button>
          <Button onClick={handleFinish} className="gap-2">
            <Palette className="h-4 w-4" />
            Continue with {themes.find(t => t.id === selectedTheme)?.name}
          </Button>
        </div>
      </div>
    </div>
  );
};