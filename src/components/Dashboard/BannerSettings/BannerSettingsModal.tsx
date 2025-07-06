import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Settings, Monitor, Smartphone, Tablet } from 'lucide-react';

interface BannerSettingsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const BannerSettingsModal: React.FC<BannerSettingsModalProps> = ({
  open,
  onOpenChange
}) => {
  const [settings, setSettings] = useState({
    autoplay: true,
    loop: true,
    muted: true,
    showControls: false,
    aspectRatio: 'auto',
    quality: 'high',
    parallaxEffect: false,
    blurBackground: false,
    opacity: [100],
    borderRadius: [8],
  });

  const handleSettingChange = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Banner Settings
          </DialogTitle>
          <DialogDescription>
            Configure your banner display and behavior settings.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Video Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Video Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="autoplay">Autoplay</Label>
                <Switch
                  id="autoplay"
                  checked={settings.autoplay}
                  onCheckedChange={(checked) => handleSettingChange('autoplay', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="loop">Loop Video</Label>
                <Switch
                  id="loop"
                  checked={settings.loop}
                  onCheckedChange={(checked) => handleSettingChange('loop', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="muted">Start Muted</Label>
                <Switch
                  id="muted"
                  checked={settings.muted}
                  onCheckedChange={(checked) => handleSettingChange('muted', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="controls">Show Controls</Label>
                <Switch
                  id="controls"
                  checked={settings.showControls}
                  onCheckedChange={(checked) => handleSettingChange('showControls', checked)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Display Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Display Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Aspect Ratio</Label>
                <Select
                  value={settings.aspectRatio}
                  onValueChange={(value) => handleSettingChange('aspectRatio', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="auto">Auto</SelectItem>
                    <SelectItem value="16:9">16:9 (Widescreen)</SelectItem>
                    <SelectItem value="4:3">4:3 (Standard)</SelectItem>
                    <SelectItem value="21:9">21:9 (Ultra-wide)</SelectItem>
                    <SelectItem value="1:1">1:1 (Square)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Quality</Label>
                <Select
                  value={settings.quality}
                  onValueChange={(value) => handleSettingChange('quality', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low (Faster)</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High (Better)</SelectItem>
                    <SelectItem value="auto">Auto</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Opacity: {settings.opacity[0]}%</Label>
                <Slider
                  value={settings.opacity}
                  onValueChange={(value) => handleSettingChange('opacity', value)}
                  max={100}
                  min={10}
                  step={5}
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <Label>Border Radius: {settings.borderRadius[0]}px</Label>
                <Slider
                  value={settings.borderRadius}
                  onValueChange={(value) => handleSettingChange('borderRadius', value)}
                  max={24}
                  min={0}
                  step={2}
                  className="w-full"
                />
              </div>
            </CardContent>
          </Card>

          {/* Effects */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Visual Effects</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="parallax">Parallax Effect</Label>
                <Switch
                  id="parallax"
                  checked={settings.parallaxEffect}
                  onCheckedChange={(checked) => handleSettingChange('parallaxEffect', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="blur">Blur Background</Label>
                <Switch
                  id="blur"
                  checked={settings.blurBackground}
                  onCheckedChange={(checked) => handleSettingChange('blurBackground', checked)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Responsive Preview */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Responsive Preview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="gap-2">
                  <Monitor className="h-4 w-4" />
                  Desktop
                </Button>
                <Button variant="outline" size="sm" className="gap-2">
                  <Tablet className="h-4 w-4" />
                  Tablet
                </Button>
                <Button variant="outline" size="sm" className="gap-2">
                  <Smartphone className="h-4 w-4" />
                  Mobile
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={() => onOpenChange(false)}>
            Save Settings
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BannerSettingsModal;