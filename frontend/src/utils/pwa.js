/**
 * Service Worker Registration Utility
 * CRITICAL FIX: Force immediate activation of new service workers
 * Ensures users always get latest code on refresh
 */

export function registerServiceWorker() {
  // Check if service workers are supported
  if (!('serviceWorker' in navigator)) {
    console.log('[PWA] Service workers not supported');
    return;
  }

  // Register service worker after page load
  window.addEventListener('load', async () => {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js', {
        scope: '/',
        updateViaCache: 'none'  // ✅ CRITICAL: Never use cached service worker file
      });

      console.log('[PWA] Service worker registered successfully');

      // ✅ CRITICAL FIX: Check for updates on every page load
      registration.update().catch(err => {
        console.warn('[PWA] Update check failed:', err);
      });

      // ✅ CRITICAL: Handle updates immediately (no waiting)
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;
        console.log('[PWA] New service worker found, installing...');

        newWorker.addEventListener('statechange', () => {
          if (newWorker.state === 'installed') {
            if (navigator.serviceWorker.controller) {
              // New version available - activate immediately
              console.log('[PWA] New version installed, activating immediately...');
              
              // Tell new worker to skip waiting
              newWorker.postMessage({ type: 'SKIP_WAITING' });
              
              // Reload page once to activate new service worker
              // This ensures users get the latest code
              window.location.reload();
            } else {
              // First install
              console.log('[PWA] Service worker installed for first time');
            }
          }
        });
      });

      // ✅ Listen for controller change (new SW activated)
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        console.log('[PWA] New service worker activated');
      });

    } catch (error) {
      console.error('[PWA] Service worker registration failed:', error);
    }
  });
}

/**
 * Unregister service worker (for development/debugging)
 */
export async function unregisterServiceWorker() {
  if (!('serviceWorker' in navigator)) {
    return;
  }

  try {
    const registrations = await navigator.serviceWorker.getRegistrations();
    
    for (const registration of registrations) {
      const success = await registration.unregister();
      console.log('[PWA] Service worker unregistered:', success);
    }
    
    // Clear all caches
    await clearAllCaches();
    console.log('[PWA] All caches cleared');
    
  } catch (error) {
    console.error('[PWA] Unregister failed:', error);
  }
}

/**
 * Check if app is running as PWA
 */
export function isPWA() {
  return window.matchMedia('(display-mode: standalone)').matches ||
         window.navigator.standalone === true;
}

/**
 * Check if app can be installed
 */
export function canInstall() {
  return 'BeforeInstallPromptEvent' in window;
}

/**
 * Get service worker registration
 */
export async function getServiceWorkerRegistration() {
  if (!('serviceWorker' in navigator)) {
    return null;
  }

  try {
    return await navigator.serviceWorker.getRegistration();
  } catch (error) {
    return null;
  }
}

/**
 * Send message to service worker
 */
export async function sendMessageToServiceWorker(message) {
  const registration = await getServiceWorkerRegistration();
  
  if (!registration || !registration.active) {
    return;
  }

  registration.active.postMessage(message);
}

/**
 * Clear all caches (for debugging)
 */
export async function clearAllCaches() {
  if (!('caches' in window)) {
    return;
  }

  try {
    const cacheNames = await caches.keys();
    console.log('[PWA] Clearing caches:', cacheNames);
    
    await Promise.all(
      cacheNames.map(cacheName => caches.delete(cacheName))
    );
    
    console.log('[PWA] All caches cleared successfully');
  } catch (error) {
    console.error('[PWA] Cache clearing failed:', error);
  }
}

/**
 * Force update service worker (manual refresh)
 */
export async function forceUpdateServiceWorker() {
  const registration = await getServiceWorkerRegistration();
  
  if (!registration) {
    console.warn('[PWA] No service worker registration found');
    return;
  }

  try {
    console.log('[PWA] Forcing service worker update...');
    await registration.update();
    
    if (registration.waiting) {
      // Tell waiting service worker to skip waiting
      registration.waiting.postMessage({ type: 'SKIP_WAITING' });
      
      // Reload page to activate new service worker
      window.location.reload();
    } else {
      console.log('[PWA] No waiting service worker');
    }
  } catch (error) {
    console.error('[PWA] Force update failed:', error);
  }
}

/**
 * Get cache status for debugging
 */
export async function getCacheStatus() {
  if (!('caches' in window)) {
    return { supported: false };
  }

  try {
    const cacheNames = await caches.keys();
    const cacheDetails = await Promise.all(
      cacheNames.map(async (name) => {
        const cache = await caches.open(name);
        const keys = await cache.keys();
        return {
          name,
          entries: keys.length,
          urls: keys.map(req => req.url)
        };
      })
    );

    return {
      supported: true,
      caches: cacheDetails,
      totalCaches: cacheNames.length
    };
  } catch (error) {
    return { supported: true, error: error.message };
  }
}

export default {
  registerServiceWorker,
  unregisterServiceWorker,
  isPWA,
  canInstall,
  getServiceWorkerRegistration,
  sendMessageToServiceWorker,
  clearAllCaches,
  forceUpdateServiceWorker,
  getCacheStatus
};
