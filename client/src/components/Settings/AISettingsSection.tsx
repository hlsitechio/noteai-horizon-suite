
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { UserPreferencesService, UserPreferences } from '@/services/userPreferencesService';
import { ActivityService } from '@/services/activityService';
import { toast } from 'sonner';

const AISettingsSection: React.FC = () => {
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
      console.error('Failed to load AI preferences:', error);
      toast.error('Failed to load AI preferences');
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
          activity_title: 'Updated AI settings',
          activity_description: `Changed: ${Object.keys(updates).join(', ')}`,
          metadata: updates
        });
        
        toast.success('AI settings updated successfully');
      } else {
        toast.error('Failed to update AI settings');
      }
    } catch (error) {
      console.error('Failed to update AI preference:', error);
      toast.error('Failed to update AI settings');
    }
  };

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
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">AI Assistant</h3>
            <Badge className="rounded-full bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300">Active</Badge>
          </div>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div className="flex-1">
                <p className="font-medium">AI Model</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Choose your preferred AI model</p>
              </div>
              <Select 
                value={preferences?.ai_model ?? 'gpt-3.5'}
                onValueChange={(value) => updatePreference({ ai_model: value })}
              >
                <SelectTrigger className="w-48 rounded-lg">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="gpt-3.5">GPT-3.5 Turbo</SelectItem>
                  <SelectItem value="gpt-4">GPT-4</SelectItem>
                  <SelectItem value="claude">Claude</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Separator />

            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium">Smart Formatting</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">AI-powered text formatting and structure</p>
              </div>
              <Switch 
                checked={preferences?.smart_formatting_enabled ?? true}
                onCheckedChange={(checked) => updatePreference({ smart_formatting_enabled: checked })}
              />
            </div>

            <Separator />

            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium">Context Awareness</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">AI considers your previous notes for better suggestions</p>
              </div>
              <Switch 
                checked={preferences?.context_awareness_enabled ?? true}
                onCheckedChange={(checked) => updatePreference({ context_awareness_enabled: checked })}
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AISettingsSection;
