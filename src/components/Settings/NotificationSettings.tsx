
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Bell, BellOff, Settings, Mail, Phone } from 'lucide-react';
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
    const checkNotificationStatus = () => {
      setBrowserNotifications(NotificationService.canShowNotifications());
      
      // Check if service worker is registered and push notifications are available
      if ('serviceWorker' in navigator && 'PushManager' in window) {
        navigator.serviceWorker.ready.then(registration => {
          registration.pushManager.getSubscription().then(subscription => {
            setPushNotifications(!!subscription);
          });
        });
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
    setIsLoading(true);
    try {
      if (!browserNotifications) {
        const granted = await NotificationService.requestPermission();
        if (granted) {
          setBrowserNotifications(true);
          toast.success('Browser notifications enabled');
        } else {
          toast.error('Please allow notifications in your browser settings');
        }
      } else {
        setBrowserNotifications(false);
        toast.info('Browser notifications disabled');
      }
    } catch (error) {
      toast.error('Failed to update notification settings');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePushNotificationToggle = async () => {
    setIsLoading(true);
    try {
      if (!pushNotifications) {
        // Initialize and enable push notifications
        const swInitialized = await PushNotificationService.initialize();
        if (!swInitialized) {
          toast.error('Push notifications are not supported in this browser');
          return;
        }

        const permissionGranted = await PushNotificationService.requestPermission();
        if (!permissionGranted) {
          toast.error('Please allow notifications in your browser settings');
          return;
        }

        const subscription = await PushNotificationService.subscribeToPush();
        if (subscription) {
          setPushNotifications(true);
          toast.success('Push notifications enabled');
        } else {
          toast.error('Failed to enable push notifications');
        }
      } else {
        // Disable push notifications
        if ('serviceWorker' in navigator) {
          const registration = await navigator.serviceWorker.ready;
          const subscription = await registration.pushManager.getSubscription();
          if (subscription) {
            await subscription.unsubscribe();
            setPushNotifications(false);
            toast.success('Push notifications disabled');
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
    if (browserNotifications) {
      NotificationService.showNotification('Test Notification', {
        body: 'This is a test notification from your notes app!',
        tag: 'test-notification'
      });
    }

    if (pushNotifications) {
      await PushNotificationService.showLocalNotification('Test Push Notification', {
        body: 'This is a test push notification!',
        tag: 'test-push'
      });
    }

    if (!browserNotifications && !pushNotifications) {
      toast.info('Please enable notifications first to test them');
    }
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
          </div>
          <Switch
            checked={browserNotifications}
            onCheckedChange={handleBrowserNotificationToggle}
            disabled={isLoading}
          />
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
            Test Browser Notifications
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
