/**
 * Service Worker Registration Utility
 * Handles PWA service worker registration with proper error handling
 */

export function registerServiceWorker() {
  // Check if service workers are supported
  if (!('serviceWorker' in navigator)) {
    console.warn('⚠️ PWA: Service Workers not supported in this browser');
    return;
  }

  // Register service worker after page load
  window.addEventListener('load', async () => {
    try {
      console.log('🔧 PWA: Registering service worker...');

      const registration = await navigator.serviceWorker.register('/sw.js', {
        scope: '/'
      });

      console.log('✅ PWA: Service worker registered successfully', registration);

      // Check for updates periodically
      setInterval(() => {
        registration.update();
      }, 60 * 60 * 1000); // Check every hour

      // Handle service worker updates
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;
        console.log('🔄 PWA: New service worker found, installing...');

        newWorker.addEventListener('statechange', () => {
          if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
            console.log('🆕 PWA: New service worker installed, update available');
            
            // Notify user about update (optional)
            if (confirm('A new version is available! Reload to update?')) {
              newWorker.postMessage({ type: 'SKIP_WAITING' });
              window.location.reload();
            }
          }
        });
      });

      // Handle controller change (new service worker activated)
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        console.log('🔄 PWA: Service worker controller changed');
      });

    } catch (error) {
      console.error('❌ PWA: Service worker registration failed', error);
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
      console.log('🗑️ PWA: Service worker unregistered');
    }
  } catch (error) {
    console.error('❌ PWA: Failed to unregister service worker', error);
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
    console.error('❌ PWA: Failed to get service worker registration', error);
    return null;
  }
}

/**
 * Send message to service worker
 */
export async function sendMessageToServiceWorker(message) {
  const registration = await getServiceWorkerRegistration();
  
  if (!registration || !registration.active) {
    console.warn('⚠️ PWA: No active service worker to send message to');
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
    
    console.log('🗑️ PWA: All caches cleared');
  } catch (error) {
    console.error('❌ PWA: Failed to clear caches', error);
  }
}

export default {
  registerServiceWorker,
  unregisterServiceWorker,
  isPWA,
  canInstall,
  getServiceWorkerRegistration,
  sendMessageToServiceWorker,
  clearAllCaches
};
