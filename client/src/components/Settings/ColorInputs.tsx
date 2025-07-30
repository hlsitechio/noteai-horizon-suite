
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

interface ColorInputsProps {
  hexInput: string;
  selectedColor: string;
  onHexInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const ColorInputs: React.FC<ColorInputsProps> = ({
  hexInput,
  selectedColor,
  onHexInputChange
}) => {
  return (
    <div className="flex gap-4 items-end">
      <div className="flex-1">
        <Label htmlFor="hex-input" className="text-xs">Hex Color</Label>
        <Input
          id="hex-input"
          value={hexInput}
          onChange={onHexInputChange}
          className="mt-1 font-mono"
          placeholder="#00CFDE"
        />
      </div>
      <div
        className="w-12 h-10 rounded-lg border border-border"
        style={{ backgroundColor: selectedColor }}
      />
    </div>
  );
};
