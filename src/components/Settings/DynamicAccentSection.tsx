
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Palette, Sparkles, Image, Video } from 'lucide-react';
import { useDynamicAccent } from '../../contexts/DynamicAccentContext';
import { useAccentColor } from '../../contexts/AccentColorContext';

const DynamicAccentSection: React.FC = () => {
  const { 
    isDynamicAccentEnabled, 
    setDynamicAccentEnabled, 
    isExtracting, 
    lastExtractedColor 
  } = useDynamicAccent();
  const { accentColor } = useAccentColor();

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent/10 to-accent/5 flex items-center justify-center border border-accent/10">
            <Sparkles className="w-5 h-5 text-accent" />
          </div>
          <div>
            <CardTitle className="text-lg font-semibold">Dynamic Accent Colors</CardTitle>
            <p className="text-sm text-muted-foreground">
              Automatically extract colors from your uploaded images and videos
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Enable/Disable Toggle */}
        <div className="flex items-center justify-between p-4 rounded-lg border border-border/10 bg-card/50">
          <div className="flex items-center gap-3">
            <Palette className="w-5 h-5 text-muted-foreground" />
            <div>
              <p className="font-medium">Auto-Extract Colors</p>
              <p className="text-sm text-muted-foreground">
                Extract dominant colors from banner uploads
              </p>
            </div>
          </div>
          <Switch 
            checked={isDynamicAccentEnabled}
            onCheckedChange={setDynamicAccentEnabled}
          />
        </div>

        {/* Status and Info */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <h4 className="text-sm font-semibold">Status</h4>
            {isDynamicAccentEnabled ? (
              <Badge variant="secondary" className="bg-accent/10 text-accent border-accent/20">
                Enabled
              </Badge>
            ) : (
              <Badge variant="outline">
                Disabled
              </Badge>
            )}
            {isExtracting && (
              <Badge variant="secondary" className="bg-blue-500/10 text-blue-500 border-blue-500/20">
                Extracting...
              </Badge>
            )}
          </div>

          {/* Current Color Info */}
          <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
            <div 
              className="w-8 h-8 rounded-lg border-2 border-white/20"
              style={{ backgroundColor: accentColor }}
            />
            <div>
              <p className="text-sm font-medium">Current Accent Color</p>
              <p className="text-xs text-muted-foreground">{accentColor}</p>
            </div>
          </div>

          {/* Last Extracted Color */}
          {lastExtractedColor && (
            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
              <div 
                className="w-8 h-8 rounded-lg border-2 border-white/20"
                style={{ backgroundColor: lastExtractedColor.hex }}
              />
              <div>
                <p className="text-sm font-medium">Last Extracted Color</p>
                <p className="text-xs text-muted-foreground">{lastExtractedColor.hex}</p>
              </div>
            </div>
          )}

          {/* How it works */}
          <div className="p-4 rounded-lg bg-accent/5 border border-accent/10">
            <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              How it works
            </h4>
            <div className="space-y-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Image className="w-4 h-4" />
                <span>Upload an image or video as your dashboard banner</span>
              </div>
              <div className="flex items-center gap-2">
                <Palette className="w-4 h-4" />
                <span>The system extracts the most vibrant, dominant color</span>
              </div>
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                <span>Your accent color updates automatically to match</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DynamicAccentSection;
