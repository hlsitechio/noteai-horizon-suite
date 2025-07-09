import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Settings, Palette } from 'lucide-react';

interface ComponentLibraryButtonProps {
  componentName?: string;
  variant?: 'icon' | 'text' | 'minimal';
  size?: 'sm' | 'default';
  className?: string;
}

export const ComponentLibraryButton: React.FC<ComponentLibraryButtonProps> = ({
  componentName = 'component',
  variant = 'icon',
  size = 'sm',
  className = ''
}) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/app/components');
  };

  const buttonContent = () => {
    switch (variant) {
      case 'text':
        return (
          <>
            <Palette className="h-3 w-3 mr-1" />
            <span className="text-xs">Library</span>
          </>
        );
      case 'minimal':
        return (
          <>
            <Settings className="h-3 w-3 mr-1" />
            <span className="text-xs">Change</span>
          </>
        );
      default:
        return <Palette className="h-3 w-3" />;
    }
  };

  const tooltipText = `Browse component library to replace this ${componentName}`;

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size={size}
            onClick={handleClick}
            className={`opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-accent/50 ${className}`}
            aria-label={tooltipText}
          >
            {buttonContent()}
          </Button>
        </TooltipTrigger>
        <TooltipContent side="top" className="text-xs">
          {tooltipText}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};