import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { useStatusBar } from '@/hooks/useStatusBar';
import { StatusBarEmojiPicker } from './StatusBarEmojiPicker';
import { ScrollText, Zap, Save } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';

const StatusBarProfileSettings: React.FC = () => {
  const { message, isEnabled, scrollSpeed, updateMessage, toggleEnabled, updateScrollSpeed } = useStatusBar();
  const [tempMessage, setTempMessage] = useState(message);
  const [tempScrollSpeed, setTempScrollSpeed] = useState(scrollSpeed);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setTempMessage(message);
    setTempScrollSpeed(scrollSpeed);
  }, [message, scrollSpeed]);

  const handleMessageChange = (value: string) => {
    setTempMessage(value);
  };

  const handleEmojiSelect = (emoji: string) => {
    const newMessage = tempMessage + emoji;
    setTempMessage(newMessage);
  };

  const handleSpeedChange = (value: number[]) => {
    setTempScrollSpeed(value[0]);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      updateMessage(tempMessage);
      updateScrollSpeed(tempScrollSpeed);
      toast({
        title: "Settings saved",
        description: "Your status bar settings have been updated successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save settings. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const getSpeedLabel = (speed: number) => {
    if (speed <= 3) return 'Slow';
    if (speed <= 7) return 'Medium';
    return 'Fast';
  };

  const hasChanges = tempMessage !== message || tempScrollSpeed !== scrollSpeed;

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl font-semibold flex items-center gap-2">
          <ScrollText className="w-5 h-5" />
          Status Bar Settings
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Enable/Disable Toggle */}
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="status-enabled">Enable Status Bar</Label>
            <p className="text-sm text-muted-foreground">
              Show or hide the scrolling status bar
            </p>
          </div>
          <Switch
            id="status-enabled"
            checked={isEnabled}
            onCheckedChange={toggleEnabled}
          />
        </div>

        {/* Message Input with Emoji Picker */}
        <div className="space-y-2">
          <Label htmlFor="status-message">Status Message</Label>
          <div className="flex gap-2">
            <Input
              id="status-message"
              value={tempMessage}
              onChange={(e) => handleMessageChange(e.target.value)}
              placeholder="Enter your status message..."
              className="flex-1"
            />
            <StatusBarEmojiPicker onEmojiSelect={handleEmojiSelect} />
          </div>
          <p className="text-sm text-muted-foreground">
            This message will scroll across the status bar like a news ticker
          </p>
        </div>

        {/* Scroll Speed Slider */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="flex items-center gap-2">
              <Zap className="w-4 h-4" />
              Scroll Speed
            </Label>
            <span className="text-sm font-medium text-muted-foreground">
              {getSpeedLabel(tempScrollSpeed)} ({tempScrollSpeed}/10)
            </span>
          </div>
          <div className="px-2">
            <Slider
              value={[tempScrollSpeed]}
              onValueChange={handleSpeedChange}
              max={10}
              min={1}
              step={1}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>Slow</span>
              <span>Fast</span>
            </div>
          </div>
        </div>

        {/* Preview */}
        <div className="space-y-2">
          <Label>Preview</Label>
          <div className="relative bg-gradient-to-r from-primary/20 to-primary/10 border border-primary/20 rounded-md overflow-hidden">
            <div className="flex items-center min-h-[40px] pr-4">
              <div className="flex-1 overflow-hidden relative">
                <div 
                  className="whitespace-nowrap text-sm font-medium text-foreground/90 py-2"
                  style={{
                    animation: `scroll-left ${33 - (tempScrollSpeed * 3)}s linear infinite`
                  }}
                >
                  {tempMessage || "Enter a message to see preview..."}
                </div>
              </div>
            </div>
            <style>{`
              @keyframes scroll-left {
                0% {
                  transform: translateX(100%);
                }
                100% {
                  transform: translateX(-100%);
                }
              }
            `}</style>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <Button 
            onClick={handleSave} 
            disabled={!hasChanges || isSaving}
            className="flex items-center gap-2"
          >
            {isSaving ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default StatusBarProfileSettings;