import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Download, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface PWAInstallPromptProps {
  onInstall: () => void;
}

export function PWAInstallPrompt({ onInstall }: PWAInstallPromptProps) {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 100 }}
        className="fixed bottom-4 right-4 z-50"
      >
        <Card className="w-80 shadow-lg border-primary/20 bg-background/95 backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Download className="w-5 h-5 text-primary" />
              </div>
              
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-sm mb-1">
                  Install Online Note AI
                </h3>
                <p className="text-xs text-muted-foreground mb-3">
                  Get the full desktop experience with offline access and native performance.
                </p>
                
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={onInstall}
                    className="h-8 px-3 text-xs"
                  >
                    Install App
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsVisible(false)}
                    className="h-8 px-3 text-xs"
                  >
                    Later
                  </Button>
                </div>
              </div>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsVisible(false)}
                className="h-6 w-6 p-0 flex-shrink-0"
              >
                <X className="w-3 h-3" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </AnimatePresence>
  );
}