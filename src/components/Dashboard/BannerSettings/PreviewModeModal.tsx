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
import { Play, Monitor, Smartphone, Tablet, Maximize2, RotateCcw, Share2 } from 'lucide-react';

interface PreviewModeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  bannerUrl?: string;
}

const PreviewModeModal: React.FC<PreviewModeModalProps> = ({
  open,
  onOpenChange,
  bannerUrl
}) => {
  const [selectedDevice, setSelectedDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [showFullscreen, setShowFullscreen] = useState(false);

  const deviceSizes = {
    desktop: { width: '100%', height: '400px', maxWidth: '800px' },
    tablet: { width: '768px', height: '300px', maxWidth: '768px' },
    mobile: { width: '375px', height: '200px', maxWidth: '375px' }
  };

  const deviceIcons = {
    desktop: Monitor,
    tablet: Tablet,
    mobile: Smartphone
  };

  const currentSize = deviceSizes[selectedDevice];
  const DeviceIcon = deviceIcons[selectedDevice];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Play className="h-5 w-5" />
            Preview Mode
          </DialogTitle>
          <DialogDescription>
            Preview how your banner looks across different devices and screen sizes.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Device Selection */}
          <div className="flex gap-2 justify-center">
            {Object.entries(deviceSizes).map(([device, _]) => {
              const Icon = deviceIcons[device as keyof typeof deviceIcons];
              return (
                <Button
                  key={device}
                  variant={selectedDevice === device ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedDevice(device as any)}
                  className="gap-2"
                >
                  <Icon className="h-4 w-4" />
                  {device.charAt(0).toUpperCase() + device.slice(1)}
                </Button>
              );
            })}
          </div>

          {/* Device Info */}
          <div className="text-center">
            <Badge variant="secondary" className="gap-1">
              <DeviceIcon className="h-3 w-3" />
              {selectedDevice === 'desktop' && '1920x1080 Desktop'}
              {selectedDevice === 'tablet' && '768x1024 Tablet'}
              {selectedDevice === 'mobile' && '375x812 Mobile'}
            </Badge>
          </div>

          {/* Preview Container */}
          <div className="flex justify-center">
            <div 
              className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 transition-all duration-300"
              style={{ 
                width: selectedDevice === 'desktop' ? '100%' : currentSize.width,
                maxWidth: currentSize.maxWidth
              }}
            >
              {/* Mock Browser/Device Frame */}
              <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg overflow-hidden">
                {/* Browser Header (for desktop) */}
                {selectedDevice === 'desktop' && (
                  <div className="bg-gray-200 dark:bg-gray-700 px-4 py-2 flex items-center gap-2">
                    <div className="flex gap-1">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    </div>
                    <div className="flex-1 bg-white dark:bg-gray-800 rounded px-3 py-1 text-xs text-muted-foreground">
                      https://yoursite.com/dashboard
                    </div>
                  </div>
                )}

                {/* Banner Preview */}
                <div 
                  className="relative overflow-hidden"
                  style={{ height: currentSize.height }}
                >
                  {bannerUrl ? (
                    <img
                      src={bannerUrl}
                      alt="Banner Preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                      <div className="text-center">
                        <h3 className="text-xl font-bold mb-2">Your Banner Here</h3>
                        <p className="text-muted-foreground">Upload or generate a banner to preview</p>
                      </div>
                    </div>
                  )}

                  {/* Overlay with sample content */}
                  <div className="absolute bottom-4 left-4 right-4">
                    <Card className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm">
                      <CardContent className="p-4">
                        <h2 className="text-lg font-bold mb-1">Welcome to Dashboard</h2>
                        <p className="text-sm text-muted-foreground">
                          Your personalized workspace
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                </div>

                {/* Mock Dashboard Content Below Banner */}
                <div className="p-4 space-y-3">
                  <div className="flex gap-3">
                    <div className="w-8 h-8 bg-primary/20 rounded"></div>
                    <div className="flex-1">
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                      <div className="h-3 bg-gray-100 dark:bg-gray-800 rounded w-2/3"></div>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="h-12 bg-gray-100 dark:bg-gray-800 rounded"></div>
                    <div className="h-12 bg-gray-100 dark:bg-gray-800 rounded"></div>
                    <div className="h-12 bg-gray-100 dark:bg-gray-800 rounded"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Preview Controls */}
          <div className="flex justify-center gap-2">
            <Button variant="outline" size="sm" className="gap-2">
              <RotateCcw className="h-4 w-4" />
              Reset
            </Button>
            <Button variant="outline" size="sm" className="gap-2">
              <Maximize2 className="h-4 w-4" />
              Fullscreen
            </Button>
            <Button variant="outline" size="sm" className="gap-2">
              <Share2 className="h-4 w-4" />
              Share Preview
            </Button>
          </div>

          {/* Device Stats */}
          <div className="grid grid-cols-3 gap-4 text-center">
            <Card>
              <CardContent className="p-3">
                <div className="text-2xl font-bold text-primary">92%</div>
                <div className="text-xs text-muted-foreground">Mobile Users</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-3">
                <div className="text-2xl font-bold text-primary">1.2s</div>
                <div className="text-xs text-muted-foreground">Load Time</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-3">
                <div className="text-2xl font-bold text-primary">98%</div>
                <div className="text-xs text-muted-foreground">Compatibility</div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close Preview
          </Button>
          <Button>
            Apply Changes
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PreviewModeModal;