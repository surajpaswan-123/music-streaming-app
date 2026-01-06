/**
 * PWA Debug Helper
 * Run this in browser console to check PWA status
 */

export function debugPWA() {
  console.log('🔍 ===== PWA DEBUG REPORT =====');
  console.log('');

  // 1. Check HTTPS
  console.log('1️⃣ HTTPS Check:');
  const isHTTPS = window.location.protocol === 'https:' || window.location.hostname === 'localhost';
  console.log(`   ${isHTTPS ? '✅' : '❌'} HTTPS: ${window.location.protocol}`);
  console.log('');

  // 2. Check Service Worker
  console.log('2️⃣ Service Worker Check:');
  if ('serviceWorker' in navigator) {
    console.log('   ✅ Service Worker API supported');
    navigator.serviceWorker.getRegistration().then(reg => {
      if (reg) {
        console.log('   ✅ Service Worker registered');
        console.log('   📍 Scope:', reg.scope);
        console.log('   📍 State:', reg.active?.state);
      } else {
        console.log('   ❌ Service Worker NOT registered');
      }
    });
  } else {
    console.log('   ❌ Service Worker API NOT supported');
  }
  console.log('');

  // 3. Check Manifest
  console.log('3️⃣ Manifest Check:');
  const manifestLink = document.querySelector('link[rel="manifest"]');
  if (manifestLink) {
    console.log('   ✅ Manifest link found:', manifestLink.href);
    fetch(manifestLink.href)
      .then(res => res.json())
      .then(manifest => {
        console.log('   ✅ Manifest loaded successfully');
        console.log('   📍 Name:', manifest.name);
        console.log('   📍 Icons:', manifest.icons?.length || 0);
        console.log('   📍 Start URL:', manifest.start_url);
        console.log('   📍 Display:', manifest.display);
      })
      .catch(err => {
        console.log('   ❌ Manifest failed to load:', err);
      });
  } else {
    console.log('   ❌ Manifest link NOT found');
  }
  console.log('');

  // 4. Check Install Status
  console.log('4️⃣ Install Status:');
  const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
  const isIOSStandalone = window.navigator.standalone === true;
  console.log(`   ${isStandalone || isIOSStandalone ? '✅' : '❌'} App installed: ${isStandalone || isIOSStandalone}`);
  console.log('');

  // 5. Check beforeinstallprompt
  console.log('5️⃣ Install Prompt:');
  console.log('   ℹ️ beforeinstallprompt fires automatically');
  console.log('   ℹ️ Check console for "beforeinstallprompt event fired"');
  console.log('');

  // 6. Check Browser
  console.log('6️⃣ Browser Info:');
  console.log('   📍 User Agent:', navigator.userAgent);
  const isChrome = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);
  const isEdge = /Edg/.test(navigator.userAgent);
  const isSafari = /Safari/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgent);
  const isFirefox = /Firefox/.test(navigator.userAgent);
  console.log(`   ${isChrome ? '✅' : '❌'} Chrome: ${isChrome}`);
  console.log(`   ${isEdge ? '✅' : '❌'} Edge: ${isEdge}`);
  console.log(`   ${isSafari ? '⚠️' : '❌'} Safari: ${isSafari} (limited PWA support)`);
  console.log(`   ${isFirefox ? '⚠️' : '❌'} Firefox: ${isFirefox} (limited install support)`);
  console.log('');

  // 7. Check localStorage
  console.log('7️⃣ LocalStorage Check:');
  const dismissed = localStorage.getItem('pwa-install-dismissed');
  const dismissedTime = localStorage.getItem('pwa-install-dismissed-time');
  if (dismissed === 'true') {
    const daysSince = (Date.now() - parseInt(dismissedTime)) / (1000 * 60 * 60 * 24);
    console.log(`   ⚠️ Popup dismissed ${daysSince.toFixed(1)} days ago`);
    console.log('   ℹ️ Will show again after 7 days');
  } else {
    console.log('   ✅ No dismissal recorded');
  }
  console.log('');

  // 8. Check Icons
  console.log('8️⃣ Icon Check:');
  const appleIcon = document.querySelector('link[rel="apple-touch-icon"]');
  const favicon = document.querySelector('link[rel="icon"]');
  console.log(`   ${appleIcon ? '✅' : '❌'} Apple Touch Icon: ${appleIcon?.href || 'NOT FOUND'}`);
  console.log(`   ${favicon ? '✅' : '❌'} Favicon: ${favicon?.href || 'NOT FOUND'}`);
  console.log('');

  // 9. Recommendations
  console.log('9️⃣ Recommendations:');
  if (!isHTTPS) {
    console.log('   ❌ Enable HTTPS (required for PWA)');
  }
  if (!isChrome && !isEdge) {
    console.log('   ⚠️ Use Chrome or Edge for best PWA support');
  }
  if (dismissed === 'true') {
    console.log('   ℹ️ Clear dismissal: localStorage.removeItem("pwa-install-dismissed")');
  }
  console.log('');

  console.log('🔍 ===== END DEBUG REPORT =====');
}

// Auto-run on import in development
if (process.env.NODE_ENV === 'development') {
  window.debugPWA = debugPWA;
  console.log('💡 Run debugPWA() in console to check PWA status');
}

export default debugPWA;
