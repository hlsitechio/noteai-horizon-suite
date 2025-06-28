
const CACHE_NAME = 'notes-app-v3'; // Increment version to force cache refresh
const CRITICAL_RESOURCES = [
  '/',
  '/manifest.json'
];

// Install event - force immediate activation and cache clear
self.addEventListener('install', (event) => {
  console.log('Service Worker: Installing optimized service worker v3');
  
  event.waitUntil(
    Promise.all([
      // Clear all existing caches first
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            console.log('Service Worker: Deleting cache during install:', cacheName);
            return caches.delete(cacheName);
          })
        );
      }),
      // Then cache critical resources
      caches.open(CACHE_NAME)
        .then((cache) => {
          console.log('Service Worker: Caching critical resources');
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
    ])
  );
  
  // Force immediate activation
  self.skipWaiting();
});

// Activate event - take control immediately and clear old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activating optimized service worker v3');
  
  event.waitUntil(
    Promise.all([
      // Clean up any remaining old caches
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
      // Take control of all pages immediately
      self.clients.claim()
    ])
  );
});

// Fetch event - network first for everything to avoid stale cache issues
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
  
  // Network first for ALL requests to avoid stale cache issues
  event.respondWith(
    fetch(request)
      .then((response) => {
        // Only cache successful responses for static assets
        if (response.status === 200 && 
            (url.pathname.includes('/assets/') || 
             url.pathname === '/' || 
             url.pathname.includes('.js') || 
             url.pathname.includes('.css'))) {
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
      })
      .catch((error) => {
        console.error('Service Worker: Network request failed:', error);
        // Only try cache as fallback for non-asset requests
        if (!url.pathname.includes('/assets/')) {
          return caches.match(request)
            .then((response) => {
              if (response) {
                console.log('Service Worker: Serving from cache:', request.url);
                return response;
              }
              return new Response('Service Unavailable', { status: 503 });
            });
        }
        return new Response('Asset not found', { status: 404 });
      })
  );
});

// Enhanced error handling
self.addEventListener('error', (event) => {
  console.error('Service Worker: Error:', event.error);
});

self.addEventListener('unhandledrejection', (event) => {
  console.error('Service Worker: Unhandled promise rejection:', event.reason);
  event.preventDefault();
});

// Message handler for manual cache clearing
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'CLEAR_CACHE') {
    event.waitUntil(
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            console.log('Service Worker: Manually clearing cache:', cacheName);
            return caches.delete(cacheName);
          })
        );
      })
    );
  }
});
