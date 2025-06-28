
// Service Worker for handling push notifications
const CACHE_NAME = 'notes-app-v1';

self.addEventListener('install', (event) => {
  console.log('Service Worker installing');
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  console.log('Service Worker activating');
  event.waitUntil(self.clients.claim());
});

self.addEventListener('push', (event) => {
  console.log('Push event received:', event);
  
  let notificationData = {
    title: '📝 Note Reminder',
    body: 'You have a reminder ready!',
    icon: '/favicon.ico',
    badge: '/favicon.ico',
    tag: 'note-reminder',
    data: {}
  };

  if (event.data) {
    try {
      const data = event.data.json();
      notificationData = { ...notificationData, ...data };
    } catch (error) {
      console.error('Error parsing push data:', error);
    }
  }

  const promiseChain = self.registration.showNotification(
    notificationData.title,
    {
      body: notificationData.body,
      icon: notificationData.icon,
      badge: notificationData.badge,
      tag: notificationData.tag,
      data: notificationData.data,
      actions: [
        { action: 'view', title: 'View Note', icon: '/favicon.ico' },
        { action: 'snooze', title: 'Snooze 15min', icon: '/favicon.ico' },
        { action: 'dismiss', title: 'Dismiss', icon: '/favicon.ico' }
      ],
      requireInteraction: true
    }
  );

  event.waitUntil(promiseChain);
});

self.addEventListener('notificationclick', (event) => {
  console.log('Notification clicked:', event);
  
  event.notification.close();

  const action = event.action;
  const data = event.notification.data;

  if (action === 'view' && data.noteId) {
    // Open the note in the app
    event.waitUntil(
      self.clients.openWindow(`/app/editor?noteId=${data.noteId}`)
    );
  } else if (action === 'snooze' && data.reminderId) {
    // Handle snooze action
    event.waitUntil(
      fetch('/api/reminders/snooze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          reminderId: data.reminderId, 
          minutes: 15 
        })
      })
    );
  } else if (action === 'dismiss' && data.reminderId) {
    // Handle dismiss action
    event.waitUntil(
      fetch('/api/reminders/dismiss', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          reminderId: data.reminderId 
        })
      })
    );
  } else {
    // Default action - open the app
    event.waitUntil(
      self.clients.openWindow('/app/dashboard')
    );
  }
});

self.addEventListener('notificationclose', (event) => {
  console.log('Notification closed:', event);
});
