import React, { useState, useEffect, useRef } from 'react';
import './InstallPopup.css';

/**
 * PWA Install Popup Component
 * 
 * Features:
 * - Shows ONLY if app is not installed
 * - Handles beforeinstallprompt event
 * - Dismissible by: close button, swipe right, scroll
 * - Respects dismissal (won't show again in session)
 * - iOS-specific instructions
 * - No update popups (only install)
 */
function InstallPopup() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  
  const popupRef = useRef(null);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  useEffect(() => {
    // Check if app is already installed
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
    const isIOSStandalone = window.navigator.standalone === true;
    
    if (isStandalone || isIOSStandalone) {
      setIsInstalled(true);
      return;
    }

    // Detect iOS
    const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    setIsIOS(iOS);

    // Check session dismissal
    const sessionDismissed = sessionStorage.getItem('pwa-install-dismissed');
    if (sessionDismissed === 'true') {
      setIsDismissed(true);
      return;
    }

    // Check localStorage dismissal (7 days)
    const dismissed = localStorage.getItem('pwa-install-dismissed');
    const dismissedTime = localStorage.getItem('pwa-install-dismissed-time');
    
    if (dismissed === 'true' && dismissedTime) {
      const daysSinceDismissed = (Date.now() - parseInt(dismissedTime)) / (1000 * 60 * 60 * 24);
      
      if (daysSinceDismissed < 7) {
        setIsDismissed(true);
        return;
      } else {
        // Clear old dismissal
        localStorage.removeItem('pwa-install-dismissed');
        localStorage.removeItem('pwa-install-dismissed-time');
      }
    }

    // For iOS, show popup after delay
    if (iOS) {
      setTimeout(() => {
        setShowPopup(true);
      }, 3000);
    }

    // Listen for beforeinstallprompt event (Android/Chrome)
    const handleBeforeInstallPrompt = (e) => {
      // Prevent the default browser install prompt
      e.preventDefault();
      
      // Store the event for later use
      setDeferredPrompt(e);
      
      // Show our custom popup after delay
      setTimeout(() => {
        setShowPopup(true);
      }, 3000);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Listen for app installed event
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setShowPopup(false);
      setDeferredPrompt(null);
    };

    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  // Handle scroll to dismiss
  useEffect(() => {
    if (!showPopup || isDismissed) return;

    let scrollTimeout;
    let lastScrollY = window.scrollY;
    
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Only dismiss if user scrolled down significantly (50px)
      if (Math.abs(currentScrollY - lastScrollY) > 50) {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
          handleDismiss(true); // Session only
        }, 200);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(scrollTimeout);
    };
  }, [showPopup, isDismissed]);

  // Handle swipe right to dismiss
  useEffect(() => {
    if (!showPopup || !popupRef.current || isDismissed) return;

    const popup = popupRef.current;

    const handleTouchStart = (e) => {
      touchStartX.current = e.touches[0].clientX;
    };

    const handleTouchMove = (e) => {
      touchEndX.current = e.touches[0].clientX;
    };

    const handleTouchEnd = () => {
      const swipeDistance = touchEndX.current - touchStartX.current;
      
      // Swipe right (at least 100px)
      if (swipeDistance > 100) {
        handleDismiss(true); // Session only
      }
    };

    popup.addEventListener('touchstart', handleTouchStart, { passive: true });
    popup.addEventListener('touchmove', handleTouchMove, { passive: true });
    popup.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      popup.removeEventListener('touchstart', handleTouchStart);
      popup.removeEventListener('touchmove', handleTouchMove);
      popup.removeEventListener('touchend', handleTouchEnd);
    };
  }, [showPopup, isDismissed]);

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      return;
    }

    try {
      // Show the browser's install prompt
      await deferredPrompt.prompt();

      // Wait for the user's response
      const { outcome } = await deferredPrompt.userChoice;

      if (outcome === 'accepted') {
        setShowPopup(false);
        setIsInstalled(true);
      }

      // Clear the deferred prompt
      setDeferredPrompt(null);
    } catch (error) {
      console.error('Install failed:', error);
    }
  };

  const handleDismiss = (sessionOnly = false) => {
    setShowPopup(false);
    setIsDismissed(true);
    
    // Always save to session
    sessionStorage.setItem('pwa-install-dismissed', 'true');
    
    // Save to localStorage only if close button clicked
    if (!sessionOnly) {
      localStorage.setItem('pwa-install-dismissed', 'true');
      localStorage.setItem('pwa-install-dismissed-time', Date.now().toString());
    }
  };

  // Don't show if already installed or dismissed
  if (isInstalled || isDismissed || !showPopup) {
    return null;
  }

  // iOS-specific instructions
  if (isIOS) {
    return (
      <div ref={popupRef} className="install-popup install-popup-ios">
        <button 
          className="install-popup-close" 
          onClick={() => handleDismiss(false)}
          aria-label="Close"
        >
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
        <div className="install-popup-hint">Swipe right or scroll to dismiss</div>
      </div>
    );
  }

  // Standard PWA install popup (Android/Chrome)
  if (deferredPrompt) {
    return (
      <div ref={popupRef} className="install-popup">
        <button 
          className="install-popup-close" 
          onClick={() => handleDismiss(false)}
          aria-label="Close"
        >
          ✕
        </button>
        <div className="install-popup-content">
          <div className="install-popup-icon">🎵</div>
          <div className="install-popup-text">
            <h3>Install Music Streaming App</h3>
            <p>Get quick access and offline support</p>
          </div>
          <button 
            className="install-popup-button" 
            onClick={handleInstallClick}
          >
            <span className="install-popup-button-icon">⬇️</span>
            Install
          </button>
        </div>
        <div className="install-popup-hint">Swipe right or scroll to dismiss</div>
      </div>
    );
  }

  return null;
}

export default InstallPopup;
