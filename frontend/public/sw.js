// Service Worker for Music Streaming App PWA
// Version 1.1.0 - CRITICAL FIX: Network-first for HTML/JS to prevent stale code

const CACHE_NAME = 'music-streaming-v1.1.0';  // ✅ Bumped version to invalidate old cache
const RUNTIME_CACHE = 'music-streaming-runtime-v1.1.0';

// Assets to cache on install (only essential files that exist)
const PRECACHE_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icon.svg'
];

// Install event - cache essential assets with error handling
self.addEventListener('install', (event) => {
  console.log('[SW] Installing service worker v1.1.0...');
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[SW] Caching essential assets...');
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
        // Skip waiting to activate new SW immediately
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('[SW] Installation failed:', error);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating service worker v1.1.0...');
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames
            .filter((cacheName) => {
              // Delete all old caches
              return cacheName !== CACHE_NAME && cacheName !== RUNTIME_CACHE;
            })
            .map((cacheName) => {
              console.log(`[SW] Deleting old cache: ${cacheName}`);
              return caches.delete(cacheName);
            })
        );
      })
      .then(() => {
        console.log('[SW] Activation complete - taking control of all clients');
        // Take control of all clients immediately
        return self.clients.claim();
      })
  );
});

// Fetch event - CRITICAL FIX: Network-first for HTML/JS/CSS
self.addEventListener('fetch', (event) => {
  const { request } = event;
  
  // Only handle GET requests
  if (request.method !== 'GET') {
    return;
  }

  try {
    const url = new URL(request.url);
    
    // ✅ CRITICAL: Skip ALL Supabase requests (always fetch fresh)
    if (url.hostname.includes('supabase.co') || url.hostname.includes('supabase.')) {
      console.log('[SW] Bypassing cache for Supabase:', url.pathname);
      return; // Let browser handle it directly
    }

    // ✅ Skip cross-origin requests (except Supabase which is handled above)
    if (url.origin !== location.origin) {
      return;
    }

    // ✅ Skip audio streaming (don't cache large files)
    if (request.destination === 'audio' || url.pathname.includes('/storage/v1/object/')) {
      return;
    }

    // ✅ CRITICAL FIX: Network-first for HTML, JS, CSS (prevent stale code)
    const isNavigationOrScript = 
      request.mode === 'navigate' || 
      request.destination === 'document' ||
      request.destination === 'script' ||
      request.destination === 'style' ||
      url.pathname.endsWith('.js') ||
      url.pathname.endsWith('.jsx') ||
      url.pathname.endsWith('.css') ||
      url.pathname.endsWith('.html') ||
      url.pathname === '/';

    if (isNavigationOrScript) {
      console.log('[SW] Network-first for:', url.pathname);
      event.respondWith(
        fetch(request)
          .then((response) => {
            // Cache the fresh response for offline fallback
            if (response && response.status === 200) {
              const responseClone = response.clone();
              caches.open(RUNTIME_CACHE).then((cache) => {
                cache.put(request, responseClone).catch(() => {});
              });
            }
            return response;
          })
          .catch(() => {
            // Fallback to cache only if network fails
            console.log('[SW] Network failed, trying cache for:', url.pathname);
            return caches.match(request);
          })
      );
      return;
    }

    // ✅ Network-first for API calls
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

    // ✅ Cache-first ONLY for truly static assets (images, fonts, etc.)
    const isStaticAsset = 
      request.destination === 'image' ||
      request.destination === 'font' ||
      url.pathname.match(/\.(png|jpg|jpeg|gif|webp|svg|woff|woff2|ttf|eot)$/);

    if (isStaticAsset) {
      console.log('[SW] Cache-first for static asset:', url.pathname);
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
              });
          })
      );
      return;
    }

    // ✅ Default: Network-first for everything else
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

  } catch (error) {
    // Invalid URL - just fetch normally
    console.error('[SW] Error processing request:', error);
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
  console.log('[SW] Syncing likes...');
}
