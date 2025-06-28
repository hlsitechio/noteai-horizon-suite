
const CACHE_NAME = 'notes-app-v2';
const CRITICAL_RESOURCES = [
  '/',
  '/manifest.json'
];

// Install event - cache critical resources with error handling
self.addEventListener('install', (event) => {
  console.log('Service Worker: Installing optimized service worker v2');
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Service Worker: Caching critical resources');
        // Cache resources individually to handle failures gracefully
        return Promise.allSettled(
          CRITICAL_RESOURCES.map(resource => 
            cache.add(resource).catch(error => {
              console.warn(`Service Worker: Failed to cache ${resource}:`, error);
              return null;
            })
          )
        );
      })
      .catch((error) => {
        console.error('Service Worker: Failed to open cache:', error);
      })
  );
  
  // Force activation of new service worker
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activating optimized service worker v2');
  
  event.waitUntil(
    Promise.all([
      // Clean up old caches
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME) {
              console.log('Service Worker: Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      }),
      // Take control of all pages
      self.clients.claim()
    ])
  );
});

// Fetch event - optimized caching strategy
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Skip cross-origin requests and non-GET requests
  if (url.origin !== location.origin || request.method !== 'GET') {
    return;
  }
  
  // Skip lovable.js to prevent conflicts
  if (url.pathname.includes('lovable.js')) {
    return;
  }
  
  // Network first for API calls and Supabase requests
  if (url.pathname.includes('/api/') || 
      url.hostname.includes('supabase') || 
      url.pathname.includes('/auth/')) {
    event.respondWith(
      fetch(request)
        .catch(() => {
          return new Response('Offline', { status: 503 });
        })
    );
    return;
  }
  
  // Cache first for static resources
  event.respondWith(
    caches.match(request)
      .then((response) => {
        if (response) {
          return response;
        }
        
        return fetch(request)
          .then((response) => {
            // Only cache successful responses
            if (response.status === 200) {
              const responseToCache = response.clone();
              caches.open(CACHE_NAME)
                .then((cache) => {
                  cache.put(request, responseToCache);
                })
                .catch(error => {
                  console.warn('Service Worker: Failed to cache response:', error);
                });
            }
            return response;
          });
      })
      .catch((error) => {
        console.error('Service Worker: Fetch failed:', error);
        return new Response('Service Unavailable', { status: 503 });
      })
  );
});

// Simplified error handling
self.addEventListener('error', (event) => {
  console.error('Service Worker: Error:', event.error);
});

self.addEventListener('unhandledrejection', (event) => {
  console.error('Service Worker: Unhandled promise rejection:', event.reason);
  event.preventDefault();
});
