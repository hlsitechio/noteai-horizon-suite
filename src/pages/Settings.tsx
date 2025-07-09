
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProfileSection from '../components/Settings/ProfileSection';
import PreferencesSection from '../components/Settings/PreferencesSection';
import AISettingsSection from '../components/Settings/AISettingsSection';
import DataExportSection from '../components/Settings/DataExportSection';
import AboutSection from '../components/Settings/AboutSection';
import { AdvancedColorPicker } from '../components/Settings/AdvancedColorPicker';
import { PWADownloadSection } from '../components/Settings/PWADownloadSection';
import DynamicAccentSection from '../components/Settings/DynamicAccentSection';
import { WeatherSettings } from '../components/Settings/WeatherSettings';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Layout, Settings as SettingsIcon, Palette, User, Sliders, Download, Info, Cloud, Monitor } from 'lucide-react';
import { useAccentColor } from '../contexts/AccentColorContext';
import { useEditMode } from '../contexts/EditModeContext';
import { UserPreferencesService } from '@/services/userPreferencesService';
import { ActivityService } from '@/services/activityService';
import { toast } from 'sonner';

const Settings: React.FC = () => {
  const { accentColor, setAccentColor } = useAccentColor();
  const { isDashboardEditMode, setIsDashboardEditMode } = useEditMode();
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState('profile');
  const [isSavingLayout, setIsSavingLayout] = useState(false);

  // Check for tab parameter in URL
  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab && ['profile', 'layout', 'themes', 'preferences', 'weather', 'ai', 'data', 'download', 'about'].includes(tab)) {
      setActiveTab(tab);
    }
  }, [searchParams]);

  const handleColorChange = (color: { name: string; value: string; hsl: string }) => {
    setAccentColor(color.value, color.hsl);
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    setSearchParams({ tab: value });
  };

  const toggleDashboardEditMode = async () => {
    const newMode = !isDashboardEditMode;
    setIsSavingLayout(true);
    
    try {
      // Update local state immediately for responsive UI
      setIsDashboardEditMode(newMode);
      
      // Save to database
      const success = await UserPreferencesService.updateLayoutSettings(newMode);
      
      if (success) {
        // Log activity
        await ActivityService.logActivity({
          activity_type: ActivityService.ActivityTypes.SETTINGS_UPDATED,
          activity_title: 'Updated layout settings',
          activity_description: `Dashboard edit mode ${newMode ? 'enabled' : 'disabled'}`,
          metadata: { dashboard_edit_mode: newMode }
        });
        
        toast.success(`Dashboard edit mode ${newMode ? 'enabled' : 'disabled'}`);
      } else {
        // Revert on failure
        setIsDashboardEditMode(!newMode);
        toast.error('Failed to save layout settings');
      }
    } catch (error) {
      console.error('Failed to update layout settings:', error);
      setIsDashboardEditMode(!newMode);
      toast.error('Failed to save layout settings');
    } finally {
      setIsSavingLayout(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-foreground">
          Settings
        </h1>
        <p className="text-muted-foreground text-lg">
          Manage your account and application preferences
        </p>
      </div>

      {/* Tabbed Interface */}
      <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
        <TabsList className="grid w-full grid-cols-9">
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="layout" className="flex items-center gap-2">
            <Layout className="h-4 w-4" />
            Layout
          </TabsTrigger>
          <TabsTrigger value="themes" className="flex items-center gap-2">
            <Palette className="h-4 w-4" />
            Themes
          </TabsTrigger>
          <TabsTrigger value="preferences" className="flex items-center gap-2">
            <SettingsIcon className="h-4 w-4" />
            Preferences
          </TabsTrigger>
          <TabsTrigger value="weather" className="flex items-center gap-2">
            <Cloud className="h-4 w-4" />
            Weather
          </TabsTrigger>
          <TabsTrigger value="ai" className="flex items-center gap-2">
            <Sliders className="h-4 w-4" />
            AI Settings
          </TabsTrigger>
          <TabsTrigger value="data" className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Data Export
          </TabsTrigger>
          <TabsTrigger value="download" className="flex items-center gap-2">
            <Monitor className="h-4 w-4" />
            Desktop App
          </TabsTrigger>
          <TabsTrigger value="about" className="flex items-center gap-2">
            <Info className="h-4 w-4" />
            About
          </TabsTrigger>
        </TabsList>

        <div className="mt-6">
          <TabsContent value="profile" className="space-y-6">
            <ProfileSection />
          </TabsContent>

          <TabsContent value="layout" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Layout className="h-5 w-5" />
                  Dashboard Layout Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label htmlFor="dashboard-edit-mode">Dashboard Edit Mode</Label>
                      <p className="text-sm text-muted-foreground">
                        Enable resizing and editing of dashboard panels
                      </p>
                    </div>
                    <Switch
                      id="dashboard-edit-mode"
                      checked={isDashboardEditMode}
                      onCheckedChange={toggleDashboardEditMode}
                      disabled={isSavingLayout}
                    />
                    {isSavingLayout && (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary ml-2"></div>
                    )}
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-2">
                    <h4 className="font-medium">Layout Instructions</h4>
                    <div className="text-sm text-muted-foreground space-y-2">
                      <p>• Enable Dashboard Edit Mode to see resize handles</p>
                      <p>• Navigate to Dashboard to resize panels</p>
                      <p>• The dashboard has 5 resizable sections:</p>
                      <div className="ml-4 space-y-1">
                        <p>- Banner area (top)</p>
                        <p>- KPI Stats panel</p>
                        <p>- Middle left/right panels</p>
                        <p>- Bottom left/right panels</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="themes" className="space-y-6">
            <DynamicAccentSection />
            <AdvancedColorPicker 
              currentColor={accentColor}
              onColorChange={handleColorChange}
            />
          </TabsContent>

          <TabsContent value="preferences" className="space-y-6">
            <PreferencesSection />
          </TabsContent>

          <TabsContent value="weather" className="space-y-6">
            <WeatherSettings />
          </TabsContent>

          <TabsContent value="ai" className="space-y-6">
            <AISettingsSection />
          </TabsContent>

          <TabsContent value="data" className="space-y-6">
            <DataExportSection />
          </TabsContent>

          <TabsContent value="download" className="space-y-6">
            <PWADownloadSection />
          </TabsContent>

          <TabsContent value="about" className="space-y-6">
            <AboutSection />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};

export default Settings;
