import React, { useState, useEffect } from 'react';
import './InstallPopup.css';

function InstallPopup() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    console.log('🔍 PWA: InstallPopup component mounted');
    
    // Check if app is already installed
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
    const isIOSStandalone = window.navigator.standalone === true;
    
    if (isStandalone || isIOSStandalone) {
      console.log('✅ PWA: App is already installed');
      setIsInstalled(true);
      return;
    }

    console.log('📱 PWA: App not installed, checking browser support...');

    // Check if running on iOS
    const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    setIsIOS(iOS);
    
    if (iOS) {
      console.log('📱 PWA: iOS detected, will show iOS instructions');
      // Show iOS popup after delay
      setTimeout(() => {
        setShowPopup(true);
      }, 2000);
    }

    // Check if user previously dismissed the popup
    const dismissed = localStorage.getItem('pwa-install-dismissed');
    const dismissedTime = localStorage.getItem('pwa-install-dismissed-time');
    
    if (dismissed === 'true' && dismissedTime) {
      const daysSinceDismissed = (Date.now() - parseInt(dismissedTime)) / (1000 * 60 * 60 * 24);
      
      console.log(`⏳ PWA: Popup was dismissed ${daysSinceDismissed.toFixed(1)} days ago`);
      
      // Show again after 7 days
      if (daysSinceDismissed < 7) {
        console.log('⏳ PWA: Install popup dismissed recently, not showing');
        return;
      } else {
        // Clear old dismissal
        console.log('🔄 PWA: Dismissal expired, clearing...');
        localStorage.removeItem('pwa-install-dismissed');
        localStorage.removeItem('pwa-install-dismissed-time');
      }
    }

    // Listen for beforeinstallprompt event
    const handleBeforeInstallPrompt = (e) => {
      console.log('📱 PWA: beforeinstallprompt event fired!');
      console.log('📱 PWA: Browser supports PWA installation');
      
      // Prevent the default browser install prompt
      e.preventDefault();
      
      // Store the event for later use
      setDeferredPrompt(e);
      
      // Show our custom popup after a short delay
      setTimeout(() => {
        console.log('✨ PWA: Showing install popup');
        setShowPopup(true);
      }, 2000); // 2 second delay for better UX
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Listen for app installed event
    const handleAppInstalled = () => {
      console.log('✅ PWA: App installed successfully!');
      setIsInstalled(true);
      setShowPopup(false);
      setDeferredPrompt(null);
    };

    window.addEventListener('appinstalled', handleAppInstalled);

    // Debug: Check if beforeinstallprompt will fire
    setTimeout(() => {
      if (!deferredPrompt && !iOS) {
        console.warn('⚠️ PWA: beforeinstallprompt not fired yet');
        console.warn('⚠️ PWA: Possible reasons:');
        console.warn('   1. App already installed');
        console.warn('   2. Not on HTTPS');
        console.warn('   3. Browser doesn\'t support PWA');
        console.warn('   4. Manifest.json has errors');
        console.warn('   5. Service worker not registered');
      }
    }, 5000);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  // Handle scroll to dismiss
  useEffect(() => {
    if (!showPopup) return;

    let scrollTimeout;
    const handleScroll = () => {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        console.log('📜 PWA: User scrolled, hiding popup');
        handleDismiss();
      }, 100);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(scrollTimeout);
    };
  }, [showPopup]);

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      console.warn('⚠️ PWA: No deferred prompt available');
      alert('Installation not available. Please try again later.');
      return;
    }

    console.log('📱 PWA: User clicked install button');

    try {
      // Show the browser's install prompt
      await deferredPrompt.prompt();
      console.log('📱 PWA: Install prompt shown');

      // Wait for the user's response
      const { outcome } = await deferredPrompt.userChoice;
      
      console.log(`📱 PWA: User ${outcome === 'accepted' ? 'accepted' : 'dismissed'} the install prompt`);

      if (outcome === 'accepted') {
        setShowPopup(false);
        setIsInstalled(true);
      }

      // Clear the deferred prompt
      setDeferredPrompt(null);
    } catch (error) {
      console.error('❌ PWA: Install failed:', error);
      alert('Installation failed. Please try again.');
    }
  };

  const handleDismiss = () => {
    console.log('❌ PWA: User dismissed install popup');
    setShowPopup(false);
    
    // Remember dismissal
    localStorage.setItem('pwa-install-dismissed', 'true');
    localStorage.setItem('pwa-install-dismissed-time', Date.now().toString());
    
    console.log('💾 PWA: Dismissal saved to localStorage');
  };

  // Don't show if already installed
  if (isInstalled) {
    console.log('✅ PWA: Not showing popup - app already installed');
    return null;
  }

  // iOS-specific instructions
  if (isIOS && showPopup) {
    console.log('📱 PWA: Rendering iOS install instructions');
    return (
      <div className="install-popup install-popup-ios">
        <button className="install-popup-close" onClick={handleDismiss}>
          ✕
        </button>
        <div className="install-popup-content">
          <div className="install-popup-icon">🎵</div>
          <div className="install-popup-text">
            <h3>Install Music App</h3>
            <p className="install-popup-ios-instructions">
              Tap <span className="ios-share-icon">⎙</span> then "Add to Home Screen"
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Standard PWA install popup
  if (showPopup && deferredPrompt) {
    console.log('📱 PWA: Rendering install popup');
    return (
      <div className="install-popup">
        <button className="install-popup-close" onClick={handleDismiss}>
          ✕
        </button>
        <div className="install-popup-content">
          <div className="install-popup-icon">🎵</div>
          <div className="install-popup-text">
            <h3>Install Music Streaming App</h3>
            <p>Get quick access and offline support</p>
          </div>
          <button className="install-popup-button" onClick={handleInstallClick}>
            <span className="install-popup-button-icon">⬇️</span>
            Install
          </button>
        </div>
      </div>
    );
  }

  console.log('📱 PWA: Not showing popup - waiting for beforeinstallprompt');
  return null;
}

export default InstallPopup;
