// Service Worker for Online Note AI PWA
const CACHE_NAME = 'noteai-pwa-v1';
const STATIC_CACHE_NAME = 'noteai-static-v1';
const DYNAMIC_CACHE_NAME = 'noteai-dynamic-v1';

// Files to cache immediately - adjusted for Lovable preview environment
const STATIC_ASSETS = [
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

// Skip these URLs entirely
const SKIP_ROUTES = [
  'fonts.googleapis.com',
  'fonts.gstatic.com'
];

// Install event - simplified to avoid cache errors
self.addEventListener('install', (event) => {
  // Development logging only
  if (self.location.hostname.includes('localhost') || self.location.hostname.includes('lovable')) {
    console.log('[SW] Installing service worker...');
  }
  
  // Skip caching temporarily to avoid cache storage errors
  event.waitUntil(self.skipWaiting());
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  // Development logging only
  if (self.location.hostname.includes('localhost') || self.location.hostname.includes('lovable')) {
    console.log('[SW] Activating service worker...');
  }
  
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
              // Development logging only
              if (self.location.hostname.includes('localhost') || self.location.hostname.includes('lovable')) {
                console.log('[SW] Deleting old cache:', cacheName);
              }
              return caches.delete(cacheName);
            })
        );
      }),
      self.clients.claim()
    ])
  );
});

// Fetch event - handle requests with appropriate strategy and circuit breaker
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

  // Skip external font services entirely
  if (isSkippedRoute(url.href)) {
    return;
  }

  // Skip root path requests in preview environment to prevent 404 loops
  if (url.pathname === '/' && url.hostname.includes('lovable')) {
    // Development logging only
    if (self.location.hostname.includes('localhost') || self.location.hostname.includes('lovable')) {
      console.log('[SW] Skipping root path cache in Lovable preview environment');
    }
    return;
  }

  // Also skip app routes to prevent interference with React Router
  if (url.pathname.startsWith('/app/')) {
    return;
  }

  // Circuit breaker - prevent infinite loops with improved logic
  const requestKey = `sw_request_${url.pathname}`;
  const now = Date.now();
  const requestData = self.globalThis[requestKey] || { count: 0, windowStart: now };
  
  // Reset counter if window has expired (5 seconds)
  if (now - requestData.windowStart > 5000) {
    requestData.count = 0;
    requestData.windowStart = now;
  }
  
  // Only trigger circuit breaker for excessive requests in short time window
  if (requestData.count > 20) {
    // Development logging only - reduce noise
    if ((self.location.hostname.includes('localhost') || self.location.hostname.includes('lovable')) && requestData.count === 21) {
      console.warn('[SW] Circuit breaker triggered - too many requests to', url.pathname);
    }
    return;
  }
  
  // Increment request counter
  requestData.count++;
  self.globalThis[requestKey] = requestData;

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
    
    // Only cache successful responses that are not partial (avoid 206 status code errors)
    if (response.ok && response.status !== 206) {
      const cache = await caches.open(DYNAMIC_CACHE_NAME);
      cache.put(request, response.clone());
    }
    
    return response;
  } catch (error) {
    // Development logging only
    if (self.location.hostname.includes('localhost') || self.location.hostname.includes('lovable')) {
      console.log('[SW] Network failed, trying cache:', error);
    }
    const cachedResponse = await caches.match(request);
    
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Return a fallback page for navigation requests
    if (request.destination === 'document') {
      return caches.match('/app/dashboard');
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
    // Development logging only
    if (self.location.hostname.includes('localhost') || self.location.hostname.includes('lovable')) {
      console.log('[SW] Failed to fetch asset:', error);
    }
    throw error;
  }
}

// In-memory storage for failed requests (since localStorage isn't available in SW)
const failedRequests = new Map();

// Stale-while-revalidate strategy (for most content) - FIXED
async function staleWhileRevalidateStrategy(request) {
  const cache = await caches.open(DYNAMIC_CACHE_NAME);
  const cachedResponse = await cache.match(request);
  
  // Prevent excessive retries by tracking failed requests in memory
  const cacheKey = `failed_${request.url}`;
  const failedAttempts = failedRequests.get(cacheKey) || 0;
  
  // Be less aggressive - only block after many failures
  if (failedAttempts > 8) {
    if (cachedResponse) {
      return cachedResponse;
    }
    // For critical routes, let them pass through instead of blocking
    if (request.url.includes('/app/') || request.url.includes('/api/')) {
      // Development logging only - DO NOT expose URLs in production
      if (self.location.hostname.includes('localhost') || self.location.hostname.includes('lovable')) {
        console.log('[SW] Allowing critical route despite failures');
      }
      // Let the request pass through normally
      return fetch(request);
    }
  }
  
  const fetchPromise = fetch(request).then((response) => {
    // Reset failure count on success
    if (response && response.ok && response.status === 200) {
      failedRequests.delete(cacheKey);
      cache.put(request, response.clone());
    }
    return response;
  }).catch((error) => {
    // Increment failure count
    failedRequests.set(cacheKey, failedAttempts + 1);
    // Development logging only - DO NOT expose URLs in production
    if (self.location.hostname.includes('localhost') || self.location.hostname.includes('lovable')) {
      console.log('[SW] Fetch failed for request:', error);
    }
    return null;
  });
  
  // Return cached response immediately if available
  if (cachedResponse) {
    // Background update without blocking
    fetchPromise.catch(() => {}); // Silent fail
    return cachedResponse;
  }
  
  // Wait for network response
  try {
    const networkResponse = await fetchPromise;
    
    // If network response is valid, return it
    if (networkResponse && networkResponse.ok) {
      return networkResponse;
    }
    
    // For navigation requests, try to return the dashboard
    if (request.destination === 'document') {
      const dashboard = await caches.match('/app/dashboard');
      if (dashboard) {
        return dashboard;
      }
    }
    
    // Return a proper 404 without causing loops
    return new Response('Page not found', { 
      status: 404, 
      statusText: 'Not Found',
      headers: { 'Content-Type': 'text/html' }
    });
  } catch (error) {
    // Return cached response if available
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // For navigation requests, try to return the dashboard
    if (request.destination === 'document') {
      const dashboard = await caches.match('/app/dashboard');
      if (dashboard) {
        return dashboard;
      }
    }
    
    // Return a proper error without causing loops
    return new Response('Service temporarily unavailable', { 
      status: 503, 
      statusText: 'Service Unavailable',
      headers: { 'Content-Type': 'text/plain' }
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

function isSkippedRoute(url) {
  return SKIP_ROUTES.some(route => url.includes(route));
}

// Background sync for offline actions
self.addEventListener('sync', (event) => {
  // Development logging only
  if (self.location.hostname.includes('localhost') || self.location.hostname.includes('lovable')) {
    console.log('[SW] Background sync:', event.tag);
  }
  
  if (event.tag === 'sync-notes') {
    event.waitUntil(syncOfflineNotes());
  }
});

// Sync offline notes when back online
async function syncOfflineNotes() {
  try {
    // Get offline notes from IndexedDB and sync with server
    // Development logging only
    if (self.location.hostname.includes('localhost') || self.location.hostname.includes('lovable')) {
      console.log('[SW] Syncing offline notes...');
    }
    
    // This would integrate with your note storage system
    // For now, just log the action
    
  } catch (error) {
    // Development logging only
    if (self.location.hostname.includes('localhost') || self.location.hostname.includes('lovable')) {
      console.error('[SW] Failed to sync offline notes:', error);
    }
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