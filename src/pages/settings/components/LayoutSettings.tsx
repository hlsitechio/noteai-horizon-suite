import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Layout } from 'lucide-react';
import { useEditMode } from '@/contexts/EditModeContext';
import { UserPreferencesService } from '@/services/userPreferencesService';
import { ActivityService } from '@/services/activityService';
import { toast } from 'sonner';

export const LayoutSettings: React.FC = () => {
  const { isDashboardEditMode, setIsDashboardEditMode } = useEditMode();
  const [isSavingLayout, setIsSavingLayout] = useState(false);

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
  );
};