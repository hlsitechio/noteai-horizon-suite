
import React from 'react';
import { Settings, ChevronRight, Moon, Sun, Bell, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useTheme } from '@/providers/ThemeProvider';
import SyncStatusIndicator from '../../components/SyncStatusIndicator';
import { useNotes } from '../../contexts/NotesContext';

interface MobileSidebarSettingsProps {
  expandedSettings: boolean;
  onToggleSettings: () => void;
  notifications: boolean;
  setNotifications: (value: boolean) => void;
  autoSync: boolean;
  setAutoSync: (value: boolean) => void;
}

const MobileSidebarSettings: React.FC<MobileSidebarSettingsProps> = ({
  expandedSettings,
  onToggleSettings,
  notifications,
  setNotifications,
  autoSync,
  setAutoSync,
}) => {
  const { theme, setTheme } = useTheme();
  const { syncStatus } = useNotes();

  return (
    <div className="space-y-1">
      <Button
        variant="ghost"
        onClick={onToggleSettings}
        className="w-full justify-start h-12"
      >
        <Settings className="w-5 h-5 mr-3" />
        Settings
        <ChevronRight className={`w-4 h-4 ml-auto transition-transform ${
          expandedSettings ? 'rotate-90' : ''
        }`} />
      </Button>

      {/* Expanded Settings Options - Messenger Style */}
      {expandedSettings && (
        <div className="ml-8 space-y-2 bg-muted/20 rounded-lg p-3">
          {/* Theme Toggle */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {theme === 'dark' ? (
                <Moon className="w-4 h-4" />
              ) : (
                <Sun className="w-4 h-4" />
              )}
              <Label className="text-sm">Dark Mode</Label>
            </div>
            <Switch
              checked={theme === 'dark'}
              onCheckedChange={(checked) => setTheme(checked ? 'dark' : 'light')}
            />
          </div>

          <Separator className="my-2" />

          {/* Notifications */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Bell className="w-4 h-4" />
              <Label className="text-sm">Push Notifications</Label>
            </div>
            <Switch
              checked={notifications}
              onCheckedChange={setNotifications}
            />
          </div>

          {/* Auto Sync */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <SyncStatusIndicator status={syncStatus} className="text-xs" />
              <Label className="text-sm">Auto Sync</Label>
            </div>
            <Switch
              checked={autoSync}
              onCheckedChange={setAutoSync}
            />
          </div>

          <Separator className="my-2" />

          {/* About Info */}
          <div className="space-y-1 text-xs text-muted-foreground">
            <div className="flex items-center space-x-2">
              <Info className="w-3 h-3" />
              <span>NoteAI Suite Mobile v1.0.0</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MobileSidebarSettings;
