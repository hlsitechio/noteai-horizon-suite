import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Minus, 
  Square, 
  X, 
  Maximize2, 
  Minimize2,
  MoreHorizontal,
  Menu,
  Settings
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';

interface CustomTitleBarProps {
  title?: string;
  showControls?: boolean;
  onMinimize?: () => void;
  onMaximize?: () => void;
  onClose?: () => void;
  className?: string;
}

export function CustomTitleBar({
  title = "Online Note AI",
  showControls = true,
  onMinimize,
  onMaximize, 
  onClose,
  className = ""
}: CustomTitleBarProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMaximized, setIsMaximized] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isPWA, setIsPWA] = useState(false);

  useEffect(() => {
    // Check if running as PWA
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches ||
                         (window.navigator as any).standalone ||
                         document.referrer.includes('android-app://');
    setIsPWA(isStandalone);

    // Listen for window state changes
    const handleResize = () => {
      setIsMaximized(
        window.outerHeight === screen.height && 
        window.outerWidth === screen.width
      );
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Initial check

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleMinimize = () => {
    if (onMinimize) {
      onMinimize();
    } else if (isPWA) {
      // PWA minimize behavior
      window.blur();
    }
  };

  const handleMaximize = () => {
    if (onMaximize) {
      onMaximize();
    } else if (isPWA) {
      // PWA maximize/restore behavior
      if (isMaximized) {
        // Request restore (not directly supported in PWA, but we can simulate)
        setIsMaximized(false);
      } else {
        // Request fullscreen
        if (document.documentElement.requestFullscreen) {
          document.documentElement.requestFullscreen();
          setIsMaximized(true);
        }
      }
    }
  };

  const handleClose = () => {
    if (onClose) {
      onClose();
    } else if (isPWA) {
      // PWA close behavior - navigate to dashboard or show confirmation
      const confirmed = window.confirm('Close Online Note AI?');
      if (confirmed) {
        window.close();
      }
    }
  };

  const getPageTitle = () => {
    if (title !== "Online Note AI") return title;
    
    const path = location.pathname;
    if (path.includes('/dashboard')) return 'Dashboard';
    if (path.includes('/editor')) return 'Editor';
    if (path.includes('/notes')) return 'Notes';
    if (path.includes('/chat')) return 'AI Chat';
    if (path.includes('/analytics')) return 'Analytics';
    if (path.includes('/settings')) return 'Settings';
    return 'Online Note AI';
  };

  const getCurrentSection = () => {
    const path = location.pathname;
    if (path.includes('/dashboard')) return 'dashboard';
    if (path.includes('/editor')) return 'editor';
    if (path.includes('/notes')) return 'notes';
    if (path.includes('/chat')) return 'chat';
    if (path.includes('/analytics')) return 'analytics';
    if (path.includes('/settings')) return 'settings';
    return 'home';
  };

  return (
    <div 
      className={`
        flex items-center justify-between h-12 px-4
        bg-gradient-to-r from-background via-background/95 to-background
        border-b border-border/50 backdrop-blur-xl
        select-none relative z-50
        ${isDragging ? 'cursor-grabbing' : 'cursor-default'}
        ${className}
      `}
      style={{ 
        WebkitAppRegion: 'drag',
        userSelect: 'none'
      } as React.CSSProperties}
      onMouseDown={() => setIsDragging(true)}
      onMouseUp={() => setIsDragging(false)}
    >
      {/* Left section - App logo and navigation */}
      <div 
        className="flex items-center gap-3 flex-1 min-w-0"
        style={{ WebkitAppRegion: 'no-drag' } as React.CSSProperties}
      >
        {/* App Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 rounded-lg hover:bg-accent/50 transition-all duration-200"
            >
              <Menu className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-48">
            <DropdownMenuItem onClick={() => navigate('/app/dashboard')}>
              Dashboard
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate('/app/notes')}>
              Notes
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate('/app/chat')}>
              AI Chat
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => navigate('/app/analytics')}>
              Analytics
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate('/app/settings')}>
              Settings
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* App Title */}
        <div className="flex items-center gap-2 min-w-0">
          <h1 className="text-sm font-semibold text-foreground truncate">
            {getPageTitle()}
          </h1>
          {isPWA && (
            <Badge variant="secondary" className="text-xs h-5 px-2 bg-primary/10 text-primary">
              PWA
            </Badge>
          )}
        </div>

        {/* Breadcrumb/Status indicators */}
        <div className="hidden md:flex items-center gap-2 text-xs text-muted-foreground">
          <Separator orientation="vertical" className="h-4" />
          <span className="capitalize">{getCurrentSection()}</span>
        </div>
      </div>

      {/* Center section - Search or current document title */}
      <div 
        className="flex-1 flex justify-center min-w-0 px-4"
        style={{ WebkitAppRegion: 'drag' } as React.CSSProperties}
      >
        {/* This area can be customized per page */}
        <div className="text-xs text-muted-foreground/60 max-w-xs truncate">
          {/* Page-specific content can go here */}
        </div>
      </div>

      {/* Right section - Window controls */}
      <div 
        className="flex items-center gap-1"
        style={{ WebkitAppRegion: 'no-drag' } as React.CSSProperties}
      >
        {/* Settings shortcut */}
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0 rounded-lg hover:bg-accent/50 transition-all duration-200"
          onClick={() => navigate('/app/settings')}
        >
          <Settings className="w-3.5 h-3.5" />
        </Button>

        {/* Window controls */}
        {showControls && (
          <>
            <Separator orientation="vertical" className="h-4 mx-1" />
            
            {/* Minimize */}
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 rounded-lg hover:bg-accent/50 transition-all duration-200"
              onClick={handleMinimize}
              title="Minimize"
            >
              <Minus className="w-3.5 h-3.5" />
            </Button>

            {/* Maximize/Restore */}
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 rounded-lg hover:bg-accent/50 transition-all duration-200"
              onClick={handleMaximize}
              title={isMaximized ? "Restore" : "Maximize"}
            >
              {isMaximized ? (
                <Minimize2 className="w-3.5 h-3.5" />
              ) : (
                <Maximize2 className="w-3.5 h-3.5" />
              )}
            </Button>

            {/* Close */}
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 rounded-lg hover:bg-destructive/20 hover:text-destructive transition-all duration-200"
              onClick={handleClose}
              title="Close"
            >
              <X className="w-3.5 h-3.5" />
            </Button>
          </>
        )}
      </div>
    </div>
  );
}