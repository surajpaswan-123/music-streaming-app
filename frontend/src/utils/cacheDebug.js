/**
 * PWA Cache Debugging Utility
 * Use this to diagnose cache-related issues
 * 
 * Usage in browser console:
 * - window.debugCache()
 * - window.clearCache()
 * - window.checkSWStatus()
 */

/**
 * Debug cache contents
 */
export async function debugCache() {
  if (!('caches' in window)) {
    console.log('❌ Cache API not supported');
    return;
  }

  try {
    const cacheNames = await caches.keys();
    console.log('📦 Total caches:', cacheNames.length);
    console.log('📦 Cache names:', cacheNames);

    for (const cacheName of cacheNames) {
      const cache = await caches.open(cacheName);
      const keys = await cache.keys();
      
      console.log(`\n📦 Cache: ${cacheName}`);
      console.log(`   Entries: ${keys.length}`);
      
      keys.forEach((request, index) => {
        const url = new URL(request.url);
        console.log(`   ${index + 1}. ${url.pathname}`);
      });
    }

    return { cacheNames, totalCaches: cacheNames.length };
  } catch (error) {
    console.error('❌ Cache debug failed:', error);
    return { error: error.message };
  }
}

/**
 * Clear all caches
 */
export async function clearCache() {
  if (!('caches' in window)) {
    console.log('❌ Cache API not supported');
    return;
  }

  try {
    const cacheNames = await caches.keys();
    console.log('🗑️ Clearing', cacheNames.length, 'caches...');

    await Promise.all(
      cacheNames.map(async (cacheName) => {
        await caches.delete(cacheName);
        console.log('✅ Deleted cache:', cacheName);
      })
    );

    console.log('✅ All caches cleared!');
    console.log('🔄 Reload page to see fresh content');
    
    return { success: true, cleared: cacheNames.length };
  } catch (error) {
    console.error('❌ Cache clear failed:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Check service worker status
 */
export async function checkSWStatus() {
  if (!('serviceWorker' in navigator)) {
    console.log('❌ Service workers not supported');
    return { supported: false };
  }

  try {
    const registration = await navigator.serviceWorker.getRegistration();
    
    if (!registration) {
      console.log('❌ No service worker registered');
      return { registered: false };
    }

    console.log('✅ Service worker registered');
    console.log('   Scope:', registration.scope);
    console.log('   Active:', !!registration.active);
    console.log('   Installing:', !!registration.installing);
    console.log('   Waiting:', !!registration.waiting);

    if (registration.active) {
      console.log('   Active SW script:', registration.active.scriptURL);
    }

    return {
      registered: true,
      scope: registration.scope,
      active: !!registration.active,
      installing: !!registration.installing,
      waiting: !!registration.waiting
    };
  } catch (error) {
    console.error('❌ SW status check failed:', error);
    return { error: error.message };
  }
}

/**
 * Force service worker update
 */
export async function forceSWUpdate() {
  if (!('serviceWorker' in navigator)) {
    console.log('❌ Service workers not supported');
    return;
  }

  try {
    const registration = await navigator.serviceWorker.getRegistration();
    
    if (!registration) {
      console.log('❌ No service worker registered');
      return;
    }

    console.log('🔄 Checking for service worker updates...');
    await registration.update();
    
    if (registration.waiting) {
      console.log('✅ New service worker available, activating...');
      registration.waiting.postMessage({ type: 'SKIP_WAITING' });
      
      setTimeout(() => {
        console.log('🔄 Reloading page...');
        window.location.reload();
      }, 500);
    } else {
      console.log('✅ Service worker is up to date');
    }
  } catch (error) {
    console.error('❌ SW update failed:', error);
  }
}

/**
 * Check if specific URL is cached
 */
export async function isURLCached(url) {
  if (!('caches' in window)) {
    return false;
  }

  try {
    const cacheNames = await caches.keys();
    
    for (const cacheName of cacheNames) {
      const cache = await caches.open(cacheName);
      const response = await cache.match(url);
      
      if (response) {
        console.log(`✅ Found in cache: ${cacheName}`);
        console.log('   URL:', url);
        console.log('   Status:', response.status);
        console.log('   Type:', response.type);
        return { cached: true, cacheName, status: response.status };
      }
    }

    console.log('❌ Not cached:', url);
    return { cached: false };
  } catch (error) {
    console.error('❌ Cache check failed:', error);
    return { error: error.message };
  }
}

/**
 * Get cache statistics
 */
export async function getCacheStats() {
  if (!('caches' in window)) {
    console.log('❌ Cache API not supported');
    return;
  }

  try {
    const cacheNames = await caches.keys();
    let totalEntries = 0;
    const stats = [];

    for (const cacheName of cacheNames) {
      const cache = await caches.open(cacheName);
      const keys = await cache.keys();
      totalEntries += keys.length;
      
      stats.push({
        name: cacheName,
        entries: keys.length
      });
    }

    console.log('📊 Cache Statistics:');
    console.log('   Total caches:', cacheNames.length);
    console.log('   Total entries:', totalEntries);
    stats.forEach(stat => {
      console.log(`   - ${stat.name}: ${stat.entries} entries`);
    });

    return {
      totalCaches: cacheNames.length,
      totalEntries,
      caches: stats
    };
  } catch (error) {
    console.error('❌ Stats failed:', error);
    return { error: error.message };
  }
}

// Make functions available globally for debugging
if (typeof window !== 'undefined') {
  window.debugCache = debugCache;
  window.clearCache = clearCache;
  window.checkSWStatus = checkSWStatus;
  window.forceSWUpdate = forceSWUpdate;
  window.isURLCached = isURLCached;
  window.getCacheStats = getCacheStats;
}

export default {
  debugCache,
  clearCache,
  checkSWStatus,
  forceSWUpdate,
  isURLCached,
  getCacheStats
};
