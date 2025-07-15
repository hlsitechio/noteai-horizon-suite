import React from 'react';
import { Wifi, WifiOff, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ConnectionStatusProps {
  isConnected: boolean;
  isConnecting?: boolean;
  onRetry?: () => void;
  className?: string;
}

export const ConnectionStatus: React.FC<ConnectionStatusProps> = ({
  isConnected,
  isConnecting = false,
  onRetry,
  className
}) => {
  if (isConnected) {
    return (
      <div className={cn("flex items-center gap-2 text-green-600", className)}>
        <Wifi className="w-4 h-4" />
        <span className="text-sm">Connected</span>
      </div>
    );
  }

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className="flex items-center gap-2 text-orange-600">
        {isConnecting ? (
          <RefreshCw className="w-4 h-4 animate-spin" />
        ) : (
          <WifiOff className="w-4 h-4" />
        )}
        <span className="text-sm">
          {isConnecting ? 'Connecting...' : 'Offline'}
        </span>
      </div>
      {!isConnecting && onRetry && (
        <Button
          variant="outline"
          size="sm"
          onClick={onRetry}
          className="h-6 px-2 text-xs"
        >
          Retry
        </Button>
      )}
    </div>
  );
};