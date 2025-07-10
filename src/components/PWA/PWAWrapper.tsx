import React, { useEffect, useState } from 'react';
import { CustomTitleBar } from './CustomTitleBar';
import { PWAInstallPrompt } from './PWAInstallPrompt';
import { PWAUpdateNotification } from './PWAUpdateNotification';

interface PWAWrapperProps {
  children: React.ReactNode;
  showTitleBar?: boolean;
  className?: string;
}

export function PWAWrapper({ 
  children, 
  showTitleBar = false,
  className = ""
}: PWAWrapperProps) {
  const [isPWA, setIsPWA] = useState(false);
  const [isInstallable, setIsInstallable] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    // Check if running as PWA
    const checkPWAStatus = () => {
      const isStandalone = window.matchMedia('(display-mode: standalone)').matches ||
                           (window.navigator as any).standalone ||
                           document.referrer.includes('android-app://');
      setIsPWA(isStandalone);
    };

    checkPWAStatus();

    // Listen for install prompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
    };

    // Listen for app installed
    const handleAppInstalled = () => {
      setIsInstallable(false);
      setDeferredPrompt(null);
      console.log('PWA was installed');
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    // Register service worker with better error handling
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js')
        .then((registration) => {
          console.log('Service Worker registered:', registration);
          
          // Listen for service worker errors that might cause loops
          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing;
            if (newWorker) {
              newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                  // New service worker is available
                  console.log('New service worker available');
                }
              });
            }
          });
        })
        .catch((error) => {
          console.error('Service Worker registration failed:', error);
          // Clear any existing service worker if it's causing issues
          if (navigator.serviceWorker.controller) {
            navigator.serviceWorker.controller.postMessage({ type: 'SKIP_WAITING' });
          }
        });

      // Add message listener for service worker communications
      navigator.serviceWorker.addEventListener('message', (event) => {
        if (event.data?.type === 'SW_ERROR') {
          console.warn('Service Worker reported error:', event.data.error);
          // Could implement recovery logic here
        }
      });
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      console.log('User accepted the install prompt');
    } else {
      console.log('User dismissed the install prompt');
    }
    
    setDeferredPrompt(null);
    setIsInstallable(false);
  };

  return (
    <div className={`h-screen flex flex-col ${className}`}>
      {/* Custom Title Bar for PWA */}
      {showTitleBar && (
        <CustomTitleBar 
          showControls={isPWA}
          className="flex-shrink-0"
        />
      )}

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        {children}
      </div>

      {/* PWA Install Prompt */}
      {isInstallable && !isPWA && (
        <PWAInstallPrompt onInstall={handleInstallClick} />
      )}

      {/* PWA Update Notification */}
      <PWAUpdateNotification />
    </div>
  );
}