
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Bell, BellOff, Settings, Mail, Phone, AlertCircle } from 'lucide-react';
import { PushNotificationService } from '../../services/pushNotificationService';
import { NotificationService } from '../../services/notificationService';
import { NotificationPreferencesService } from '../../services/notificationPreferencesService';
import { toast } from 'sonner';

const NotificationSettings: React.FC = () => {
  const [browserNotifications, setBrowserNotifications] = useState(false);
  const [pushNotifications, setPushNotifications] = useState(false);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(false);
  const [emailAddress, setEmailAddress] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [permissionDenied, setPermissionDenied] = useState(false);

  useEffect(() => {
    // Load notification preferences on mount
    const loadPreferences = async () => {
      const preferences = await NotificationPreferencesService.getNotificationPreferences();
      if (preferences) {
        setEmailNotifications(preferences.email_notifications);
        setSmsNotifications(preferences.sms_notifications);
        setEmailAddress(preferences.email_address || '');
        setPhoneNumber(preferences.phone_number || '');
      }
    };

    // Check current notification status
    const checkNotificationStatus = async () => {
      console.log('Checking notification status...');
      console.log('Notification permission:', Notification.permission);
      
      // Check browser notifications
      const canShow = NotificationService.canShowNotifications();
      setBrowserNotifications(canShow);
      console.log('Can show notifications:', canShow);
      
      // Check if permission was explicitly denied
      if (Notification.permission === 'denied') {
        setPermissionDenied(true);
        console.log('Notification permission denied');
      }
      
      // Check push notifications
      if ('serviceWorker' in navigator && 'PushManager' in window) {
        try {
          const registration = await navigator.serviceWorker.ready;
          const subscription = await registration.pushManager.getSubscription();
          setPushNotifications(!!subscription);
          console.log('Push subscription exists:', !!subscription);
        } catch (error) {
          console.error('Error checking push subscription:', error);
        }
      }
    };

    loadPreferences();
    checkNotificationStatus();
  }, []);

  const savePreferences = async () => {
    setIsLoading(true);
    try {
      const success = await NotificationPreferencesService.updateNotificationPreferences({
        email_notifications: emailNotifications,
        sms_notifications: smsNotifications,
        email_address: emailAddress,
        phone_number: phoneNumber
      });

      if (success) {
        toast.success('Notification preferences saved');
      } else {
        toast.error('Failed to save preferences');
      }
    } catch (error) {
      toast.error('Failed to save preferences');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBrowserNotificationToggle = async () => {
    console.log('Toggling browser notifications...');
    setIsLoading(true);
    
    try {
      if (!browserNotifications) {
        console.log('Requesting notification permission...');
        
        // Reset permission denied state
        setPermissionDenied(false);
        
        const granted = await NotificationService.requestPermission();
        console.log('Permission granted:', granted);
        
        if (granted) {
          setBrowserNotifications(true);
          toast.success('Browser notifications enabled');
        } else {
          console.log('Permission denied or dismissed');
          if (Notification.permission === 'denied') {
            setPermissionDenied(true);
            toast.error('Notifications blocked. Please enable them in your browser settings.');
          } else {
            toast.error('Please allow notifications when prompted');
          }
        }
      } else {
        // We can't actually disable browser notifications programmatically
        // But we can update our local state
        setBrowserNotifications(false);
        toast.info('Browser notifications disabled locally. To fully disable, go to browser settings.');
      }
    } catch (error) {
      console.error('Error toggling browser notifications:', error);
      toast.error('Failed to update browser notification settings');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePushNotificationToggle = async () => {
    console.log('Toggling push notifications...');
    setIsLoading(true);
    
    try {
      if (!pushNotifications) {
        console.log('Enabling push notifications...');
        
        // First ensure browser notifications are enabled
        if (!browserNotifications) {
          const granted = await NotificationService.requestPermission();
          if (!granted) {
            toast.error('Browser notifications must be enabled first');
            setIsLoading(false);
            return;
          }
          setBrowserNotifications(true);
        }

        // Initialize service worker
        const swInitialized = await PushNotificationService.initialize();
        if (!swInitialized) {
          toast.error('Push notifications are not supported in this browser');
          setIsLoading(false);
          return;
        }

        // Subscribe to push notifications
        const subscription = await PushNotificationService.subscribeToPush();
        if (subscription) {
          setPushNotifications(true);
          toast.success('Push notifications enabled');
          console.log('Push notifications enabled successfully');
        } else {
          toast.error('Failed to enable push notifications');
        }
      } else {
        console.log('Disabling push notifications...');
        
        // Disable push notifications
        if ('serviceWorker' in navigator) {
          try {
            const registration = await navigator.serviceWorker.ready;
            const subscription = await registration.pushManager.getSubscription();
            if (subscription) {
              await subscription.unsubscribe();
              setPushNotifications(false);
              toast.success('Push notifications disabled');
              console.log('Push notifications disabled successfully');
            }
          } catch (error) {
            console.error('Error disabling push notifications:', error);
            toast.error('Failed to disable push notifications');
          }
        }
      }
    } catch (error) {
      console.error('Error toggling push notifications:', error);
      toast.error('Failed to update push notification settings');
    } finally {
      setIsLoading(false);
    }
  };

  const testNotification = async () => {
    console.log('Testing notifications...');
    
    if (browserNotifications) {
      NotificationService.showNotification('Test Notification', {
        body: 'This is a test notification from your notes app!',
        tag: 'test-notification'
      });
      console.log('Browser notification sent');
    }

    if (pushNotifications) {
      await PushNotificationService.showLocalNotification('Test Push Notification', {
        body: 'This is a test push notification!',
        tag: 'test-push'
      });
      console.log('Push notification sent');
    }

    if (!browserNotifications && !pushNotifications) {
      toast.info('Please enable notifications first to test them');
    } else {
      toast.success('Test notification sent!');
    }
  };

  const openBrowserSettings = () => {
    toast.info('Open your browser settings and look for "Notifications" or "Site Settings" to manage permissions for this site');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="w-5 h-5" />
          Notification Settings
        </CardTitle>
        <CardDescription>
          Configure how you want to receive reminder notifications
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h3 className="font-medium">Browser Notifications</h3>
            <p className="text-sm text-muted-foreground">
              Show notifications in your browser when reminders are due
            </p>
            {permissionDenied && (
              <div className="flex items-center gap-2 text-sm text-destructive">
                <AlertCircle className="w-4 h-4" />
                <span>Notifications blocked by browser</span>
              </div>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Switch
              checked={browserNotifications}
              onCheckedChange={handleBrowserNotificationToggle}
              disabled={isLoading}
            />
            {permissionDenied && (
              <Button
                variant="outline"
                size="sm"
                onClick={openBrowserSettings}
                className="ml-2"
              >
                Settings
              </Button>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h3 className="font-medium">Push Notifications</h3>
            <p className="text-sm text-muted-foreground">
              Receive notifications even when the app is closed
            </p>
          </div>
          <Switch
            checked={pushNotifications}
            onCheckedChange={handlePushNotificationToggle}
            disabled={isLoading}
          />
        </div>

        <div className="space-y-4 pt-4 border-t">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h3 className="font-medium flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Email Notifications
              </h3>
              <p className="text-sm text-muted-foreground">
                Send reminder notifications to your email
              </p>
            </div>
            <Switch
              checked={emailNotifications}
              onCheckedChange={setEmailNotifications}
              disabled={isLoading}
            />
          </div>

          {emailNotifications && (
            <div className="space-y-2 ml-6">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={emailAddress}
                onChange={(e) => setEmailAddress(e.target.value)}
                placeholder="Enter your email address"
              />
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h3 className="font-medium flex items-center gap-2">
                <Phone className="w-4 h-4" />
                SMS Notifications
              </h3>
              <p className="text-sm text-muted-foreground">
                Send reminder notifications to your phone
              </p>
            </div>
            <Switch
              checked={smsNotifications}
              onCheckedChange={setSmsNotifications}
              disabled={isLoading}
            />
          </div>

          {smsNotifications && (
            <div className="space-y-2 ml-6">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="Enter your phone number"
              />
            </div>
          )}
        </div>

        <div className="pt-4 border-t space-y-3">
          <Button
            onClick={savePreferences}
            disabled={isLoading}
            className="w-full"
          >
            Save Notification Preferences
          </Button>

          <Button
            variant="outline"
            onClick={testNotification}
            disabled={isLoading || (!browserNotifications && !pushNotifications)}
            className="w-full"
          >
            <Settings className="w-4 h-4 mr-2" />
            Test Notifications
          </Button>
        </div>

        {!browserNotifications && !pushNotifications && !emailNotifications && !smsNotifications && (
          <div className="p-4 bg-muted rounded-lg flex items-center gap-3">
            <BellOff className="w-5 h-5 text-muted-foreground" />
            <div className="text-sm text-muted-foreground">
              Enable at least one notification method to receive reminders for your notes
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default NotificationSettings;
