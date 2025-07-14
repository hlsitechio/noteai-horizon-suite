
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, Pause, Square, Plus, Minus } from 'lucide-react';

interface ChronoDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  onStartTimer: (minutes: number, seconds: number) => void;
  className?: string;
}

export const ChronoDropdown: React.FC<ChronoDropdownProps> = ({
  isOpen,
  onClose,
  onStartTimer,
  className = ''
}) => {
  const [minutes, setMinutes] = useState(5);
  const [seconds, setSeconds] = useState(0);

  const handleStart = () => {
    onStartTimer(minutes, seconds);
    onClose();
  };

  const adjustMinutes = (delta: number) => {
    setMinutes(Math.max(0, Math.min(59, minutes + delta)));
  };

  const adjustSeconds = (delta: number) => {
    setSeconds(Math.max(0, Math.min(59, seconds + delta)));
  };

  if (!isOpen) return null;

  return (
    <Card className={`absolute top-full left-0 mt-2 w-72 shadow-lg border z-50 bg-background ${className}`}>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold">Set Timer</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Time Selector */}
        <div className="flex items-center justify-center gap-4">
          {/* Minutes */}
          <div className="flex flex-col items-center">
            <Button
              variant="outline"
              size="sm"
              onClick={() => adjustMinutes(1)}
              className="h-8 w-8 p-0"
            >
              <Plus className="h-3 w-3" />
            </Button>
            <div className="text-2xl font-mono font-bold my-2 min-w-[3ch] text-center">
              {minutes.toString().padStart(2, '0')}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => adjustMinutes(-1)}
              className="h-8 w-8 p-0"
            >
              <Minus className="h-3 w-3" />
            </Button>
            <span className="text-xs text-muted-foreground mt-1">min</span>
          </div>

          <div className="text-2xl font-bold">:</div>

          {/* Seconds */}
          <div className="flex flex-col items-center">
            <Button
              variant="outline"
              size="sm"
              onClick={() => adjustSeconds(1)}
              className="h-8 w-8 p-0"
            >
              <Plus className="h-3 w-3" />
            </Button>
            <div className="text-2xl font-mono font-bold my-2 min-w-[3ch] text-center">
              {seconds.toString().padStart(2, '0')}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => adjustSeconds(-1)}
              className="h-8 w-8 p-0"
            >
              <Minus className="h-3 w-3" />
            </Button>
            <span className="text-xs text-muted-foreground mt-1">sec</span>
          </div>
        </div>

        {/* Quick Presets */}
        <div className="flex gap-2 justify-center">
          {[
            { label: '1m', min: 1, sec: 0 },
            { label: '5m', min: 5, sec: 0 },
            { label: '10m', min: 10, sec: 0 },
            { label: '15m', min: 15, sec: 0 }
          ].map((preset) => (
            <Button
              key={preset.label}
              variant="outline"
              size="sm"
              onClick={() => {
                setMinutes(preset.min);
                setSeconds(preset.sec);
              }}
              className="text-xs"
            >
              {preset.label}
            </Button>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Button variant="outline" onClick={onClose} className="flex-1">
            Cancel
          </Button>
          <Button 
            onClick={handleStart} 
            className="flex-1"
            disabled={minutes === 0 && seconds === 0}
          >
            <Play className="h-4 w-4 mr-2" />
            Start
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
