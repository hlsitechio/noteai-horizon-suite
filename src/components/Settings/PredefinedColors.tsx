
import React from 'react';
import { Label } from '@/components/ui/label';

interface PredefinedColorsProps {
  onColorSelect: (color: { name: string; value: string; hsl: string }) => void;
}

const predefinedColors = [
  { name: 'Electric Cyan', value: '#00CFDE', hsl: '187 100% 42%' },
  { name: 'Ocean Blue', value: '#0ea5e9', hsl: '199 89% 48%' },
  { name: 'Emerald Green', value: '#10b981', hsl: '160 84% 39%' },
  { name: 'Purple', value: '#8b5cf6', hsl: '258 90% 66%' },
  { name: 'Pink', value: '#ec4899', hsl: '329 86% 65%' },
  { name: 'Orange', value: '#f97316', hsl: '25 95% 53%' },
  { name: 'Red', value: '#ef4444', hsl: '0 84% 60%' },
  { name: 'Yellow', value: '#eab308', hsl: '45 93% 47%' },
];

export const PredefinedColors: React.FC<PredefinedColorsProps> = ({ onColorSelect }) => {
  return (
    <div>
      <Label className="text-sm font-medium mb-3 block">Quick Colors</Label>
      <div className="grid grid-cols-4 gap-2">
        {predefinedColors.map((color) => (
          <button
            key={color.name}
            onClick={() => onColorSelect(color)}
            className="w-12 h-12 rounded-lg border-2 border-border hover:border-foreground/20 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent overflow-hidden"
            style={{ backgroundColor: color.value }}
            title={color.name}
          />
        ))}
      </div>
    </div>
  );
};
