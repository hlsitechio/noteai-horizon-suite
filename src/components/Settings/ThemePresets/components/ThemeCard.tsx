import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Check } from 'lucide-react';
import { PresetTheme } from '../constants/themeData';

interface ThemeCardProps {
  theme: PresetTheme;
  isSelected: boolean;
  resolvedTheme: string;
  onApply: (theme: PresetTheme) => void;
}

export const ThemeCard: React.FC<ThemeCardProps> = ({
  theme,
  isSelected,
  resolvedTheme,
  onApply
}) => {
  const IconComponent = theme.icon;
  
  return (
    <Card 
      className={`group cursor-pointer transition-all duration-300 hover:shadow-lg ${
        isSelected ? 'ring-2 ring-primary shadow-lg' : 'hover:border-primary/50'
      }`}
      onClick={() => onApply(theme)}
    >
      <CardContent className="p-4">
        {/* Preview */}
        <div 
          className="w-full h-16 rounded-lg mb-4 relative overflow-hidden"
          style={{ background: theme.preview }}
        >
          {isSelected && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                <Check className="w-4 h-4 text-white" />
              </div>
            </div>
          )}
        </div>
        
        {/* Theme Info */}
        <div className="flex items-start gap-3">
          <div className="p-2 bg-muted rounded-lg">
            <IconComponent className="w-4 h-4" />
          </div>
          <div className="flex-1">
            <h4 className="font-semibold">{theme.name}</h4>
            <p className="text-sm text-muted-foreground">{theme.description}</p>
          </div>
        </div>

        {/* Color Swatches */}
        <div className="flex gap-2 mt-3">
          {Object.entries(resolvedTheme === 'dark' ? theme.colors.dark : theme.colors.light).slice(0, 3).map(([key, value]) => (
            <div
              key={key}
              className="w-6 h-6 rounded-full border-2 border-white shadow-sm"
              style={{ backgroundColor: `hsl(${value})` }}
              title={key}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};