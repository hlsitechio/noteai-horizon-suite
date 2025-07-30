import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Check, Sparkles } from 'lucide-react';
import { GradientPreset } from '../constants/gradientData';

interface GradientCardProps {
  gradient: GradientPreset;
  isSelected: boolean;
  onApply: (gradient: GradientPreset) => void;
}

export const GradientCard: React.FC<GradientCardProps> = ({
  gradient,
  isSelected,
  onApply
}) => {
  return (
    <Card 
      className={`group cursor-pointer transition-all duration-300 hover:shadow-lg ${
        isSelected ? 'ring-2 ring-primary shadow-lg' : 'hover:border-primary/50'
      }`}
      onClick={() => onApply(gradient)}
    >
      <CardContent className="p-6">
        {/* Large Gradient Preview */}
        <div 
          className="w-full h-24 rounded-lg mb-4 relative overflow-hidden"
          style={{ background: gradient.gradient }}
        >
          {isSelected && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/20">
              <Check className="w-8 h-8 text-white" />
            </div>
          )}
        </div>
        
        {/* Gradient Info */}
        <div className="flex items-start gap-3 mb-4">
          <div className="p-2 bg-muted rounded-lg">
            <Sparkles className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <h4 className="text-lg font-semibold">{gradient.name}</h4>
            <p className="text-sm text-muted-foreground">{gradient.description}</p>
          </div>
        </div>

        {/* Color Breakdown */}
        <div className="flex gap-2">
          {gradient.colors.map((color, index) => (
            <div
              key={index}
              className="flex-1 h-8 rounded border-2 border-white shadow-sm"
              style={{ backgroundColor: `hsl(${color})` }}
              title={`Color ${index + 1}: hsl(${color})`}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};