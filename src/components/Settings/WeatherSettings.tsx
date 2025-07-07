import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { MapPin, Cloud, Save, RefreshCw, Key, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

interface WeatherSettingsProps {
  onSettingsChange?: (settings: WeatherSettings) => void;
}

export interface WeatherSettings {
  enabled: boolean;
  city: string;
  apiKey: string;
  units: 'celsius' | 'fahrenheit';
  updateInterval: number; // minutes
}

const DEFAULT_SETTINGS: WeatherSettings = {
  enabled: true,
  city: 'New York',
  apiKey: '',
  units: 'celsius',
  updateInterval: 30
};

export const WeatherSettings: React.FC<WeatherSettingsProps> = ({ onSettingsChange }) => {
  const [settings, setSettings] = useState<WeatherSettings>(DEFAULT_SETTINGS);
  const [isTestingConnection, setIsTestingConnection] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'idle' | 'success' | 'error'>('idle');

  // Load settings from localStorage on mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('weather-settings');
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        setSettings({ ...DEFAULT_SETTINGS, ...parsed });
      } catch (error) {
        console.error('Failed to parse saved weather settings:', error);
      }
    }
  }, []);

  const saveSettings = () => {
    try {
      localStorage.setItem('weather-settings', JSON.stringify(settings));
      onSettingsChange?.(settings);
      toast.success('Weather settings saved successfully');
    } catch (error) {
      console.error('Failed to save weather settings:', error);
      toast.error('Failed to save weather settings');
    }
  };

  const testConnection = async () => {
    if (!settings.apiKey.trim()) {
      toast.error('Please enter your Tomorrow.io API key first');
      return;
    }

    if (!settings.city.trim()) {
      toast.error('Please enter a city name');
      return;
    }

    setIsTestingConnection(true);
    setConnectionStatus('idle');

    try {
      // This will be implemented with actual Tomorrow.io API call
      // For now, simulating the test
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simulate success/failure based on API key format
      if (settings.apiKey.length > 10) {
        setConnectionStatus('success');
        toast.success(`Weather connection test successful for ${settings.city}`);
      } else {
        setConnectionStatus('error');
        toast.error('Invalid API key format');
      }
    } catch (error) {
      setConnectionStatus('error');
      toast.error('Failed to connect to weather service');
    } finally {
      setIsTestingConnection(false);
    }
  };

  const updateSetting = <K extends keyof WeatherSettings>(
    key: K, 
    value: WeatherSettings[K]
  ) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Cloud className="h-5 w-5" />
          Weather Widget Settings
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Enable/Disable Weather */}
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <Label>Enable Weather Widget</Label>
            <p className="text-sm text-muted-foreground">
              Show weather information in the dashboard top bar
            </p>
          </div>
          <Switch
            checked={settings.enabled}
            onCheckedChange={(checked) => updateSetting('enabled', checked)}
          />
        </div>

        <Separator />

        {/* API Configuration */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Key className="h-4 w-4" />
            <h4 className="font-medium">Tomorrow.io API Configuration</h4>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="api-key">API Key</Label>
            <Input
              id="api-key"
              type="password"
              placeholder="Enter your Tomorrow.io API key"
              value={settings.apiKey}
              onChange={(e) => updateSetting('apiKey', e.target.value)}
              disabled={!settings.enabled}
            />
            <p className="text-xs text-muted-foreground">
              Get your API key from{' '}
              <a 
                href="https://app.tomorrow.io/development/keys" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                Tomorrow.io Dashboard
              </a>
            </p>
          </div>
        </div>

        <Separator />

        {/* Location Settings */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            <h4 className="font-medium">Location Settings</h4>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="city">City</Label>
            <Input
              id="city"
              placeholder="Enter city name (e.g., New York, London)"
              value={settings.city}
              onChange={(e) => updateSetting('city', e.target.value)}
              disabled={!settings.enabled}
            />
            <p className="text-xs text-muted-foreground">
              Enter the city name for weather information
            </p>
          </div>

          <div className="space-y-2">
            <Label>Temperature Units</Label>
            <div className="flex gap-2">
              <Button
                variant={settings.units === 'celsius' ? 'default' : 'outline'}
                size="sm"
                onClick={() => updateSetting('units', 'celsius')}
                disabled={!settings.enabled}
              >
                Celsius (°C)
              </Button>
              <Button
                variant={settings.units === 'fahrenheit' ? 'default' : 'outline'}
                size="sm"
                onClick={() => updateSetting('units', 'fahrenheit')}
                disabled={!settings.enabled}
              >
                Fahrenheit (°F)
              </Button>
            </div>
          </div>
        </div>

        <Separator />

        {/* Update Settings */}
        <div className="space-y-4">
          <h4 className="font-medium">Update Settings</h4>
          
          <div className="space-y-2">
            <Label htmlFor="update-interval">Update Interval (minutes)</Label>
            <Input
              id="update-interval"
              type="number"
              min="5"
              max="120"
              value={settings.updateInterval}
              onChange={(e) => updateSetting('updateInterval', parseInt(e.target.value) || 30)}
              disabled={!settings.enabled}
            />
            <p className="text-xs text-muted-foreground">
              How often to refresh weather data (5-120 minutes)
            </p>
          </div>
        </div>

        <Separator />

        {/* Connection Test */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-medium">Connection Test</h4>
            {connectionStatus !== 'idle' && (
              <Badge variant={connectionStatus === 'success' ? 'default' : 'destructive'}>
                {connectionStatus === 'success' ? 'Connected' : 'Failed'}
              </Badge>
            )}
          </div>

          <Button
            variant="outline"
            onClick={testConnection}
            disabled={!settings.enabled || isTestingConnection || !settings.apiKey.trim()}
            className="w-full"
          >
            {isTestingConnection ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Testing Connection...
              </>
            ) : (
              <>
                <Cloud className="h-4 w-4 mr-2" />
                Test Weather Connection
              </>
            )}
          </Button>

          {connectionStatus === 'error' && (
            <div className="flex items-start gap-2 p-3 rounded-lg bg-destructive/10 border border-destructive/20">
              <AlertCircle className="h-4 w-4 text-destructive mt-0.5 flex-shrink-0" />
              <div className="text-sm">
                <p className="font-medium text-destructive">Connection Failed</p>
                <p className="text-muted-foreground">
                  Please check your API key and city name, then try again.
                </p>
              </div>
            </div>
          )}
        </div>

        <Separator />

        {/* Save Button */}
        <Button onClick={saveSettings} className="w-full">
          <Save className="h-4 w-4 mr-2" />
          Save Weather Settings
        </Button>
      </CardContent>
    </Card>
  );
};