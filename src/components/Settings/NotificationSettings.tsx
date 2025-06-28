
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Bell, BellOff, Settings } from 'lucide-react';
import { PushNotificationService } from '../../services/pushNotificationService';
import { NotificationService } from '../../services/notificationService';
import { toast } from 'sonner';

const NotificationSettings: React.FC = () => {
  const [browserNotifications, setBrowserNotifications] = useState(false);
  const [pushNotifications, setPushNotifications] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
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

    checkNotificationStatus();
  }, []);

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

        <div className="pt-4 border-t">
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

        {!browserNotifications && !pushNotifications && (
          <div className="p-4 bg-muted rounded-lg flex items-center gap-3">
            <BellOff className="w-5 h-5 text-muted-foreground" />
            <div className="text-sm text-muted-foreground">
              Enable notifications to receive reminders for your notes
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default NotificationSettings;
