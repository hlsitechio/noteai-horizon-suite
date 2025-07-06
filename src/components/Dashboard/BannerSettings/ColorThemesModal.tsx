import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Palette, Check, Sparkles } from 'lucide-react';

interface ColorThemesModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ColorThemesModal: React.FC<ColorThemesModalProps> = ({
  open,
  onOpenChange
}) => {
  const [selectedTheme, setSelectedTheme] = useState('default');

  const colorThemes = [
    {
      id: 'default',
      name: 'Ocean Breeze',
      colors: ['#0ea5e9', '#06b6d4', '#3b82f6', '#1d4ed8'],
      gradient: 'from-blue-500 to-cyan-500',
      description: 'Cool and calming blues'
    },
    {
      id: 'sunset',
      name: 'Sunset Glow',
      colors: ['#f59e0b', '#ef4444', '#ec4899', '#8b5cf6'],
      gradient: 'from-amber-500 via-red-500 to-pink-500',
      description: 'Warm sunset colors'
    },
    {
      id: 'forest',
      name: 'Forest Green',
      colors: ['#10b981', '#059669', '#047857', '#065f46'],
      gradient: 'from-emerald-500 to-green-600',
      description: 'Natural green tones'
    },
    {
      id: 'purple',
      name: 'Royal Purple',
      colors: ['#8b5cf6', '#7c3aed', '#6d28d9', '#5b21b6'],
      gradient: 'from-violet-500 to-purple-600',
      description: 'Rich purple shades'
    },
    {
      id: 'monochrome',
      name: 'Monochrome',
      colors: ['#374151', '#4b5563', '#6b7280', '#9ca3af'],
      gradient: 'from-gray-700 to-gray-500',
      description: 'Classic grayscale'
    },
    {
      id: 'neon',
      name: 'Neon Dreams',
      colors: ['#06ffa5', '#00d4ff', '#7c3aed', '#f72585'],
      gradient: 'from-cyan-400 via-purple-500 to-pink-500',
      description: 'Vibrant neon colors'
    }
  ];

  const gradientPresets = [
    {
      name: 'Aurora',
      gradient: 'bg-gradient-to-r from-green-300 via-blue-500 to-purple-600',
      value: 'linear-gradient(to right, #86efac, #3b82f6, #9333ea)'
    },
    {
      name: 'Fire',
      gradient: 'bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500',
      value: 'linear-gradient(to right, #ef4444, #f97316, #eab308)'
    },
    {
      name: 'Ocean',
      gradient: 'bg-gradient-to-r from-blue-600 via-cyan-500 to-teal-400',
      value: 'linear-gradient(to right, #2563eb, #06b6d4, #2dd4bf)'
    },
    {
      name: 'Space',
      gradient: 'bg-gradient-to-r from-purple-900 via-blue-900 to-indigo-900',
      value: 'linear-gradient(to right, #581c87, #1e3a8a, #312e81)'
    }
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5" />
            Color Themes
          </DialogTitle>
          <DialogDescription>
            Choose a color theme for your banner or create custom gradients.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Color Themes */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Preset Themes</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {colorThemes.map((theme) => (
                <Card
                  key={theme.id}
                  className={`cursor-pointer transition-all hover:shadow-md ${
                    selectedTheme === theme.id ? 'ring-2 ring-primary' : ''
                  }`}
                  onClick={() => setSelectedTheme(theme.id)}
                >
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      <div className={`h-20 rounded-lg bg-gradient-to-r ${theme.gradient}`} />
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">{theme.name}</h4>
                          <p className="text-sm text-muted-foreground">{theme.description}</p>
                        </div>
                        {selectedTheme === theme.id && (
                          <Check className="h-5 w-5 text-primary" />
                        )}
                      </div>
                      
                      <div className="flex gap-1">
                        {theme.colors.map((color, index) => (
                          <div
                            key={index}
                            className="w-6 h-6 rounded-full border border-border"
                            style={{ backgroundColor: color }}
                          />
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Gradient Presets */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Sparkles className="h-5 w-5" />
              Gradient Presets
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {gradientPresets.map((preset) => (
                <Card key={preset.name} className="cursor-pointer hover:shadow-md transition-all">
                  <CardContent className="p-3">
                    <div className="space-y-2">
                      <div className={`h-12 rounded ${preset.gradient}`} />
                      <div className="text-center">
                        <Badge variant="secondary" className="text-xs">
                          {preset.name}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Custom Color Controls */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Custom Colors</h3>
            <Card>
              <CardContent className="p-4">
                <div className="space-y-4">
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <label className="text-sm font-medium">Primary Color</label>
                      <div className="flex gap-2 mt-1">
                        <input
                          type="color"
                          className="w-12 h-8 rounded border cursor-pointer"
                          defaultValue="#3b82f6"
                        />
                        <input
                          type="text"
                          className="flex-1 px-3 py-1 text-sm border rounded"
                          defaultValue="#3b82f6"
                        />
                      </div>
                    </div>
                    <div className="flex-1">
                      <label className="text-sm font-medium">Secondary Color</label>
                      <div className="flex gap-2 mt-1">
                        <input
                          type="color"
                          className="w-12 h-8 rounded border cursor-pointer"
                          defaultValue="#06b6d4"
                        />
                        <input
                          type="text"
                          className="flex-1 px-3 py-1 text-sm border rounded"
                          defaultValue="#06b6d4"
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="h-16 rounded bg-gradient-to-r from-blue-500 to-cyan-500" />
                  
                  <Button variant="outline" size="sm">
                    Generate Random Gradient
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={() => onOpenChange(false)}>
            Apply Theme
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ColorThemesModal;