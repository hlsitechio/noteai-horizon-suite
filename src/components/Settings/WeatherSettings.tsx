import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MapPin, Cloud, Save, RefreshCw, Key, AlertCircle, Database, Loader } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useWeatherSettings } from '@/hooks/useWeatherSettings';

interface WeatherSettingsProps {
  onSettingsChange?: (settings: any) => void;
}

const PREDEFINED_CITIES = [
  'Paris',
  'London', 
  'New York',
  'Los Angeles',
  'Montreal',
  'Toronto',
  'Ottawa'
];

export const WeatherSettings: React.FC<WeatherSettingsProps> = ({ onSettingsChange }) => {
  const { 
    settings, 
    isLoading, 
    error, 
    updateSetting, 
    saveSettings 
  } = useWeatherSettings();
  
  const [isTestingConnection, setIsTestingConnection] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [isCustomCity, setIsCustomCity] = useState(false);

  // Check if current city is custom
  React.useEffect(() => {
    setIsCustomCity(!PREDEFINED_CITIES.includes(settings.city));
  }, [settings.city]);

  const handleSaveSettings = async () => {
    try {
      await saveSettings(settings);
      onSettingsChange?.(settings);
    } catch (error) {
      // Error handling is done in the hook
    }
  };

  const testConnection = async () => {
    if (!settings.city.trim()) {
      toast.error('Please enter a city name');
      return;
    }

    setIsTestingConnection(true);
    setConnectionStatus('idle');

    try {
      // Development logging only
      if (import.meta.env.DEV) {
        console.log(`Testing weather connection for: ${settings.city}`);
      }
      
      const { data, error } = await supabase.functions.invoke('weather-api', {
        body: { 
          city: settings.city.trim(),
          units: settings.units === 'celsius' ? 'metric' : 'imperial',
          useCache: false // Force fresh data for testing
        }
      });

      if (error) {
        console.error('Weather API test error:', error);
        setConnectionStatus('error');
        toast.error(`Connection test failed: ${error.message}`);
        return;
      }

      if (data && data.temperature !== undefined) {
        setConnectionStatus('success');
        const cacheInfo = data.cached ? ' (cached)' : ' (fresh)';
        toast.success(`Weather connection successful! Current temperature in ${data.city}: ${data.temperature}°${settings.units === 'celsius' ? 'C' : 'F'}${cacheInfo}`);
      } else {
        setConnectionStatus('error');
        toast.error('Invalid response from weather service');
      }
    } catch (error) {
      console.error('Weather test connection error:', error);
      setConnectionStatus('error');
      toast.error('Failed to connect to weather service');
    } finally {
      setIsTestingConnection(false);
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Cloud className="h-5 w-5" />
            Weather Widget Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center py-8">
          <div className="flex items-center gap-2">
            <Loader className="h-4 w-4 animate-spin" />
            <span>Loading weather settings...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Cloud className="h-5 w-5" />
          Weather Widget Settings
          <Badge variant="outline" className="ml-auto">
            <Database className="h-3 w-3 mr-1" />
            Supabase Synced
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {error && (
          <div className="flex items-start gap-2 p-3 rounded-lg bg-destructive/10 border border-destructive/20">
            <AlertCircle className="h-4 w-4 text-destructive mt-0.5 flex-shrink-0" />
            <div className="text-sm">
              <p className="font-medium text-destructive">Settings Error</p>
              <p className="text-muted-foreground">{error}</p>
            </div>
          </div>
        )}

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

        {/* API Information */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Key className="h-4 w-4" />
            <h4 className="font-medium">API Configuration</h4>
          </div>
          
          <div className="p-3 rounded-lg bg-muted/50 border">
            <p className="text-sm text-muted-foreground">
              Weather data is powered by Tomorrow.io API. The API key is securely configured on the server.
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
            
            {/* City Selection Dropdown */}
            <Select
              value={isCustomCity ? 'custom' : settings.city}
              onValueChange={(value) => {
                if (value === 'custom') {
                  setIsCustomCity(true);
                  updateSetting('city', '');
                } else {
                  setIsCustomCity(false);
                  updateSetting('city', value);
                }
              }}
              disabled={!settings.enabled}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a city" />
              </SelectTrigger>
              <SelectContent>
                {PREDEFINED_CITIES.map((city) => (
                  <SelectItem key={city} value={city}>
                    {city}
                  </SelectItem>
                ))}
                <SelectItem value="custom">Custom city...</SelectItem>
              </SelectContent>
            </Select>

            {/* Custom City Input - shown when "custom" is selected */}
            {isCustomCity && (
              <Input
                placeholder="Enter custom city name"
                value={settings.city}
                onChange={(e) => updateSetting('city', e.target.value)}
                disabled={!settings.enabled}
                className="mt-2"
              />
            )}
            
            <p className="text-xs text-muted-foreground">
              {isCustomCity 
                ? 'Enter a custom city name for weather information'
                : 'Select a city from the list or choose "Custom city" to enter your own'
              }
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
            disabled={!settings.enabled || isTestingConnection || !settings.city.trim()}
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
                  Please check your city name and try again. Make sure the city name is spelled correctly.
                </p>
              </div>
            </div>
          )}
        </div>

        <Separator />

        {/* Save Button */}
        <Button onClick={handleSaveSettings} className="w-full" disabled={isLoading}>
          <Save className="h-4 w-4 mr-2" />
          {isLoading ? 'Saving...' : 'Save Weather Settings'}
        </Button>
      </CardContent>
    </Card>
  );
};