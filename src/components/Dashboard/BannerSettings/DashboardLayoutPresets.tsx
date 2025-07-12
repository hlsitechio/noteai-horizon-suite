import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check, Layout, LayoutDashboard } from 'lucide-react';
import { useDashboardWorkspace } from '@/hooks/useDashboardWorkspace';
import { toast } from 'sonner';

interface DashboardLayoutPreset {
  id: string;
  name: string;
  description: string;
  sizes: {
    banner: number;
    analytics: number;
    topSection: number;
    bottomSection: number;
    leftPanels: number;
    rightPanels: number;
  };
  recommended?: boolean;
}

const DASHBOARD_PRESETS: DashboardLayoutPreset[] = [
  {
    id: 'banner-focused',
    name: 'Banner Focused',
    description: 'Large banner area for visual impact',
    sizes: { 
      banner: 40, 
      analytics: 25, 
      topSection: 35, 
      bottomSection: 40, 
      leftPanels: 45, 
      rightPanels: 55 
    },
    recommended: true,
  },
  {
    id: 'analytics-focused',
    name: 'Analytics Focused',
    description: 'Emphasis on data and analytics',
    sizes: { 
      banner: 25, 
      analytics: 40, 
      topSection: 35, 
      bottomSection: 40, 
      leftPanels: 50, 
      rightPanels: 50 
    },
  },
  {
    id: 'balanced-view',
    name: 'Balanced View',
    description: 'Equal distribution across sections',
    sizes: { 
      banner: 30, 
      analytics: 30, 
      topSection: 40, 
      bottomSection: 40, 
      leftPanels: 50, 
      rightPanels: 50 
    },
  },
  {
    id: 'compact-banner',
    name: 'Compact Banner',
    description: 'Minimal banner, more content space',
    sizes: { 
      banner: 20, 
      analytics: 35, 
      topSection: 45, 
      bottomSection: 35, 
      leftPanels: 45, 
      rightPanels: 55 
    },
  },
  {
    id: 'content-heavy',
    name: 'Content Heavy',
    description: 'Maximum space for dashboard content',
    sizes: { 
      banner: 15, 
      analytics: 25, 
      topSection: 60, 
      bottomSection: 40, 
      leftPanels: 40, 
      rightPanels: 60 
    },
  },
];

interface DashboardLayoutPresetsProps {
  onClose?: () => void;
}

const DashboardLayoutPresets: React.FC<DashboardLayoutPresetsProps> = ({ onClose }) => {
  const { workspace, updatePanelSizes } = useDashboardWorkspace();
  const [applying, setApplying] = useState<string | null>(null);

  const currentSizes = workspace?.panel_sizes;

  const isCurrentPreset = (preset: DashboardLayoutPreset) => {
    if (!currentSizes) return false;
    
    const tolerance = 3; // Allow 3% tolerance for matching
    return (
      Math.abs((currentSizes.banner || 25) - preset.sizes.banner) <= tolerance &&
      Math.abs((currentSizes.analytics || 30) - preset.sizes.analytics) <= tolerance &&
      Math.abs((currentSizes.topSection || 35) - preset.sizes.topSection) <= tolerance &&
      Math.abs((currentSizes.bottomSection || 35) - preset.sizes.bottomSection) <= tolerance &&
      Math.abs((currentSizes.leftPanels || 50) - preset.sizes.leftPanels) <= tolerance &&
      Math.abs((currentSizes.rightPanels || 50) - preset.sizes.rightPanels) <= tolerance
    );
  };

  const handleApplyPreset = async (preset: DashboardLayoutPreset) => {
    setApplying(preset.id);
    
    try {
      const success = await updatePanelSizes(preset.sizes);
      
      if (success) {
        toast.success(`Applied "${preset.name}" dashboard layout`);
        if (onClose) {
          setTimeout(onClose, 500);
        }
      } else {
        toast.error('Failed to apply dashboard layout');
      }
    } catch (error) {
      console.error('Error applying dashboard preset:', error);
      toast.error('Failed to apply dashboard layout');
    } finally {
      setApplying(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <LayoutDashboard className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold">Dashboard Layout Presets</h3>
        </div>
        <p className="text-sm text-muted-foreground">
          Choose from predefined dashboard layouts to optimize your workspace
        </p>
      </div>

      <div className="grid gap-4">
        {DASHBOARD_PRESETS.map((preset) => {
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
                  <div className="space-y-1">
                    {/* Banner Area */}
                    <div 
                      className="w-full bg-purple-500/20 rounded border flex items-center justify-center"
                      style={{ height: `${Math.max(preset.sizes.banner * 0.8, 15)}px` }}
                    >
                      <span className="text-xs font-medium">Banner ({preset.sizes.banner}%)</span>
                    </div>
                    
                    {/* Main Content Area */}
                    <div className="flex gap-1" style={{ height: '40px' }}>
                      {/* Left Side */}
                      <div className="flex flex-col gap-1" style={{ width: `${preset.sizes.leftPanels}%` }}>
                        <div 
                          className="bg-blue-500/20 rounded border flex items-center justify-center text-xs"
                          style={{ height: `${preset.sizes.analytics * 0.4}px` }}
                        >
                          Analytics
                        </div>
                        <div 
                          className="bg-green-500/20 rounded border flex items-center justify-center text-xs flex-1"
                        >
                          Top
                        </div>
                      </div>
                      
                      {/* Right Side */}
                      <div 
                        className="bg-orange-500/20 rounded border flex items-center justify-center text-xs"
                        style={{ width: `${preset.sizes.rightPanels}%` }}
                      >
                        Right Panel
                      </div>
                    </div>
                  </div>

                  {/* Size Details */}
                  <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                    <div>Banner: {preset.sizes.banner}%</div>
                    <div>Analytics: {preset.sizes.analytics}%</div>
                    <div>Left: {preset.sizes.leftPanels}%</div>
                    <div>Right: {preset.sizes.rightPanels}%</div>
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

export default DashboardLayoutPresets;