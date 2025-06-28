
export class PushNotificationService {
  private static registration: ServiceWorkerRegistration | null = null;

  static async initialize(): Promise<boolean> {
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
      console.warn('Push notifications are not supported in this browser');
      return false;
    }

    try {
      // Register service worker
      const registration = await navigator.serviceWorker.register('/sw.js');
      this.registration = registration;
      console.log('Service Worker registered successfully');
      return true;
    } catch (error) {
      console.error('Service Worker registration failed:', error);
      return false;
    }
  }

  static async requestPermission(): Promise<boolean> {
    if (!('Notification' in window)) {
      console.warn('This browser does not support notifications');
      return false;
    }

    if (Notification.permission === 'granted') {
      return true;
    }

    if (Notification.permission === 'denied') {
      console.warn('Notifications are blocked by the user');
      return false;
    }

    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }

  static async subscribeToPush(): Promise<PushSubscription | null> {
    if (!this.registration) {
      console.error('Service Worker not registered');
      return null;
    }

    try {
      const subscription = await this.registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: this.urlBase64ToUint8Array(
          // You'll need to replace this with your actual VAPID public key
          'BEl62iUYgUivxIkv69yViEuiBIa40HI80Y-4s9l0nM6QoKjc1JqrZ7MJJ_8vT0M5W6bBz0cFNJFj8YqMlBJz8A'
        )
      });

      console.log('Push subscription successful:', subscription);
      return subscription;
    } catch (error) {
      console.error('Failed to subscribe to push notifications:', error);
      return null;
    }
  }

  private static urlBase64ToUint8Array(base64String: string): Uint8Array {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
      .replace(/-/g, '+')
      .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }

  static async showLocalNotification(title: string, options?: {
    body?: string;
    icon?: string;
    badge?: string;
    tag?: string;
    data?: any;
  }): Promise<void> {
    if (!this.registration) {
      console.error('Service Worker not registered');
      return;
    }

    try {
      await this.registration.showNotification(title, {
        body: options?.body,
        icon: options?.icon || '/favicon.ico',
        badge: options?.badge || '/favicon.ico',
        tag: options?.tag,
        data: options?.data,
        requireInteraction: true,
        silent: false
      });
    } catch (error) {
      console.error('Failed to show notification:', error);
    }
  }

  static async scheduleNotification(title: string, body: string, triggerTime: Date, data?: any): Promise<void> {
    const now = new Date().getTime();
    const delay = triggerTime.getTime() - now;

    if (delay <= 0) {
      // Show immediately if time has passed
      await this.showLocalNotification(title, { body, data });
      return;
    }

    // Schedule for later
    setTimeout(async () => {
      await this.showLocalNotification(title, { 
        body, 
        data
      });
    }, delay);
  }
}
