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
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sparkles, Wand2, Download, RefreshCw, Settings } from 'lucide-react';
import { toast } from 'sonner';

interface AIGenerateModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onImageGenerated?: (imageUrl: string) => void;
}

const AIGenerateModal: React.FC<AIGenerateModalProps> = ({
  open,
  onOpenChange,
  onImageGenerated
}) => {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImages, setGeneratedImages] = useState<string[]>([]);
  const [selectedStyle, setSelectedStyle] = useState('landscapes');
  const [aspectRatio, setAspectRatio] = useState('16:9');
  const [quality, setQuality] = useState('high');

  const stylePresets = [
    {
      id: 'landscapes',
      name: 'Landscapes',
      description: 'Natural scenery and outdoor views',
      examples: ['Mountain sunset', 'Ocean waves', 'Forest path']
    },
    {
      id: 'abstract',
      name: 'Abstract',
      description: 'Creative and artistic designs',
      examples: ['Fluid colors', 'Geometric patterns', 'Light effects']
    },
    {
      id: 'business',
      name: 'Business',
      description: 'Professional and corporate themes',
      examples: ['Modern office', 'Team meeting', 'Technology']
    },
    {
      id: 'minimal',
      name: 'Minimal',
      description: 'Clean and simple designs',
      examples: ['Clean lines', 'Subtle gradients', 'Whitespace']
    }
  ];

  const quickPrompts = [
    "Abstract gradient landscape with aurora colors",
    "Minimalist geometric mountain silhouette at sunset",
    "Flowing liquid gold abstract background",
    "Cosmic nebula with deep purples and blues",
    "Modern city skyline with neon lights",
    "Peaceful forest with morning mist",
    "Ocean waves with golden hour lighting",
    "Abstract tech pattern with circuit elements"
  ];

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast.error('Please enter a prompt');
      return;
    }

    setIsGenerating(true);
    try {
      // Simulate AI generation - in real app this would call an API
      toast.success('AI generation started...');
      
      // Mock delay for generation
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // For now, show placeholder message instead of external images
      // In production, this would generate actual AI images
      setGeneratedImages([]);
      toast.success('AI generation will be available soon. Please use image upload for now.');
    } catch (error) {
      toast.error('Failed to generate images');
      console.error('AI generation error:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSelectImage = (imageUrl: string) => {
    onImageGenerated?.(imageUrl);
    onOpenChange(false);
    toast.success('Banner updated with AI-generated image!');
  };

  const selectedStylePreset = stylePresets.find(s => s.id === selectedStyle);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5" />
            AI Banner Generator
          </DialogTitle>
          <DialogDescription>
            Let AI create a unique banner for you. Describe what you want or choose from presets.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Generation Settings */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Style</Label>
              <Select value={selectedStyle} onValueChange={setSelectedStyle}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {stylePresets.map((style) => (
                    <SelectItem key={style.id} value={style.id}>
                      {style.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Aspect Ratio</Label>
              <Select value={aspectRatio} onValueChange={setAspectRatio}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="16:9">16:9 (Widescreen)</SelectItem>
                  <SelectItem value="4:3">4:3 (Standard)</SelectItem>
                  <SelectItem value="21:9">21:9 (Ultra-wide)</SelectItem>
                  <SelectItem value="1:1">1:1 (Square)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Quality</Label>
              <Select value={quality} onValueChange={setQuality}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="standard">Standard</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="ultra">Ultra</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Style Info */}
          {selectedStylePreset && (
            <Card>
              <CardContent className="p-4">
                <div className="space-y-2">
                  <h3 className="font-medium">{selectedStylePreset.name}</h3>
                  <p className="text-sm text-muted-foreground">{selectedStylePreset.description}</p>
                  <div className="flex gap-2">
                    {selectedStylePreset.examples.map((example, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {example}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Prompt Input */}
          <div className="space-y-3">
            <Label>Describe your banner</Label>
            <Textarea
              placeholder="Describe what you want your banner to look like..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              rows={3}
            />
            
            {/* Quick Prompts */}
            <div className="space-y-2">
              <Label className="text-sm">Quick prompts:</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {quickPrompts.map((quickPrompt, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    className="text-left justify-start h-auto py-2 px-3"
                    onClick={() => setPrompt(quickPrompt)}
                  >
                    <span className="text-xs">{quickPrompt}</span>
                  </Button>
                ))}
              </div>
            </div>
          </div>

          {/* Generate Button */}
          <div className="flex gap-2">
            <Button
              onClick={handleGenerate}
              disabled={isGenerating || !prompt.trim()}
              className="flex-1"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Wand2 className="h-4 w-4 mr-2" />
                  Generate Banner
                </>
              )}
            </Button>
            <Button variant="outline" size="icon">
              <Settings className="h-4 w-4" />
            </Button>
          </div>

          {/* Generated Images */}
          {generatedImages.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-lg font-semibold">Generated Images</h3>
              <div className="grid grid-cols-2 gap-4">
                {generatedImages.map((imageUrl, index) => (
                  <Card
                    key={index}
                    className="cursor-pointer group hover:shadow-lg transition-all overflow-hidden"
                    onClick={() => handleSelectImage(imageUrl)}
                  >
                    <CardContent className="p-0">
                      <div className="relative">
                        <img
                          src={imageUrl}
                          alt={`Generated ${index + 1}`}
                          className="w-full h-32 object-cover group-hover:scale-105 transition-transform"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <Button size="sm" variant="secondary">
                            <Download className="h-4 w-4 mr-2" />
                            Use This
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          {generatedImages.length > 0 && (
            <Button onClick={() => handleGenerate()}>
              Generate More
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AIGenerateModal;