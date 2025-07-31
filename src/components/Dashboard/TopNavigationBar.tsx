import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Clock } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useIsMobile } from '@/hooks/use-mobile';
import { ChronoDropdown } from './ChronoDropdown';
import { ChronoDisplay } from './ChronoDisplay';
import { toast } from 'sonner';

interface TopNavigationBarProps {}

const TopNavigationBarComponent: React.FC<TopNavigationBarProps> = () => {
  const { user } = useAuth();
  const isMobile = useIsMobile();
  const [currentTime, setCurrentTime] = useState(new Date());

  // Chronometer states
  const [showChronoDropdown, setShowChronoDropdown] = useState(false);
  const [activeTimer, setActiveTimer] = useState<{minutes: number, seconds: number} | null>(null);

  // Update clock every second using optimized scheduling with robust error handling
  useEffect(() => {
    let timeoutId: number | null = null;
    let isComponentMounted = true;

    const initializeScheduler = async () => {
      try {
        const { scheduleIdleCallback, cancelIdleCallback } = await import('@/utils/scheduler');
        
        if (!isComponentMounted) return;

        const updateClock = () => {
          if (!isComponentMounted) return;
          
          try {
            setCurrentTime(new Date());
            if (isComponentMounted) {
              timeoutId = scheduleIdleCallback(updateClock, 1000);
            }
          } catch (error) {
            console.warn('Clock update failed, retrying...', error);
            if (isComponentMounted) {
              timeoutId = scheduleIdleCallback(updateClock, 5000); // Retry with longer delay
            }
          }
        };
        
        timeoutId = scheduleIdleCallback(updateClock, 1000);
      } catch (error) {
        console.warn('Scheduler initialization failed, using fallback', error);
        // Fallback to regular setTimeout if scheduler fails
        const fallbackUpdate = () => {
          if (!isComponentMounted) return;
          setCurrentTime(new Date());
          timeoutId = window.setTimeout(fallbackUpdate, 1000);
        };
        timeoutId = window.setTimeout(fallbackUpdate, 1000);
      }
    };

    initializeScheduler();
    
    return () => {
      isComponentMounted = false;
      if (timeoutId !== null) {
        // Try both cleanup methods for robustness
        try {
          import('@/utils/scheduler').then(({ cancelIdleCallback }) => {
            cancelIdleCallback(timeoutId);
          }).catch(() => {
            // Fallback to clearTimeout
            clearTimeout(timeoutId);
          });
        } catch {
          clearTimeout(timeoutId);
        }
      }
    };
  }, []);


  // Chronometer handlers
  const handleStartTimer = (minutes: number, seconds: number) => {
    setActiveTimer({ minutes, seconds });
    toast.success(`Timer started for ${minutes}:${seconds.toString().padStart(2, '0')}`);
  };

  const handleTimerComplete = () => {
    toast.success('Timer completed!', {
      duration: 5000,
    });
  };

  const handleStopTimer = () => {
    setActiveTimer(null);
    toast.info('Timer stopped');
  };

  const handleClockClick = () => {
    if (!activeTimer) {
      if (import.meta.env.DEV) {
        console.log('Clock clicked, toggling dropdown:', !showChronoDropdown);
      }
      setShowChronoDropdown(!showChronoDropdown);
    } else {
      if (import.meta.env.DEV) {
        console.log('Clock clicked but timer is active');
      }
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const firstName = user?.name?.split(' ')[0] || 'User';
  const welcomeMessage = user?.welcome_message || 'Welcome back';

  return (
    <Card className="w-full border-0 shadow-none bg-background/80 backdrop-blur-sm">
      <div className={`p-3 ${isMobile ? 'space-y-2' : 'grid grid-cols-2 items-center'}`}>
        {/* Welcome Message */}
        <div className={`flex items-center gap-2 ${isMobile ? 'justify-center' : 'justify-self-start'}`}>
          <span className={`font-medium text-foreground ${isMobile ? 'text-sm' : 'text-base'}`}>
            {welcomeMessage}, {firstName}!
          </span>
        </div>

        {/* Time and Date with Chronometer - Always on the right */}
        <div className={`flex items-center gap-4 ${isMobile ? 'justify-center text-sm' : 'justify-self-end'} relative`}>
          <div className="flex items-center gap-2 relative">
            <button 
              onClick={handleClockClick}
              className="p-1 rounded hover:bg-muted transition-colors cursor-pointer"
              type="button"
            >
              <Clock className={`${isMobile ? 'h-3 w-3' : 'h-4 w-4'} text-muted-foreground hover:text-foreground`} />
            </button>
            <div className="text-center">
              <div className={`font-mono font-semibold text-foreground ${isMobile ? 'text-sm' : 'text-lg'}`}>
                {formatTime(currentTime)}
              </div>
              <div className={`text-muted-foreground ${isMobile ? 'text-xs' : 'text-sm'}`}>
                {formatDate(currentTime)}
              </div>
            </div>
            
            {/* Chronometer Dropdown */}
            <ChronoDropdown
              isOpen={showChronoDropdown}
              onClose={() => setShowChronoDropdown(false)}
              onStartTimer={handleStartTimer}
            />
          </div>

          {/* Active Timer Display */}
          {activeTimer && (
            <ChronoDisplay
              initialMinutes={activeTimer.minutes}
              initialSeconds={activeTimer.seconds}
              onComplete={handleTimerComplete}
              onStop={handleStopTimer}
              className={isMobile ? 'text-xs' : ''}
            />
          )}
        </div>
      </div>
    </Card>
  );
};

export const TopNavigationBar = React.memo(TopNavigationBarComponent);
