// Service Worker for Online Note AI PWA
const CACHE_NAME = 'noteai-pwa-v1';
const STATIC_CACHE_NAME = 'noteai-static-v1';
const DYNAMIC_CACHE_NAME = 'noteai-dynamic-v1';

// Files to cache immediately
const STATIC_ASSETS = [
  '/',
  '/app/dashboard',
  '/app/notes',
  '/app/chat',
  '/manifest.json'
];

// Network-first resources (API calls, dynamic content)
const NETWORK_FIRST_ROUTES = [
  '/api/',
  'supabase.co',
  '.lovableproject.com'
];

// Cache-first resources (static assets, images)
const CACHE_FIRST_ROUTES = [
  '/icons/',
  '/assets/',
  '.png',
  '.jpg',
  '.jpeg',
  '.svg',
  '.woff2',
  '.woff'
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('[SW] Installing service worker...');
  
  event.waitUntil(
    Promise.all([
      caches.open(STATIC_CACHE_NAME).then((cache) => {
        console.log('[SW] Caching static assets');
        return cache.addAll(STATIC_ASSETS).catch((error) => {
          console.warn('[SW] Failed to cache some assets:', error);
          // Cache individual assets that work
          return Promise.allSettled(
            STATIC_ASSETS.map(url => cache.add(url).catch(err => console.warn(`Failed to cache ${url}:`, err)))
          );
        });
      }),
      self.skipWaiting()
    ])
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating service worker...');
  
  event.waitUntil(
    Promise.all([
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames
            .filter((cacheName) => 
              cacheName.startsWith('noteai-') && 
              cacheName !== STATIC_CACHE_NAME && 
              cacheName !== DYNAMIC_CACHE_NAME
            )
            .map((cacheName) => {
              console.log('[SW] Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            })
        );
      }),
      self.clients.claim()
    ])
  );
});

// Fetch event - handle requests with appropriate strategy
self.addEventListener('fetch', (event) => {
  const request = event.request;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Skip chrome-extension and other non-http(s) requests
  if (!url.protocol.startsWith('http')) {
    return;
  }

  // Determine caching strategy based on URL
  if (isNetworkFirst(url.href)) {
    event.respondWith(networkFirstStrategy(request));
  } else if (isCacheFirst(url.href)) {
    event.respondWith(cacheFirstStrategy(request));
  } else {
    event.respondWith(staleWhileRevalidateStrategy(request));
  }
});

// Network-first strategy (for API calls and dynamic content)
async function networkFirstStrategy(request) {
  try {
    const response = await fetch(request);
    
    if (response.ok) {
      const cache = await caches.open(DYNAMIC_CACHE_NAME);
      cache.put(request, response.clone());
    }
    
    return response;
  } catch (error) {
    console.log('[SW] Network failed, trying cache:', error);
    const cachedResponse = await caches.match(request);
    
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Return offline page for navigation requests
    if (request.destination === 'document') {
      return caches.match('/');
    }
    
    throw error;
  }
}

// Cache-first strategy (for static assets)
async function cacheFirstStrategy(request) {
  const cachedResponse = await caches.match(request);
  
  if (cachedResponse) {
    return cachedResponse;
  }
  
  try {
    const response = await fetch(request);
    
    if (response.ok) {
      const cache = await caches.open(STATIC_CACHE_NAME);
      cache.put(request, response.clone());
    }
    
    return response;
  } catch (error) {
    console.log('[SW] Failed to fetch asset:', error);
    throw error;
  }
}

// Stale-while-revalidate strategy (for most content)
async function staleWhileRevalidateStrategy(request) {
  const cache = await caches.open(DYNAMIC_CACHE_NAME);
  const cachedResponse = await cache.match(request);
  
  const fetchPromise = fetch(request).then((response) => {
    if (response.ok) {
      cache.put(request, response.clone());
    }
    return response;
  }).catch((error) => {
    console.log('[SW] Fetch failed for:', request.url, error);
    return cachedResponse;
  });
  
  // Always return a valid response
  if (cachedResponse) {
    // Background update
    fetchPromise.catch(() => {}); // Silent fail
    return cachedResponse;
  }
  
  // Wait for network response
  try {
    return await fetchPromise;
  } catch (error) {
    return new Response('Service Unavailable', { 
      status: 503,
      statusText: 'Service Unavailable' 
    });
  }
}

// Helper functions to determine caching strategy
function isNetworkFirst(url) {
  return NETWORK_FIRST_ROUTES.some(route => url.includes(route));
}

function isCacheFirst(url) {
  return CACHE_FIRST_ROUTES.some(route => url.includes(route));
}

// Background sync for offline actions
self.addEventListener('sync', (event) => {
  console.log('[SW] Background sync:', event.tag);
  
  if (event.tag === 'sync-notes') {
    event.waitUntil(syncOfflineNotes());
  }
});

// Sync offline notes when back online
async function syncOfflineNotes() {
  try {
    // Get offline notes from IndexedDB and sync with server
    console.log('[SW] Syncing offline notes...');
    
    // This would integrate with your note storage system
    // For now, just log the action
    
  } catch (error) {
    console.error('[SW] Failed to sync offline notes:', error);
  }
}

// Push notification handler
self.addEventListener('push', (event) => {
  if (!event.data) return;
  
  const data = event.data.json();
  
  const options = {
    body: data.body,
    icon: '/icons/icon-192x192.png',
    badge: '/icons/badge-72x72.png',
    actions: [
      {
        action: 'open',
        title: 'Open App'
      },
      {
        action: 'dismiss',
        title: 'Dismiss'
      }
    ],
    data: {
      url: data.url || '/app/dashboard'
    }
  };
  
  event.waitUntil(
    self.registration.showNotification(data.title || 'Online Note AI', options)
  );
});

// Notification click handler
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  if (event.action === 'dismiss') {
    return;
  }
  
  const url = event.notification.data?.url || '/app/dashboard';
  
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      // Try to focus existing window
      for (const client of clientList) {
        if (client.url.includes(url.split('?')[0]) && 'focus' in client) {
          return client.focus();
        }
      }
      
      // Open new window if no existing window found
      if (clients.openWindow) {
        return clients.openWindow(url);
      }
    })
  );
});

// Handle app updates
self.addEventListener('message', (event) => {
  if (event.data?.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});