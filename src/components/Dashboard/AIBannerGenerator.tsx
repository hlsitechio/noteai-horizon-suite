
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Wand2, Sparkles, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface AIBannerGeneratorProps {
  onBannerGenerated: (imageUrl: string) => void;
}

const AIBannerGenerator: React.FC<AIBannerGeneratorProps> = ({ onBannerGenerated }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const suggestedPrompts = [
    "A serene mountain landscape at sunrise with soft purple and orange clouds",
    "Abstract geometric patterns in blue and purple gradients, modern minimalist style",
    "A peaceful forest scene with morning mist and golden sunlight filtering through trees",
    "Cosmic space background with nebula and stars in deep blues and purples",
    "Modern city skyline silhouette at sunset with warm gradient colors"
  ];

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast.error('Please enter a prompt to generate your banner');
      return;
    }

    setIsGenerating(true);
    console.log('Generating AI banner with prompt:', prompt);

    try {
      const { data, error } = await supabase.functions.invoke('generate-banner-image', {
        body: { 
          prompt: `Dashboard banner: ${prompt}. High quality, professional, 1920x1080 aspect ratio, suitable for web banner` 
        }
      });

      if (error) {
        console.error('Banner generation error:', error);
        toast.error('Failed to generate banner. Please try again.');
        return;
      }

      if (data?.image) {
        console.log('Banner generated successfully');
        onBannerGenerated(data.image);
        setIsOpen(false);
        setPrompt('');
        toast.success('AI banner generated successfully!');
      } else {
        toast.error('No image received from AI service');
      }
    } catch (error) {
      console.error('Unexpected error generating banner:', error);
      toast.error('An unexpected error occurred. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="bg-background/80 hover:bg-background/90 backdrop-blur-sm border-border/50"
        >
          <Wand2 className="w-4 h-4 mr-2" />
          Generate AI Banner
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-500" />
            AI Banner Generator
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="space-y-3">
            <Label htmlFor="prompt">Describe your ideal banner</Label>
            <Textarea
              id="prompt"
              placeholder="e.g., A peaceful mountain landscape with sunset colors..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              rows={4}
              className="resize-none"
            />
          </div>

          {/* Suggested Prompts */}
          <div className="space-y-3">
            <Label>Quick Ideas</Label>
            <div className="grid grid-cols-1 gap-2 max-h-32 overflow-y-auto">
              {suggestedPrompts.map((suggestion, index) => (
                <Button
                  key={index}
                  variant="ghost"
                  size="sm"
                  onClick={() => setPrompt(suggestion)}
                  className="text-left justify-start h-auto p-2 text-wrap"
                >
                  {suggestion}
                </Button>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={() => setIsOpen(false)} disabled={isGenerating}>
              Cancel
            </Button>
            <Button 
              onClick={handleGenerate} 
              disabled={isGenerating || !prompt.trim()}
              className="bg-purple-600 hover:bg-purple-700"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Wand2 className="w-4 h-4 mr-2" />
                  Generate Banner
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AIBannerGenerator;
