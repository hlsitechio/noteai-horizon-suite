
import React from 'react';
import { Check } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const accentColors = [
  { name: 'Electric Cyan', value: '#00CFDE', hsl: '187 100% 42%' },
  { name: 'Ocean Blue', value: '#0ea5e9', hsl: '199 89% 48%' },
  { name: 'Emerald Green', value: '#10b981', hsl: '160 84% 39%' },
  { name: 'Purple', value: '#8b5cf6', hsl: '258 90% 66%' },
  { name: 'Pink', value: '#ec4899', hsl: '329 86% 65%' },
  { name: 'Orange', value: '#f97316', hsl: '25 95% 53%' },
  { name: 'Red', value: '#ef4444', hsl: '0 84% 60%' },
  { name: 'Yellow', value: '#eab308', hsl: '45 93% 47%' },
  { name: 'Indigo', value: '#6366f1', hsl: '239 84% 67%' },
  { name: 'Teal', value: '#14b8a6', hsl: '173 80% 40%' },
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
