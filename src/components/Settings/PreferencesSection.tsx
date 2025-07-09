
import React, { useState, useEffect } from 'react';
import { useTheme } from '@/providers/ThemeProvider';
import { Card, CardContent } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { UserPreferencesService, UserPreferences } from '@/services/userPreferencesService';
import { ActivityService } from '@/services/activityService';
import { isDarkMode } from '@/utils/themeUtils';
import { toast } from 'sonner';

const PreferencesSection: React.FC = () => {
  const { theme, setTheme } = useTheme();
  const [preferences, setPreferences] = useState<UserPreferences | null>(null);
  const [loading, setLoading] = useState(true);

  // Load preferences on mount
  useEffect(() => {
    loadPreferences();
  }, []);

  const loadPreferences = async () => {
    setLoading(true);
    try {
      const userPrefs = await UserPreferencesService.getUserPreferences();
      setPreferences(userPrefs);
    } catch (error) {
      console.error('Failed to load preferences:', error);
      toast.error('Failed to load preferences');
    } finally {
      setLoading(false);
    }
  };

  const updatePreference = async (updates: Partial<UserPreferences>) => {
    if (!preferences) return;

    try {
      const updatedPrefs = await UserPreferencesService.updateUserPreferences(updates);
      if (updatedPrefs) {
        setPreferences(updatedPrefs);
        
        // Log activity
        await ActivityService.logActivity({
          activity_type: ActivityService.ActivityTypes.SETTINGS_UPDATED,
          activity_title: 'Updated preferences',
          activity_description: `Changed: ${Object.keys(updates).join(', ')}`,
          metadata: updates
        });
        
        toast.success('Preferences updated successfully');
      } else {
        toast.error('Failed to update preferences');
      }
    } catch (error) {
      console.error('Failed to update preference:', error);
      toast.error('Failed to update preferences');
    }
  };

  const handleThemeToggle = (checked: boolean) => {
    const newTheme = checked ? 'dark' : 'light';
    setTheme(newTheme);
  };

  const isCurrentlyDark = isDarkMode(theme);

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-muted rounded w-1/4"></div>
            <div className="space-y-3">
              <div className="h-10 bg-muted rounded"></div>
              <div className="h-10 bg-muted rounded"></div>
              <div className="h-10 bg-muted rounded"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent>
        <div className="space-y-6">
          <h3 className="text-lg font-semibold">Preferences</h3>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium">Dark Mode</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Toggle dark theme</p>
              </div>
              <Switch 
                checked={isCurrentlyDark}
                onCheckedChange={handleThemeToggle}
              />
            </div>

            <Separator />

            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium">AI Suggestions</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Get AI-powered writing suggestions</p>
              </div>
              <Switch 
                checked={preferences?.ai_suggestions_enabled ?? true}
                onCheckedChange={(checked) => updatePreference({ ai_suggestions_enabled: checked })}
              />
            </div>

            <Separator />

            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium">Auto-save</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Automatically save notes while typing</p>
              </div>
              <Switch 
                checked={preferences?.auto_save_enabled ?? true}
                onCheckedChange={(checked) => updatePreference({ auto_save_enabled: checked })}
              />
            </div>

            <Separator />

            <div className="flex justify-between items-center">
              <div className="flex-1">
                <p className="font-medium">Default Category</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Default category for new notes</p>
              </div>
              <Select 
                value={preferences?.default_note_category ?? 'general'}
                onValueChange={(value) => updatePreference({ default_note_category: value })}
              >
                <SelectTrigger className="w-48 rounded-lg">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="general">General</SelectItem>
                  <SelectItem value="meeting">Meeting</SelectItem>
                  <SelectItem value="learning">Learning</SelectItem>
                  <SelectItem value="brainstorm">Brainstorm</SelectItem>
                  <SelectItem value="project">Project</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PreferencesSection;
