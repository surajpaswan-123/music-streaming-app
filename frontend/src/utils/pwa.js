/**
 * Service Worker Registration Utility
 * Handles PWA service worker registration with SILENT updates
 * No "update available" popups - updates happen on next page load
 */

export function registerServiceWorker() {
  // Check if service workers are supported
  if (!('serviceWorker' in navigator)) {
    return;
  }

  // Register service worker after page load
  window.addEventListener('load', async () => {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js', {
        scope: '/'
      });

      // SILENT UPDATE STRATEGY
      // New service worker will install in background
      // Will activate only when all tabs are closed
      // No user notification needed

      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;

        newWorker.addEventListener('statechange', () => {
          if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
            // New version installed but not activated yet
            // Will activate on next page load (when user closes all tabs)
            // NO POPUP - Silent update
          }
        });
      });

    } catch (error) {
      // Silent fail - don't show error to user
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
      await registration.unregister();
    }
  } catch (error) {
    // Silent fail
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
    
    await Promise.all(
      cacheNames.map(cacheName => caches.delete(cacheName))
    );
  } catch (error) {
    // Silent fail
  }
}

/**
 * Force update service worker (manual refresh)
 * Only use this if user explicitly requests update
 */
export async function forceUpdateServiceWorker() {
  const registration = await getServiceWorkerRegistration();
  
  if (!registration) {
    return;
  }

  try {
    await registration.update();
    
    if (registration.waiting) {
      // Tell waiting service worker to skip waiting
      registration.waiting.postMessage({ type: 'SKIP_WAITING' });
      
      // Reload page to activate new service worker
      window.location.reload();
    }
  } catch (error) {
    // Silent fail
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
  forceUpdateServiceWorker
};
