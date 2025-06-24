
import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { hexToRgb, rgbToHex, rgbToHsl, hslToRgb, hslToHslString } from '../../utils/colorUtils';

interface AdvancedColorPickerProps {
  currentColor: string;
  onColorChange: (color: { name: string; value: string; hsl: string }) => void;
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

export const AdvancedColorPicker: React.FC<AdvancedColorPickerProps> = ({
  currentColor,
  onColorChange
}) => {
  const [selectedColor, setSelectedColor] = useState(currentColor);
  const [hue, setHue] = useState(187);
  const [saturation, setSaturation] = useState(100);
  const [lightness, setLightness] = useState(42);
  const [hexInput, setHexInput] = useState(currentColor);
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const hueCanvasRef = useRef<HTMLCanvasElement>(null);
  
  // Initialize HSL values from current color
  useEffect(() => {
    const rgb = hexToRgb(currentColor);
    if (rgb) {
      const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
      setHue(hsl.h);
      setSaturation(hsl.s);
      setLightness(hsl.l);
      setHexInput(currentColor);
      setSelectedColor(currentColor);
    }
  }, [currentColor]);

  // Update color when HSL changes
  useEffect(() => {
    const rgb = hslToRgb(hue, saturation, lightness);
    const hex = rgbToHex(rgb.r, rgb.g, rgb.b);
    setSelectedColor(hex);
    setHexInput(hex);
  }, [hue, saturation, lightness]);

  // Draw color picker canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    // Create gradient for saturation and lightness
    for (let x = 0; x < width; x++) {
      for (let y = 0; y < height; y++) {
        const s = (x / width) * 100;
        const l = ((height - y) / height) * 100;
        const rgb = hslToRgb(hue, s, l);
        ctx.fillStyle = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
        ctx.fillRect(x, y, 1, 1);
      }
    }
  }, [hue]);

  // Draw hue slider
  useEffect(() => {
    const canvas = hueCanvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    for (let y = 0; y < height; y++) {
      const h = (y / height) * 360;
      const rgb = hslToRgb(h, 100, 50);
      ctx.fillStyle = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
      ctx.fillRect(0, y, width, 1);
    }
  }, []);

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const newSaturation = (x / canvas.width) * 100;
    const newLightness = ((canvas.height - y) / canvas.height) * 100;

    setSaturation(Math.round(newSaturation));
    setLightness(Math.round(newLightness));
  };

  const handleHueCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = hueCanvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const y = e.clientY - rect.top;
    const newHue = (y / canvas.height) * 360;

    setHue(Math.round(newHue));
  };

  const handleHexInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setHexInput(value);

    if (/^#[0-9A-F]{6}$/i.test(value)) {
      const rgb = hexToRgb(value);
      if (rgb) {
        const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
        setHue(hsl.h);
        setSaturation(hsl.s);
        setLightness(hsl.l);
        setSelectedColor(value);
      }
    }
  };

  const handleApplyColor = () => {
    const hslString = hslToHslString(hue, saturation, lightness);
    onColorChange({
      name: 'Custom Color',
      value: selectedColor,
      hsl: hslString
    });
  };

  const handlePredefinedColorClick = (color: typeof predefinedColors[0]) => {
    onColorChange(color);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Accent Color</CardTitle>
        <p className="text-sm text-muted-foreground">
          Choose from presets or create a custom accent color
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Predefined Colors */}
        <div>
          <Label className="text-sm font-medium mb-3 block">Quick Colors</Label>
          <div className="grid grid-cols-4 gap-2">
            {predefinedColors.map((color) => (
              <button
                key={color.name}
                onClick={() => handlePredefinedColorClick(color)}
                className="w-12 h-12 rounded-lg border-2 border-border hover:border-foreground/20 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent overflow-hidden"
                style={{ backgroundColor: color.value }}
                title={color.name}
              />
            ))}
          </div>
        </div>

        {/* Custom Color Picker */}
        <div>
          <Label className="text-sm font-medium mb-3 block">Custom Color</Label>
          <div className="flex gap-4">
            {/* Main Color Area */}
            <div className="flex-1">
              <div className="relative">
                <canvas
                  ref={canvasRef}
                  width={200}
                  height={150}
                  className="w-full h-32 rounded-lg border cursor-crosshair"
                  onClick={handleCanvasClick}
                />
                {/* Color picker indicator */}
                <div
                  className="absolute w-3 h-3 border-2 border-white rounded-full pointer-events-none shadow-lg"
                  style={{
                    left: `${(saturation / 100) * 100}%`,
                    top: `${(1 - lightness / 100) * 100}%`,
                    transform: 'translate(-50%, -50%)'
                  }}
                />
              </div>
            </div>

            {/* Hue Slider */}
            <div className="w-6">
              <canvas
                ref={hueCanvasRef}
                width={24}
                height={150}
                className="w-6 h-32 rounded cursor-pointer"
                onClick={handleHueCanvasClick}
              />
              {/* Hue indicator */}
              <div
                className="absolute w-8 h-1 border border-white rounded-sm pointer-events-none shadow-lg -ml-1"
                style={{
                  top: `${(hue / 360) * 100}%`,
                  backgroundColor: `hsl(${hue}, 100%, 50%)`
                }}
              />
            </div>
          </div>
        </div>

        {/* Color Values */}
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label className="text-xs">Hue</Label>
              <Slider
                value={[hue]}
                onValueChange={(value) => setHue(value[0])}
                max={360}
                step={1}
                className="mt-1"
              />
              <div className="text-xs text-muted-foreground mt-1">{hue}°</div>
            </div>
            <div>
              <Label className="text-xs">Saturation</Label>
              <Slider
                value={[saturation]}
                onValueChange={(value) => setSaturation(value[0])}
                max={100}
                step={1}
                className="mt-1"
              />
              <div className="text-xs text-muted-foreground mt-1">{saturation}%</div>
            </div>
            <div>
              <Label className="text-xs">Lightness</Label>
              <Slider
                value={[lightness]}
                onValueChange={(value) => setLightness(value[0])}
                max={100}
                step={1}
                className="mt-1"
              />
              <div className="text-xs text-muted-foreground mt-1">{lightness}%</div>
            </div>
          </div>

          <div className="flex gap-4 items-end">
            <div className="flex-1">
              <Label htmlFor="hex-input" className="text-xs">Hex Color</Label>
              <Input
                id="hex-input"
                value={hexInput}
                onChange={handleHexInputChange}
                className="mt-1 font-mono"
                placeholder="#00CFDE"
              />
            </div>
            <div
              className="w-12 h-10 rounded-lg border border-border"
              style={{ backgroundColor: selectedColor }}
            />
          </div>
        </div>

        {/* Apply Button */}
        <Button 
          onClick={handleApplyColor}
          className="w-full"
          disabled={selectedColor === currentColor}
        >
          Apply Color
        </Button>

        {/* Current Color Display */}
        <div className="p-3 bg-muted rounded-lg">
          <p className="text-sm text-muted-foreground">
            Current color: <span className="font-medium font-mono">{currentColor}</span>
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
