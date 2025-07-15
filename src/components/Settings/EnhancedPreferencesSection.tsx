import React, { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { useUnifiedSettings } from '@/hooks/useUnifiedSettings';
import { isDarkMode } from '@/utils/themeUtils';
import { toast } from 'sonner';
import { Database, RefreshCw, CheckCircle } from 'lucide-react';

const EnhancedPreferencesSection: React.FC = () => {
  const { theme, setTheme } = useTheme();
  const { 
    preferences, 
    workspace,
    isLoading, 
    updatePreferences,
    updateSettingWithSync,
    syncManager
  } = useUnifiedSettings();
  
  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'success'>('idle');

  // Handle theme toggle
  const handleThemeToggle = (checked: boolean) => {
    setTheme(checked ? 'dark' : 'light');
  };

  // Handle preference updates with proper persistence
  const handlePreferenceUpdate = async (updates: any) => {
    const success = await updatePreferences(updates);
    if (!success) {
      toast.error('Failed to save preference changes');
    }
  };

  // Handle workspace updates with localStorage sync
  const handleWorkspaceUpdate = async (updates: any, localStorageKey?: string) => {
    const success = await updateSettingWithSync('workspace', updates, localStorageKey);
    if (!success) {
      toast.error('Failed to save workspace changes');
    }
  };

  // Manual sync function for migrating localStorage to database
  const handleManualSync = async () => {
    setSyncStatus('syncing');
    try {
      await syncManager.migrateLocalStorageToDatabase();
      setSyncStatus('success');
      toast.success('Settings synchronized successfully');
      setTimeout(() => setSyncStatus('idle'), 2000);
    } catch (error) {
      setSyncStatus('idle');
      toast.error('Failed to synchronize settings');
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <span className="ml-2">Loading preferences...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Sync Status Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Settings Synchronization
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Sync localStorage to database</p>
              <p className="text-xs text-muted-foreground">
                Migrate any settings stored locally to the database for better persistence
              </p>
            </div>
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleManualSync}
              disabled={syncStatus === 'syncing'}
            >
              {syncStatus === 'syncing' && <RefreshCw className="h-4 w-4 mr-2 animate-spin" />}
              {syncStatus === 'success' && <CheckCircle className="h-4 w-4 mr-2 text-green-500" />}
              {syncStatus === 'idle' && <RefreshCw className="h-4 w-4 mr-2" />}
              {syncStatus === 'syncing' ? 'Syncing...' : 'Sync Now'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Theme Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Appearance</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Dark Mode</p>
              <p className="text-xs text-muted-foreground">
                Toggle between light and dark themes
              </p>
            </div>
            <Switch
              checked={isDarkMode(theme as 'dark' | 'light' | 'system')}
              onCheckedChange={handleThemeToggle}
            />
          </div>
        </CardContent>
      </Card>

      {/* AI Settings */}
      <Card>
        <CardHeader>
          <CardTitle>AI Features</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">AI Suggestions</p>
              <p className="text-xs text-muted-foreground">
                Enable AI-powered suggestions and recommendations
              </p>
            </div>
            <Switch
              checked={preferences?.ai_suggestions_enabled || false}
              onCheckedChange={(checked) => 
                handlePreferenceUpdate({ ai_suggestions_enabled: checked })
              }
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Smart Formatting</p>
              <p className="text-xs text-muted-foreground">
                Automatically format content with AI assistance
              </p>
            </div>
            <Switch
              checked={preferences?.smart_formatting_enabled || false}
              onCheckedChange={(checked) => 
                handlePreferenceUpdate({ smart_formatting_enabled: checked })
              }
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Context Awareness</p>
              <p className="text-xs text-muted-foreground">
                Allow AI to consider your usage patterns for better suggestions
              </p>
            </div>
            <Switch
              checked={preferences?.context_awareness_enabled || false}
              onCheckedChange={(checked) => 
                handlePreferenceUpdate({ context_awareness_enabled: checked })
              }
            />
          </div>

          <Separator />

          <div className="space-y-2">
            <p className="text-sm font-medium">AI Model</p>
            <Select
              value={preferences?.ai_model || 'gpt-3.5'}
              onValueChange={(value) => handlePreferenceUpdate({ ai_model: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select AI model" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="gpt-3.5">GPT-3.5 (Fast)</SelectItem>
                <SelectItem value="gpt-4">GPT-4 (Advanced)</SelectItem>
                <SelectItem value="claude">Claude (Alternative)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Data Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Data & Storage</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Auto Save</p>
              <p className="text-xs text-muted-foreground">
                Automatically save changes as you work
              </p>
            </div>
            <Switch
              checked={preferences?.auto_save_enabled || false}
              onCheckedChange={(checked) => 
                handlePreferenceUpdate({ auto_save_enabled: checked })
              }
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Cloud Backup</p>
              <p className="text-xs text-muted-foreground">
                Backup your data to the cloud for extra security
              </p>
            </div>
            <Switch
              checked={preferences?.backup_to_cloud_enabled || false}
              onCheckedChange={(checked) => 
                handlePreferenceUpdate({ backup_to_cloud_enabled: checked })
              }
            />
          </div>

          <Separator />

          <div className="space-y-2">
            <p className="text-sm font-medium">Default Note Category</p>
            <Select
              value={preferences?.default_note_category || 'general'}
              onValueChange={(value) => handlePreferenceUpdate({ default_note_category: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select default category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="general">General</SelectItem>
                <SelectItem value="work">Work</SelectItem>
                <SelectItem value="personal">Personal</SelectItem>
                <SelectItem value="ideas">Ideas</SelectItem>
                <SelectItem value="projects">Projects</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EnhancedPreferencesSection;