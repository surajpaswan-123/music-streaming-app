// Service Worker for Music Streaming App PWA
// Version 1.0.4 - Production-ready with proper icon handling

const CACHE_NAME = 'music-streaming-v1';
const RUNTIME_CACHE = 'music-streaming-runtime-v1';

// Assets to cache on install (only essential files that exist)
const PRECACHE_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icon.svg'
];

// Install event - cache essential assets with error handling
self.addEventListener('install', (event) => {
  console.log('[SW] Installing service worker...');
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[SW] Caching essential assets...');
        // Try to cache each asset individually to avoid all-or-nothing failure
        return Promise.allSettled(
          PRECACHE_ASSETS.map(url => 
            cache.add(url)
              .then(() => console.log(`[SW] Cached: ${url}`))
              .catch(err => {
                console.warn(`[SW] Failed to cache ${url}:`, err);
                return null;
              })
          )
        );
      })
      .then(() => {
        console.log('[SW] Installation complete');
        // Don't call skipWaiting() - let new SW wait
        // This prevents "update available" popups
      })
      .catch((error) => {
        console.error('[SW] Installation failed:', error);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating service worker...');
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames
            .filter((cacheName) => {
              return cacheName !== CACHE_NAME && cacheName !== RUNTIME_CACHE;
            })
            .map((cacheName) => {
              console.log(`[SW] Deleting old cache: ${cacheName}`);
              return caches.delete(cacheName);
            })
        );
      })
      .then(() => {
        console.log('[SW] Activation complete');
        // Don't call clients.claim() - prevents taking control immediately
        // New SW will control on next page load
      })
  );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  const { request } = event;
  
  // Only handle same-origin requests
  try {
    const url = new URL(request.url);
    
    // Skip cross-origin requests
    if (url.origin !== location.origin) {
      return;
    }

    // Skip Supabase API requests (always fetch fresh)
    if (url.hostname.includes('supabase.co')) {
      return;
    }

    // Skip audio streaming (don't cache large files)
    if (request.destination === 'audio' || request.url.includes('/storage/v1/object/')) {
      return;
    }

    // Network-first strategy for API calls
    if (url.pathname.startsWith('/api/')) {
      event.respondWith(
        fetch(request)
          .then((response) => {
            if (response && response.status === 200) {
              const responseClone = response.clone();
              caches.open(RUNTIME_CACHE).then((cache) => {
                cache.put(request, responseClone).catch(() => {});
              });
            }
            return response;
          })
          .catch(() => {
            return caches.match(request);
          })
      );
      return;
    }

    // Cache-first strategy for static assets
    event.respondWith(
      caches.match(request)
        .then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse;
          }

          return fetch(request)
            .then((response) => {
              if (!response || response.status !== 200 || response.type === 'error') {
                return response;
              }

              const responseClone = response.clone();
              caches.open(RUNTIME_CACHE)
                .then((cache) => {
                  cache.put(request, responseClone).catch(() => {});
                });

              return response;
            })
            .catch(() => {
              return caches.match('/offline.html').catch(() => {
                return new Response('Offline', { status: 503 });
              });
            });
        })
    );
  } catch (error) {
    // Invalid URL - just fetch normally
    event.respondWith(fetch(request));
  }
});

// Handle messages from clients
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    console.log('[SW] Skip waiting requested');
    self.skipWaiting();
  }
});

// Background sync for offline actions
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-likes') {
    event.waitUntil(syncLikes());
  }
});

async function syncLikes() {
  // Placeholder for syncing liked songs when back online
  console.log('[SW] Syncing likes...');
}
