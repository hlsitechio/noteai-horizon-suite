import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { 
  User, 
  Bell, 
  Moon, 
  Download, 
  Shield, 
  HelpCircle, 
  LogOut,
  ChevronRight,
  Smartphone,
  Cloud
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const EnhancedMobileSettings: React.FC = () => {
  const navigate = useNavigate();

  const settingsSections = [
    {
      title: 'Account',
      items: [
        { icon: User, label: 'Profile Settings', action: () => navigate('/app/settings') },
        { icon: Cloud, label: 'Sync & Backup', action: () => {} },
        { icon: Shield, label: 'Privacy & Security', action: () => {} },
      ]
    },
    {
      title: 'Preferences',
      items: [
        { icon: Bell, label: 'Notifications', toggle: true, value: true },
        { icon: Moon, label: 'Dark Mode', toggle: true, value: false },
        { icon: Smartphone, label: 'Mobile Optimizations', toggle: true, value: true },
      ]
    },
    {
      title: 'Support',
      items: [
        { icon: HelpCircle, label: 'Help & Support', action: () => {} },
        { icon: Download, label: 'Export Data', action: () => {} },
      ]
    }
  ];

  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
          <User className="h-10 w-10 text-primary-foreground" />
        </div>
        <h2 className="text-xl font-bold">John Doe</h2>
        <p className="text-sm text-muted-foreground">john.doe@example.com</p>
      </div>

      {/* Settings Sections */}
      {settingsSections.map((section, sectionIndex) => (
        <div key={sectionIndex}>
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
            {section.title}
          </h3>
          <Card>
            <CardContent className="p-0">
              {section.items.map((item, itemIndex) => (
                <div 
                  key={itemIndex}
                  className={`flex items-center justify-between p-4 ${
                    itemIndex !== section.items.length - 1 ? 'border-b border-border' : ''
                  } ${item.action ? 'cursor-pointer hover:bg-muted/50' : ''}`}
                  onClick={item.action}
                >
                  <div className="flex items-center gap-3">
                    <item.icon className="h-5 w-5 text-muted-foreground" />
                    <span className="font-medium">{item.label}</span>
                  </div>
                  
                  {item.toggle ? (
                    <Switch defaultChecked={item.value} />
                  ) : (
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      ))}

      {/* App Info */}
      <Card>
        <CardContent className="p-4 text-center">
          <div className="text-sm text-muted-foreground">
            NoteAI Horizon Suite
          </div>
          <div className="text-xs text-muted-foreground">
            Version 1.0.0
          </div>
        </CardContent>
      </Card>

      {/* Logout Button */}
      <Button 
        variant="destructive" 
        className="w-full flex items-center gap-2"
        onClick={() => {
          // Add logout logic here
          navigate('/auth/login');
        }}
      >
        <LogOut className="h-4 w-4" />
        Sign Out
      </Button>

      {/* Bottom spacing for navigation */}
      <div className="h-4" />
    </div>
  );
};

export default EnhancedMobileSettings;