import React, { useState, useEffect } from 'react';
import { TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAccentColor } from '@/contexts/AccentColorContext';
import { useNavigate } from 'react-router-dom';

// Import existing tab components
import { ProfileTabContent } from './tabs/ProfileTabContent';
import { LayoutTabContent } from './tabs/LayoutTabContent';
import { ThemesTabContent } from './tabs/ThemesTabContent';
import { PreferencesTabContent } from './tabs/PreferencesTabContent';
import { WeatherTabContent } from './tabs/WeatherTabContent';
import { AITabContent } from './tabs/AITabContent';
import { GoogleDriveTabContent } from './tabs/GoogleDriveTabContent';
import { DataTabContent } from './tabs/DataTabContent';
import { DownloadTabContent } from './tabs/DownloadTabContent';
import { AboutTabContent } from './tabs/AboutTabContent';
import { OnboardingTabContent } from './tabs/OnboardingTabContent';
import { SupportTabContent } from './tabs/SupportTabContent';

// Icons
import { 
  User, 
  Settings as SettingsIcon, 
  Layout, 
  Palette, 
  Cloud, 
  Sliders, 
  HardDrive, 
  Download, 
  Monitor, 
  GraduationCap, 
  MessageSquare, 
  Info 
} from 'lucide-react';

interface CategoryContentProps {
  activeTab: string;
}

type SubTab = {
  id: string;
  label: string;
  icon: React.ElementType;
  component: React.ReactNode;
};

export const CategoryContent: React.FC<CategoryContentProps> = ({ activeTab }) => {
  const { accentColor, setAccentColor } = useAccentColor();
  const navigate = useNavigate();
  const [activeSubTab, setActiveSubTab] = useState<string>('');

  // Redirect appearance tab to unified theme page
  useEffect(() => {
    if (activeTab === 'appearance') {
      navigate('/app/themes', { replace: true });
    }
  }, [activeTab, navigate]);

  const handleColorChange = (color: { name: string; value: string; hsl: string }) => {
    setAccentColor(color.value, color.hsl);
  };

  const categories = {
    account: {
      title: 'Account & Profile',
      description: 'Manage your personal information and preferences',
      subTabs: [
        {
          id: 'profile',
          label: 'Profile',
          icon: User,
          component: <ProfileTabContent />
        },
        {
          id: 'preferences',
          label: 'Preferences',
          icon: SettingsIcon,
          component: <PreferencesTabContent />
        }
      ] as SubTab[]
    },
    appearance: {
      title: 'Appearance & Layout',
      description: 'Customize the look and feel of your dashboard',
      subTabs: [
        {
          id: 'layout',
          label: 'Layout',
          icon: Layout,
          component: <LayoutTabContent />
        },
        {
          id: 'themes',
          label: 'Themes',
          icon: Palette,
          component: <ThemesTabContent accentColor={accentColor} onColorChange={handleColorChange} />
        }
      ] as SubTab[]
    },
    integrations: {
      title: 'Integrations & Data',
      description: 'Connect external services and manage your data',
      subTabs: [
        {
          id: 'weather',
          label: 'Weather',
          icon: Cloud,
          component: <WeatherTabContent />
        },
        {
          id: 'ai',
          label: 'AI Settings',
          icon: Sliders,
          component: <AITabContent />
        },
        {
          id: 'drive',
          label: 'Google Drive',
          icon: HardDrive,
          component: <GoogleDriveTabContent />
        },
        {
          id: 'data',
          label: 'Data Export',
          icon: Download,
          component: <DataTabContent />
        }
      ] as SubTab[]
    },
    system: {
      title: 'System & Apps',
      description: 'System settings and application management',
      subTabs: [
        {
          id: 'download',
          label: 'Desktop App',
          icon: Monitor,
          component: <DownloadTabContent />
        },
        {
          id: 'onboarding',
          label: 'Onboarding',
          icon: GraduationCap,
          component: <OnboardingTabContent />
        }
      ] as SubTab[]
    },
    help: {
      title: 'Help & Support',
      description: 'Get help and learn more about the application',
      subTabs: [
        {
          id: 'support',
          label: 'Support',
          icon: MessageSquare,
          component: <SupportTabContent />
        },
        {
          id: 'about',
          label: 'About',
          icon: Info,
          component: <AboutTabContent />
        }
      ] as SubTab[]
    }
  };

  const currentCategory = categories[activeTab as keyof typeof categories];
  
  // Set default sub-tab if none selected
  React.useEffect(() => {
    if (currentCategory && (!activeSubTab || !currentCategory.subTabs.find(tab => tab.id === activeSubTab))) {
      setActiveSubTab(currentCategory.subTabs[0]?.id || '');
    }
  }, [activeTab, currentCategory, activeSubTab]);

  if (!currentCategory) {
    return null;
  }

  const activeSubTabData = currentCategory.subTabs.find(tab => tab.id === activeSubTab);

  return (
    <TabsContent value={activeTab} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{currentCategory.title}</CardTitle>
          <CardDescription>{currentCategory.description}</CardDescription>
        </CardHeader>
        <CardContent>
          {/* Sub-navigation */}
          <div className="flex flex-wrap gap-2 mb-6">
            {currentCategory.subTabs.map((subTab) => {
              const Icon = subTab.icon;
              return (
                <Button
                  key={subTab.id}
                  variant={activeSubTab === subTab.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => setActiveSubTab(subTab.id)}
                  className="flex items-center gap-2"
                >
                  <Icon className="h-4 w-4" />
                  {subTab.label}
                </Button>
              );
            })}
          </div>
          
          {/* Sub-tab content */}
          {activeSubTabData && (
            <div className="space-y-6">
              {activeSubTabData.component}
            </div>
          )}
        </CardContent>
      </Card>
    </TabsContent>
  );
};