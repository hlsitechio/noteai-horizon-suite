import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Monitor, 
  Download, 
  Smartphone, 
  Check, 
  ExternalLink,
  Zap,
  Wifi,
  HardDrive
} from 'lucide-react';

export function PWADownloadSection() {
  const [isPWA, setIsPWA] = useState(false);
  const [isInstallable, setIsInstallable] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    // Check if running as PWA
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches ||
                         (window.navigator as any).standalone ||
                         document.referrer.includes('android-app://');
    setIsPWA(isStandalone);

    // Listen for install prompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      console.log('User accepted the install prompt');
    }
    
    setDeferredPrompt(null);
    setIsInstallable(false);
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
              {isInstallable && !isPWA && (
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

              {!isInstallable && !isPWA && (
                <div className="p-3 rounded-lg bg-muted border">
                  <p className="text-sm text-muted-foreground">
                    Installation not available in this browser. Try Chrome, Edge, or Firefox.
                  </p>
                </div>
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

        {/* Manual Installation Instructions */}
        <div className="space-y-4">
          <h3 className="font-semibold">Manual Installation</h3>
          
          <div className="space-y-3 text-sm">
            <div>
              <h4 className="font-medium mb-2">Chrome/Edge:</h4>
              <ol className="list-decimal list-inside space-y-1 text-muted-foreground ml-4">
                <li>Click the install icon in the address bar</li>
                <li>Or go to Settings → Apps → Install this site as an app</li>
              </ol>
            </div>
            
            <div>
              <h4 className="font-medium mb-2">Firefox:</h4>
              <ol className="list-decimal list-inside space-y-1 text-muted-foreground ml-4">
                <li>Click the three dots menu</li>
                <li>Select "Install" or "Add to Home Screen"</li>
              </ol>
            </div>
            
            <div>
              <h4 className="font-medium mb-2">Mobile:</h4>
              <ol className="list-decimal list-inside space-y-1 text-muted-foreground ml-4">
                <li>Tap the share button</li>
                <li>Select "Add to Home Screen"</li>
              </ol>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}