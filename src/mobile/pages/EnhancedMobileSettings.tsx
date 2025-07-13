import React, { useState } from 'react';
import { ArrowLeft, User, Bell, RotateCw, Palette, Shield, Info, Moon, Sun, Volume2, VolumeX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@/providers/ThemeProvider';
import { useAuth } from '../../contexts/AuthContext';
import { useNotes } from '../../contexts/NotesContext';
import SyncStatusIndicator from '../../components/SyncStatusIndicator';

const EnhancedMobileSettings: React.FC = () => {
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();
  const { user } = useAuth();
  const { syncStatus } = useNotes();
  
  // Settings state
  const [notifications, setNotifications] = useState(true);
  const [autoSync, setAutoSync] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [offlineMode, setOfflineMode] = useState(false);

  const handleBack = () => {
    navigate('/mobile/notes');
  };

  const settingsGroups = [
    {
      title: 'Account',
      icon: User,
      items: [
        {
          label: 'Email',
          value: user?.email || 'Not signed in',
          type: 'info'
        },
        {
          label: 'Profile',
          value: 'Manage your profile settings',
          type: 'action',
          onClick: () => console.log('Profile settings')
        }
      ]
    },
    {
      title: 'Appearance',
      icon: Palette,
      items: [
        {
          label: 'Dark Mode',
          value: theme === 'dark',
          type: 'toggle',
          onChange: (checked: boolean) => setTheme(checked ? 'dark' : 'light'),
          icon: theme === 'dark' ? Moon : Sun
        }
      ]
    },
    {
      title: 'Notifications',
      icon: Bell,
      items: [
        {
          label: 'Push Notifications',
          value: notifications,
          type: 'toggle',
          onChange: setNotifications
        },
        {
          label: 'Sound',
          value: soundEnabled,
          type: 'toggle',
          onChange: setSoundEnabled,
          icon: soundEnabled ? Volume2 : VolumeX
        }
      ]
    },
    {
      title: 'Sync & Storage',
      icon: RotateCw,
      items: [
        {
          label: 'Auto Sync',
          value: autoSync,
          type: 'toggle',
          onChange: setAutoSync
        },
        {
          label: 'Offline Mode',
          value: offlineMode,
          type: 'toggle',
          onChange: setOfflineMode
        },
        {
          label: 'Sync Status',
          value: syncStatus,
          type: 'status'
        }
      ]
    },
    {
      title: 'Privacy & Security',
      icon: Shield,
      items: [
        {
          label: 'Privacy Policy',
          value: 'View our privacy policy',
          type: 'action',
          onClick: () => console.log('Privacy policy')
        },
        {
          label: 'Data Export',
          value: 'Export your data',
          type: 'action',
          onClick: () => console.log('Data export')
        }
      ]
    },
    {
      title: 'About',
      icon: Info,
      items: [
        {
          label: 'Version',
          value: 'NoteAI Suite v1.0.0',
          type: 'info'
        },
        {
          label: 'Build',
          value: '2024.06.27',
          type: 'info'
        }
      ]
    }
  ];

  return (
    <div className="h-full overflow-y-auto bg-background">
      {/* Header */}
      <div className="sticky top-0 bg-background/95 backdrop-blur-md border-b border-border px-4 py-3 flex items-center space-x-3 z-10">
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-8 w-8 p-0"
          onClick={handleBack}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-lg font-semibold text-foreground">Settings</h1>
      </div>

      {/* Content */}
      <div className="p-4 space-y-6">
        {settingsGroups.map((group) => {
          const GroupIcon = group.icon;
          return (
            <Card key={group.title} className="border-border/50">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <GroupIcon className="h-4 w-4 text-primary" />
                  {group.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {group.items.map((item, index) => (
                  <div key={index}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {item.icon && <item.icon className="h-4 w-4 text-muted-foreground" />}
                        <Label className="text-sm font-medium">{item.label}</Label>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        {item.type === 'toggle' && (
                          <Switch
                            checked={item.value as boolean}
                            onCheckedChange={item.onChange}
                          />
                        )}
                        {item.type === 'info' && (
                          <span className="text-sm text-muted-foreground">
                            {item.value as string}
                          </span>
                        )}
                        {item.type === 'status' && (
                          <SyncStatusIndicator status={item.value as any} className="text-xs" />
                        )}
                        {item.type === 'action' && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={item.onClick}
                            className="h-8 text-primary hover:text-primary/80"
                          >
                            View
                          </Button>
                        )}
                      </div>
                    </div>
                    {index < group.items.length - 1 && <Separator className="mt-4" />}
                  </div>
                ))}
              </CardContent>
            </Card>
          );
        })}

        {/* Footer spacing */}
        <div className="h-20" />
      </div>
    </div>
  );
};

export default EnhancedMobileSettings;
