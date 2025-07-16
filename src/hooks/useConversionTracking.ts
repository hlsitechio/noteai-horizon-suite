import { useEffect, useState } from 'react';
import { safeSendAnalyticsEvent } from '@/utils/safeAnalytics';

interface UseExitIntentOptions {
  onExitIntent: () => void;
  enabled?: boolean;
  sensitivity?: number;
}

export const useExitIntent = ({ 
  onExitIntent, 
  enabled = true, 
  sensitivity = 10 
}: UseExitIntentOptions) => {
  const [hasTriggered, setHasTriggered] = useState(false);

  useEffect(() => {
    if (!enabled || hasTriggered) return;

    const handleMouseLeave = (e: MouseEvent) => {
      // Check if mouse is moving towards the top of the viewport
      if (e.clientY <= sensitivity && e.movementY < 0) {
        setHasTriggered(true);
        safeSendAnalyticsEvent('exit_intent_triggered');
        onExitIntent();
      }
    };

    document.addEventListener('mouseleave', handleMouseLeave);
    
    return () => {
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [enabled, hasTriggered, onExitIntent, sensitivity]);

  return { hasTriggered, reset: () => setHasTriggered(false) };
};

interface UseScrollDepthOptions {
  onScrollDepth: (depth: number) => void;
  thresholds?: number[];
}

export const useScrollDepth = ({ 
  onScrollDepth, 
  thresholds = [25, 50, 75, 90] 
}: UseScrollDepthOptions) => {
  const [triggeredDepths, setTriggeredDepths] = useState<Set<number>>(new Set());

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = (scrollTop / docHeight) * 100;

      thresholds.forEach(threshold => {
        if (scrollPercent >= threshold && !triggeredDepths.has(threshold)) {
          setTriggeredDepths(prev => new Set([...prev, threshold]));
          safeSendAnalyticsEvent('scroll_depth_reached', { depth: threshold });
          onScrollDepth(threshold);
        }
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [onScrollDepth, thresholds, triggeredDepths]);

  return { triggeredDepths };
};

interface UseTimeOnPageOptions {
  onTimeThreshold: (seconds: number) => void;
  thresholds?: number[];
}

export const useTimeOnPage = ({ 
  onTimeThreshold, 
  thresholds = [30, 60, 120, 300] 
}: UseTimeOnPageOptions) => {
  const [triggeredTimes, setTriggeredTimes] = useState<Set<number>>(new Set());
  const [startTime] = useState(Date.now());

  useEffect(() => {
    const interval = setInterval(() => {
      const currentTime = Date.now();
      const secondsOnPage = Math.floor((currentTime - startTime) / 1000);

      thresholds.forEach(threshold => {
        if (secondsOnPage >= threshold && !triggeredTimes.has(threshold)) {
          setTriggeredTimes(prev => new Set([...prev, threshold]));
          safeSendAnalyticsEvent('time_on_page_threshold', { seconds: threshold });
          onTimeThreshold(threshold);
        }
      });
    }, 5000); // Changed from 1000ms to 5000ms to reduce frequency

    return () => clearInterval(interval);
  }, [onTimeThreshold, thresholds, triggeredTimes, startTime]);

  return { triggeredTimes };
};