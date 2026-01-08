import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './styles/index.css'
import { registerServiceWorker } from './utils/pwa.js'
import { debugPWA } from './utils/pwaDebug.js'
import './utils/cacheDebug.js'  // ✅ Import cache debugging utilities

// Register service worker for PWA
registerServiceWorker();

// Make debug function available globally
window.debugPWA = debugPWA;

// Auto-run debug in development
if (import.meta.env.DEV) {
  console.log('💡 Development mode: Available debug commands:');
  console.log('   - debugPWA() - Check PWA status');
  console.log('   - debugCache() - View cache contents');
  console.log('   - clearCache() - Clear all caches');
  console.log('   - checkSWStatus() - Check service worker');
  console.log('   - forceSWUpdate() - Force SW update');
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
