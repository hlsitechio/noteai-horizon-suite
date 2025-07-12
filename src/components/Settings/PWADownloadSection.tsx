import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Monitor, 
  Download, 
  Smartphone, 
  Check, 
  ExternalLink,
  Zap,
  Wifi,
  HardDrive,
  AlertCircle,
  Info,
  Globe,
  Settings
} from 'lucide-react';
import { 
  detectBrowser, 
  checkPWACapabilities, 
  getBrowserCompatibilityMessage, 
  isPWAInstalled, 
  getInstallationGuide 
} from '@/utils/browserDetection';

export function PWADownloadSection() {
  const [isPWA, setIsPWA] = useState(false);
  const [isInstallable, setIsInstallable] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  
  // Get browser and PWA information
  const browserInfo = detectBrowser();
  const pwaCapabilities = checkPWACapabilities();
  const compatibilityInfo = getBrowserCompatibilityMessage();
  const installGuide = getInstallationGuide();

  useEffect(() => {
    // Use the improved PWA detection
    setIsPWA(isPWAInstalled());

    // Listen for install prompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
    };

    // Listen for app installed
    const handleAppInstalled = () => {
      setIsInstallable(false);
      setIsPWA(true);
      // Development logging only
      if (import.meta.env.DEV) {
        console.log('PWA was installed');
      }
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    try {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      
      if (outcome === 'accepted') {
        // Development logging only
        if (import.meta.env.DEV) {
          console.log('User accepted the install prompt');
        }
      }
      
      setDeferredPrompt(null);
      setIsInstallable(false);
    } catch (error) {
      console.error('Error during installation:', error);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Monitor className="h-5 w-5" />
          Desktop App & PWA
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Browser Detection Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Globe className="h-4 w-4" />
            <h3 className="font-semibold text-sm">Browser Information</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Browser:</span>
                <span className="font-medium">{browserInfo.name} {browserInfo.version}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Platform:</span>
                <span className="font-medium">{browserInfo.platform}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Device:</span>
                <span className="font-medium">
                  {browserInfo.isMobile ? 'Mobile' : browserInfo.isTablet ? 'Tablet' : 'Desktop'}
                </span>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">PWA Support:</span>
                <Badge variant={compatibilityInfo.isCompatible ? "default" : "destructive"}>
                  {compatibilityInfo.isCompatible ? 'Supported' : 'Limited'}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Service Workers:</span>
                <Badge variant={browserInfo.supportsServiceWorker ? "default" : "destructive"}>
                  {browserInfo.supportsServiceWorker ? 'Supported' : 'Not Supported'}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Install Prompt:</span>
                <Badge variant={browserInfo.supportsInstallPrompt ? "default" : "secondary"}>
                  {browserInfo.supportsInstallPrompt ? 'Available' : 'Limited'}
                </Badge>
              </div>
            </div>
          </div>

          {!compatibilityInfo.isCompatible && (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <strong>{compatibilityInfo.message}</strong>
                {compatibilityInfo.suggestion && (
                  <div className="mt-1 text-sm">{compatibilityInfo.suggestion}</div>
                )}
              </AlertDescription>
            </Alert>
          )}
        </div>

        <Separator />

        {/* Status Section */}
        <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
          <div className="flex items-center gap-3">
            <div className={`w-3 h-3 rounded-full ${isPWA ? 'bg-green-500' : 'bg-orange-500'}`} />
            <div>
              <h3 className="font-medium">
                {isPWA ? 'Desktop App Active' : 'Browser Mode'}
              </h3>
              <p className="text-sm text-muted-foreground">
                {isPWA 
                  ? 'You are using the installed desktop app' 
                  : 'Install for the best desktop experience'
                }
              </p>
            </div>
          </div>
          {isPWA && (
            <Badge variant="default" className="bg-green-500/10 text-green-700">
              <Check className="w-3 h-3 mr-1" />
              Installed
            </Badge>
          )}
        </div>

        <Separator />

        {/* Installation Section */}
        <div className="space-y-4">
          <h3 className="font-semibold text-lg">Install Desktop App</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* PWA Benefits */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium">Faster Performance</span>
              </div>
              <div className="flex items-center gap-2">
                <Wifi className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium">Offline Access</span>
              </div>
              <div className="flex items-center gap-2">
                <HardDrive className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium">Native Experience</span>
              </div>
            </div>

            {/* Installation Options */}
            <div className="col-span-2 space-y-3">
              {isInstallable && !isPWA && compatibilityInfo.isCompatible && (
                <Button 
                  onClick={handleInstall}
                  className="w-full justify-start"
                  size="lg"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Install Desktop App (PWA)
                </Button>
              )}

              {isPWA && (
                <div className="p-3 rounded-lg bg-green-500/10 border border-green-200">
                  <div className="flex items-center gap-2 text-green-700">
                    <Check className="w-4 h-4" />
                    <span className="font-medium">Desktop app is installed!</span>
                  </div>
                </div>
              )}

              {!isInstallable && !isPWA && compatibilityInfo.isCompatible && (
                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertDescription>
                    <div className="space-y-2">
                      <p className="font-medium">Manual Installation Available</p>
                      <p className="text-sm">Click the install icon in your browser's address bar or check the browser menu for installation options.</p>
                    </div>
                  </AlertDescription>
                </Alert>
              )}

              {!compatibilityInfo.isCompatible && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    <div className="space-y-2">
                      <p className="font-medium">Limited PWA Support</p>
                      <p className="text-sm">{compatibilityInfo.message}</p>
                      {compatibilityInfo.suggestion && (
                        <p className="text-sm font-medium">{compatibilityInfo.suggestion}</p>
                      )}
                    </div>
                  </AlertDescription>
                </Alert>
              )}
            </div>
          </div>
        </div>

        <Separator />

        {/* Desktop App Connection Info */}
        <div className="space-y-4">
          <h3 className="font-semibold text-lg">Connect Windows Desktop App</h3>
          
          <div className="p-4 rounded-lg border bg-gradient-to-r from-primary/5 to-accent/5">
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">
                Our desktop APIs are ready for Windows desktop app integration:
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                <div className="flex items-center gap-2">
                  <Check className="w-3 h-3 text-green-600" />
                  <span>Real-time sync enabled</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-3 h-3 text-green-600" />
                  <span>Desktop API endpoints active</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-3 h-3 text-green-600" />
                  <span>Authentication bridge ready</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-3 h-3 text-green-600" />
                  <span>Data synchronization protocols</span>
                </div>
              </div>

              <div className="mt-4 p-3 rounded bg-muted/50">
                <p className="text-xs text-muted-foreground">
                  <strong>For Developers:</strong> API endpoint available at 
                  <code className="mx-1 px-1 bg-background rounded">/functions/desktop-app-api</code>
                  for Windows app connection.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Smart Installation Instructions */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            <h3 className="font-semibold">{installGuide.platform} Installation Guide</h3>
          </div>
          
          <div className="p-4 rounded-lg border bg-muted/20">
            <ol className="list-decimal list-inside space-y-2 text-sm">
              {installGuide.instructions.map((instruction, index) => (
                <li key={index} className="text-muted-foreground">
                  {instruction}
                </li>
              ))}
            </ol>
          </div>

          {browserInfo.name === 'Chrome' && (
            <div className="text-xs text-muted-foreground bg-blue-50 dark:bg-blue-950/20 p-3 rounded border border-blue-200 dark:border-blue-800">
              <strong>Chrome Users:</strong> Look for the install icon (⊞) in the address bar next to the bookmark star. 
              If you don't see it, try refreshing the page or clearing your browser cache.
            </div>
          )}
          
          {browserInfo.name === 'Safari' && browserInfo.isDesktop && (
            <div className="text-xs text-muted-foreground bg-orange-50 dark:bg-orange-950/20 p-3 rounded border border-orange-200 dark:border-orange-800">
              <strong>Safari Users:</strong> Desktop Safari has limited PWA support. For the best experience, 
              consider using Chrome, Edge, or Firefox which fully support Progressive Web Apps.
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}