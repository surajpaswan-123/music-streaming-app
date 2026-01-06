import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './styles/index.css'
import { registerServiceWorker } from './utils/pwa.js'
import { debugPWA } from './utils/pwaDebug.js'

// Register service worker for PWA
registerServiceWorker();

// Make debug function available globally
window.debugPWA = debugPWA;

// Auto-run debug in development
if (import.meta.env.DEV) {
  console.log('💡 Development mode: Run debugPWA() to check PWA status');
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
