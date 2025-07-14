
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Play, Pause, Square, Timer } from 'lucide-react';

interface ChronoDisplayProps {
  initialMinutes: number;
  initialSeconds: number;
  onComplete: () => void;
  onStop: () => void;
  className?: string;
}

export const ChronoDisplay: React.FC<ChronoDisplayProps> = ({
  initialMinutes,
  initialSeconds,
  onComplete,
  onStop,
  className = ''
}) => {
  const [totalSeconds, setTotalSeconds] = useState(initialMinutes * 60 + initialSeconds);
  const [isRunning, setIsRunning] = useState(true);
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    if (!isRunning || isCompleted) return;

    const interval = setInterval(() => {
      setTotalSeconds(prev => {
        if (prev <= 1) {
          setIsCompleted(true);
          setIsRunning(false);
          onComplete();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning, isCompleted, onComplete]);

  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  const togglePause = () => {
    setIsRunning(!isRunning);
  };

  const handleStop = () => {
    setIsRunning(false);
    setIsCompleted(true);
    onStop();
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Timer className="h-4 w-4 text-accent" />
      <div className={`font-mono text-sm font-semibold ${
        isCompleted ? 'text-destructive' : 
        totalSeconds <= 10 ? 'text-orange-500' : 
        'text-foreground'
      }`}>
        {minutes.toString().padStart(2, '0')}:{seconds.toString().padStart(2, '0')}
      </div>
      <div className="flex gap-1">
        <Button
          variant="ghost"
          size="sm"
          onClick={togglePause}
          className="h-6 w-6 p-0"
        >
          {isRunning ? <Pause className="h-3 w-3" /> : <Play className="h-3 w-3" />}
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleStop}
          className="h-6 w-6 p-0"
        >
          <Square className="h-3 w-3" />
        </Button>
      </div>
    </div>
  );
};
