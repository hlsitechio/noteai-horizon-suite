
import React from 'react';
import { User, Bell, Palette, Shield, Info } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { useAuth } from '../../contexts/AuthContext';

const MobileSettings: React.FC = () => {
  const { user, logout } = useAuth();

  const settingsGroups = [
    {
      title: 'Account',
      icon: User,
      items: [
        { label: 'Profile', value: user?.email || 'Not signed in' },
        { label: 'Sign Out', action: logout, type: 'button' },
      ]
    },
    {
      title: 'Notifications',
      icon: Bell,
      items: [
        { label: 'Push Notifications', type: 'switch', checked: true },
        { label: 'Email Updates', type: 'switch', checked: false },
      ]
    },
    {
      title: 'Appearance',
      icon: Palette,
      items: [
        { label: 'Dark Mode', type: 'switch', checked: true },
        { label: 'Accent Color', value: 'Blue' },
      ]
    },
    {
      title: 'Privacy & Security',
      icon: Shield,
      items: [
        { label: 'Biometric Lock', type: 'switch', checked: false },
        { label: 'Auto-lock', value: '5 minutes' },
      ]
    },
    {
      title: 'About',
      icon: Info,
      items: [
        { label: 'Version', value: '1.0.0' },
        { label: 'Privacy Policy', type: 'button' },
        { label: 'Terms of Service', type: 'button' },
      ]
    },
  ];

  return (
    <div className="h-full overflow-y-auto bg-background">
      <div className="p-4 space-y-4">
        <h1 className="text-2xl font-bold mb-6">Settings</h1>
        
        {settingsGroups.map((group) => {
          const Icon = group.icon;
          return (
            <Card key={group.title}>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Icon className="w-5 h-5" />
                  {group.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {group.items.map((item, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-sm">{item.label}</span>
                    {item.type === 'switch' ? (
                      <Switch checked={item.checked} />
                    ) : item.type === 'button' ? (
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={item.action}
                      >
                        {item.label === 'Sign Out' ? 'Sign Out' : 'View'}
                      </Button>
                    ) : (
                      <span className="text-sm text-muted-foreground">
                        {item.value}
                      </span>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default MobileSettings;
