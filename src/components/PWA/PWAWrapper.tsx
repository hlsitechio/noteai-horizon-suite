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
  showTitleBar = true,
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

    // Register service worker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js')
        .then((registration) => {
          console.log('Service Worker registered:', registration);
        })
        .catch((error) => {
          console.error('Service Worker registration failed:', error);
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