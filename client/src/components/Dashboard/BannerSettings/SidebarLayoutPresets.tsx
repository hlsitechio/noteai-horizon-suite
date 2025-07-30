import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check, Layout, PanelLeft } from 'lucide-react';
import { useDashboardWorkspace } from '@/hooks/useDashboardWorkspace';
import { toast } from 'sonner';

interface SidebarLayoutPreset {
  id: string;
  name: string;
  description: string;
  sizes: {
    navigation: number;
    content: number;
    footer: number;
  };
  recommended?: boolean;
}

const SIDEBAR_PRESETS: SidebarLayoutPreset[] = [
  {
    id: 'compact',
    name: 'Compact',
    description: 'Small navigation, more content space',
    sizes: { navigation: 25, content: 55, footer: 20 },
  },
  {
    id: 'balanced',
    name: 'Balanced',
    description: 'Equal space distribution',
    sizes: { navigation: 35, content: 45, footer: 20 },
    recommended: true,
  },
  {
    id: 'navigation-focused',
    name: 'Navigation Focused',
    description: 'Large navigation area',
    sizes: { navigation: 50, content: 35, footer: 15 },
  },
  {
    id: 'content-focused',
    name: 'Content Focused',
    description: 'Maximum content space',
    sizes: { navigation: 20, content: 65, footer: 15 },
  },
  {
    id: 'minimal-footer',
    name: 'Minimal Footer',
    description: 'Reduced footer space',
    sizes: { navigation: 40, content: 50, footer: 10 },
  },
];

interface SidebarLayoutPresetsProps {
  onClose?: () => void;
}

const SidebarLayoutPresets: React.FC<SidebarLayoutPresetsProps> = ({ onClose }) => {
  const { workspace, updatePanelSizes } = useDashboardWorkspace();
  const [applying, setApplying] = useState<string | null>(null);

  const currentSizes = workspace?.panel_sizes;

  const isCurrentPreset = (preset: SidebarLayoutPreset) => {
    if (!currentSizes) return false;
    
    return (
      Math.abs((currentSizes.navigation || 40) - preset.sizes.navigation) <= 2 &&
      Math.abs((currentSizes.content || 40) - preset.sizes.content) <= 2 &&
      Math.abs((currentSizes.footer || 20) - preset.sizes.footer) <= 2
    );
  };

  const handleApplyPreset = async (preset: SidebarLayoutPreset) => {
    setApplying(preset.id);
    
    try {
      const success = await updatePanelSizes(preset.sizes);
      
      if (success) {
        toast.success(`Applied "${preset.name}" sidebar layout`);
        if (onClose) {
          setTimeout(onClose, 500);
        }
      } else {
        toast.error('Failed to apply sidebar layout');
      }
    } catch (error) {
      console.error('Error applying sidebar preset:', error);
      toast.error('Failed to apply sidebar layout');
    } finally {
      setApplying(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <PanelLeft className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold">Sidebar Layout Presets</h3>
        </div>
        <p className="text-sm text-muted-foreground">
          Choose from predefined sidebar layouts to quickly configure your workspace
        </p>
      </div>

      <div className="grid gap-4">
        {SIDEBAR_PRESETS.map((preset) => {
          const isCurrent = isCurrentPreset(preset);
          const isApplying = applying === preset.id;

          return (
            <Card 
              key={preset.id} 
              className={`cursor-pointer transition-all hover:shadow-md ${
                isCurrent ? 'ring-2 ring-primary bg-primary/5' : ''
              }`}
              onClick={() => !isApplying && handleApplyPreset(preset)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-base">{preset.name}</CardTitle>
                    {preset.recommended && (
                      <Badge variant="secondary" className="text-xs">
                        Recommended
                      </Badge>
                    )}
                    {isCurrent && (
                      <Badge variant="default" className="text-xs gap-1">
                        <Check className="h-3 w-3" />
                        Current
                      </Badge>
                    )}
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">{preset.description}</p>
              </CardHeader>

              <CardContent className="pt-0">
                <div className="space-y-3">
                  {/* Visual Preview */}
                  <div className="flex h-20 w-full rounded border bg-muted/30 overflow-hidden">
                    <div 
                      className="bg-blue-500/20 border-r flex items-center justify-center"
                      style={{ width: `${preset.sizes.navigation}%` }}
                    >
                      <span className="text-xs font-medium">Nav</span>
                    </div>
                    <div className="flex flex-col flex-1">
                      <div 
                        className="bg-green-500/20 border-b flex items-center justify-center"
                        style={{ height: `${preset.sizes.content}%` }}
                      >
                        <span className="text-xs font-medium">Content</span>
                      </div>
                      <div 
                        className="bg-orange-500/20 flex items-center justify-center"
                        style={{ height: `${preset.sizes.footer}%` }}
                      >
                        <span className="text-xs font-medium">Footer</span>
                      </div>
                    </div>
                  </div>

                  {/* Size Details */}
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Nav: {preset.sizes.navigation}%</span>
                    <span>Content: {preset.sizes.content}%</span>
                    <span>Footer: {preset.sizes.footer}%</span>
                  </div>

                  {/* Apply Button */}
                  <Button 
                    className="w-full" 
                    variant={isCurrent ? "secondary" : "default"}
                    disabled={isApplying}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleApplyPreset(preset);
                    }}
                  >
                    {isApplying ? (
                      <>
                        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                        Applying...
                      </>
                    ) : isCurrent ? (
                      <>
                        <Check className="h-4 w-4 mr-2" />
                        Applied
                      </>
                    ) : (
                      `Apply ${preset.name}`
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default SidebarLayoutPresets;