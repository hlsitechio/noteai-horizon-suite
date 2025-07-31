
import React from 'react';
import { Check } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const accentColors = [
  { name: 'Professional Blue', value: '#3b82f6', hsl: '217 91% 60%' },
  { name: 'Navy Blue', value: '#1e40af', hsl: '225 83% 41%' },
  { name: 'Slate Blue', value: '#475569', hsl: '215 25% 27%' },
  { name: 'Forest Green', value: '#059669', hsl: '160 84% 39%' },
  { name: 'Emerald', value: '#10b981', hsl: '160 84% 39%' },
  { name: 'Warm Gray', value: '#6b7280', hsl: '220 9% 46%' },
  { name: 'Cool Gray', value: '#64748b', hsl: '215 25% 27%' },
  { name: 'Deep Purple', value: '#7c3aed', hsl: '258 90% 66%' },
  { name: 'Dark Teal', value: '#0f766e', hsl: '173 80% 40%' },
  { name: 'Charcoal', value: '#374151', hsl: '220 26% 14%' },
];

interface ColorPickerProps {
  currentColor: string;
  onColorChange: (color: { name: string; value: string; hsl: string }) => void;
}

const ColorPicker: React.FC<ColorPickerProps> = ({ currentColor, onColorChange }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Accent Color</CardTitle>
        <p className="text-sm text-muted-foreground">
          Customize the accent color used throughout the dashboard
        </p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-5 gap-3">
          {accentColors.map((color) => (
            <button
              key={color.name}
              onClick={() => onColorChange(color)}
              className="group relative w-12 h-12 rounded-xl border-2 border-border hover:border-foreground/20 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent overflow-hidden"
              style={{ backgroundColor: color.value }}
              title={color.name}
            >
              {currentColor === color.value && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <Check className="w-5 h-5 text-white drop-shadow-lg" />
                </div>
              )}
            </button>
          ))}
        </div>
        <div className="mt-4 p-3 bg-muted rounded-lg">
          <p className="text-sm text-muted-foreground">
            Current color: <span className="font-medium">{accentColors.find(c => c.value === currentColor)?.name || 'Electric Cyan'}</span>
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ColorPicker;
