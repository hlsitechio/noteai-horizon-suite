
import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface MobileLayoutProps {
  title: string;
  onBack?: () => void;
  rightActions?: React.ReactNode;
  children: React.ReactNode;
  showBackButton?: boolean;
  className?: string;
}

const MobileLayout: React.FC<MobileLayoutProps> = ({
  title,
  onBack,
  rightActions,
  children,
  showBackButton = true,
  className = '',
}) => {
  return (
    <div className={`h-full flex flex-col bg-background ${className}`}>
      {/* Header */}
      <div className="sticky top-0 bg-background/95 backdrop-blur-md border-b border-border px-4 py-3 flex items-center justify-between z-10">
        <div className="flex items-center space-x-3">
          {showBackButton && onBack && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-8 w-8 p-0"
              onClick={onBack}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
          )}
          <h1 className="text-lg font-semibold text-foreground truncate">
            {title}
          </h1>
        </div>
        
        {rightActions && (
          <div className="flex items-center space-x-2">
            {rightActions}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-h-0 overflow-hidden">
        {children}
      </div>
    </div>
  );
};

export default MobileLayout;
