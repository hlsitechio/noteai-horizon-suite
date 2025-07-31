import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useStatusBar } from '@/hooks/useStatusBar';
import { Save } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const StatusBarSettings: React.FC = () => {
  const { message, isEnabled, updateMessage, toggleEnabled } = useStatusBar();
  const [tempMessage, setTempMessage] = useState(message);

  const handleSave = () => {
    updateMessage(tempMessage);
    toast({
      title: "Status bar updated",
      description: "Your status bar message has been saved.",
    });
  };

  const handleReset = () => {
    setTempMessage("Important reminder: Check your notifications for updates");
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Status Bar Settings</CardTitle>
        <CardDescription>
          Configure your scrolling status bar that appears below the navigation
        </CardDescription>
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

        {/* Message Input */}
        <div className="space-y-2">
          <Label htmlFor="status-message">Status Message</Label>
          <div className="flex gap-2">
            <Input
              id="status-message"
              value={tempMessage}
              onChange={(e) => setTempMessage(e.target.value)}
              placeholder="Enter your status message..."
              className="flex-1"
            />
            <Button onClick={handleReset} variant="outline" size="sm">
              Reset
            </Button>
          </div>
          <p className="text-sm text-muted-foreground">
            This message will scroll across the status bar like a news ticker
          </p>
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
                    animation: 'scroll-left 20s linear infinite'
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
          <Button onClick={handleSave} className="flex items-center gap-2">
            <Save className="w-4 h-4" />
            Save Changes
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default StatusBarSettings;