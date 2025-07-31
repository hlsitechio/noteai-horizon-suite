import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Play, Pause, Square, RotateCcw, Timer, Clock } from 'lucide-react';

interface TimerWidgetProps {
  title?: string;
  mode?: 'timer' | 'stopwatch';
}

export const TimerWidget: React.FC<TimerWidgetProps> = ({
  title,
  mode = 'stopwatch'
}) => {
  const [time, setTime] = useState(0); // in seconds
  const [isRunning, setIsRunning] = useState(false);
  const [initialTime, setInitialTime] = useState(0);
  const [inputHours, setInputHours] = useState('0');
  const [inputMinutes, setInputMinutes] = useState('5');
  const [inputSeconds, setInputSeconds] = useState('0');
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const displayTitle = title || (mode === 'timer' ? 'Timer' : 'Stopwatch');

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setTime(prevTime => {
          if (mode === 'timer') {
            if (prevTime <= 1) {
              setIsRunning(false);
              return 0;
            }
            return prevTime - 1;
          } else {
            return prevTime + 1;
          }
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, mode]);

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hrs > 0) {
      return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStart = () => {
    if (mode === 'timer' && time === 0) {
      const totalSeconds = parseInt(inputHours) * 3600 + parseInt(inputMinutes) * 60 + parseInt(inputSeconds);
      setTime(totalSeconds);
      setInitialTime(totalSeconds);
    }
    setIsRunning(true);
  };

  const handlePause = () => {
    setIsRunning(false);
  };

  const handleStop = () => {
    setIsRunning(false);
    if (mode === 'timer') {
      setTime(initialTime);
    } else {
      setTime(0);
    }
  };

  const handleReset = () => {
    setIsRunning(false);
    setTime(0);
    setInitialTime(0);
  };

  const handleSetTimer = () => {
    const totalSeconds = parseInt(inputHours || '0') * 3600 + parseInt(inputMinutes || '0') * 60 + parseInt(inputSeconds || '0');
    setTime(totalSeconds);
    setInitialTime(totalSeconds);
    setIsRunning(false);
  };

  const getProgress = () => {
    if (mode === 'timer' && initialTime > 0) {
      return ((initialTime - time) / initialTime) * 100;
    }
    return 0;
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          {mode === 'timer' ? <Timer className="h-4 w-4" /> : <Clock className="h-4 w-4" />}
          {displayTitle}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Timer Display */}
        <div className="text-center">
          <div className="text-3xl font-mono font-bold mb-2">
            {formatTime(time)}
          </div>
          
          {mode === 'timer' && initialTime > 0 && (
            <div className="w-full bg-muted rounded-full h-2">
              <div 
                className="bg-primary h-2 rounded-full transition-all duration-1000 ease-linear"
                style={{ width: `${getProgress()}%` }}
              />
            </div>
          )}
        </div>

        {/* Timer Input (for timer mode) */}
        {mode === 'timer' && !isRunning && time === 0 && (
          <div className="space-y-2">
            <div className="flex gap-2 items-center justify-center">
              <div className="flex items-center gap-1">
                <Input
                  type="number"
                  min="0"
                  max="23"
                  value={inputHours}
                  onChange={(e) => setInputHours(e.target.value)}
                  className="w-16 text-center"
                  placeholder="HH"
                />
                <span className="text-sm text-muted-foreground">hr</span>
              </div>
              <div className="flex items-center gap-1">
                <Input
                  type="number"
                  min="0"
                  max="59"
                  value={inputMinutes}
                  onChange={(e) => setInputMinutes(e.target.value)}
                  className="w-16 text-center"
                  placeholder="MM"
                />
                <span className="text-sm text-muted-foreground">min</span>
              </div>
              <div className="flex items-center gap-1">
                <Input
                  type="number"
                  min="0"
                  max="59"
                  value={inputSeconds}
                  onChange={(e) => setInputSeconds(e.target.value)}
                  className="w-16 text-center"
                  placeholder="SS"
                />
                <span className="text-sm text-muted-foreground">sec</span>
              </div>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleSetTimer}
              className="w-full"
            >
              Set Timer
            </Button>
          </div>
        )}

        {/* Control Buttons */}
        <div className="flex gap-2 justify-center">
          {!isRunning ? (
            <Button 
              onClick={handleStart} 
              size="sm"
              disabled={mode === 'timer' && time === 0}
            >
              <Play className="h-4 w-4 mr-1" />
              Start
            </Button>
          ) : (
            <Button onClick={handlePause} variant="outline" size="sm">
              <Pause className="h-4 w-4 mr-1" />
              Pause
            </Button>
          )}
          
          <Button onClick={handleStop} variant="outline" size="sm">
            <Square className="h-4 w-4 mr-1" />
            Stop
          </Button>
          
          <Button onClick={handleReset} variant="outline" size="sm">
            <RotateCcw className="h-4 w-4 mr-1" />
            Reset
          </Button>
        </div>

        {/* Status */}
        <div className="text-center">
          <span className={`text-xs px-2 py-1 rounded-full ${
            isRunning 
              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
              : 'bg-muted text-muted-foreground'
          }`}>
            {isRunning ? 'Running' : 'Stopped'}
          </span>
        </div>
      </CardContent>
    </Card>
  );
};