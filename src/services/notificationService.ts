
export class NotificationService {
  private static hasPermission = false;

  static async requestPermission(): Promise<boolean> {
    if (!('Notification' in window)) {
      console.warn('This browser does not support notifications');
      return false;
    }

    if (Notification.permission === 'granted') {
      this.hasPermission = true;
      return true;
    }

    if (Notification.permission === 'denied') {
      return false;
    }

    const permission = await Notification.requestPermission();
    this.hasPermission = permission === 'granted';
    return this.hasPermission;
  }

  static canShowNotifications(): boolean {
    return 'Notification' in window && Notification.permission === 'granted';
  }

  static showNotification(title: string, options?: {
    body?: string;
    icon?: string;
    tag?: string;
    requireInteraction?: boolean;
    actions?: Array<{ action: string; title: string; icon?: string }>;
  }): Notification | null {
    if (!this.canShowNotifications()) {
      console.warn('Notifications not permitted');
      return null;
    }

    const notification = new Notification(title, {
      body: options?.body,
      icon: options?.icon || '/favicon.ico',
      tag: options?.tag,
      requireInteraction: options?.requireInteraction || true,
      badge: '/favicon.ico',
      ...options
    });

    // Auto-close after 10 seconds unless requireInteraction is true
    if (!options?.requireInteraction) {
      setTimeout(() => {
        notification.close();
      }, 10000);
    }

    return notification;
  }

  static showReminderNotification(noteTitle: string, noteId: string, reminderId: string): Notification | null {
    return this.showNotification(`📝 Reminder: ${noteTitle}`, {
      body: 'Click to view your note',
      tag: `reminder-${reminderId}`,
      requireInteraction: true,
      actions: [
        { action: 'view', title: 'View Note' },
        { action: 'snooze', title: 'Snooze 15min' },
        { action: 'dismiss', title: 'Dismiss' }
      ]
    });
  }
}
