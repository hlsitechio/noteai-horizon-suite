import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { X, Eye, EyeOff } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatusBarProps {
  message?: string;
  className?: string;
  scrollSpeed?: number; // 1-10 scale
}

const StatusBar: React.FC<StatusBarProps> = ({ 
  message,
  className,
  scrollSpeed = 5
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const [animationKey, setAnimationKey] = useState(0);
  
  // Convert scroll speed (1-10) to animation duration (faster = shorter duration)
  const animationDuration = 11 - scrollSpeed; // 10s at speed 1, 1s at speed 10

  // Reset animation when message changes
  useEffect(() => {
    setAnimationKey(prev => prev + 1);
  }, [message]);

  if (!isVisible) {
    return (
      <div className="flex items-center justify-end px-4 py-1 bg-primary/10 border-b border-border">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsVisible(true)}
          className="h-6 px-2 text-xs"
        >
          <Eye className="w-3 h-3 mr-1" />
          Show Status
        </Button>
      </div>
    );
  }

  return (
    <div className={cn(
      "relative bg-gradient-to-r from-primary/20 to-primary/10 border-b border-primary/20 overflow-hidden",
      className
    )}>
      <div className="flex items-center justify-between min-h-[40px] pr-4">
        {/* Scrolling text container */}
        <div className="flex-1 overflow-hidden relative">
          <div 
            key={animationKey}
            className="whitespace-nowrap text-sm font-medium text-foreground/90 py-2"
            style={{
              animation: `scroll-left ${animationDuration}s linear infinite`
            }}
          >
            {message}
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-1 flex-shrink-0">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsVisible(false)}
            className="h-6 w-6 p-0 hover:bg-primary/20"
          >
            <X className="w-3 h-3" />
          </Button>
        </div>
      </div>

      <style>{`
        @keyframes scroll-left {
          0% {
            transform: translateX(100%);
          }
          100% {
            transform: translateX(-100%);
          }
        }
      `}</style>
    </div>
  );
};

export default StatusBar;