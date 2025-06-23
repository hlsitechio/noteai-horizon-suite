
import { useState, useEffect, useRef } from 'react';

export const useFocusModeTimer = (isOpen: boolean) => {
  const [timeSpent, setTimeSpent] = useState(0);
  const timeStartRef = useRef<number>(Date.now());
  const timeIntervalRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (isOpen) {
      timeStartRef.current = Date.now();
      timeIntervalRef.current = setInterval(() => {
        setTimeSpent(Math.floor((Date.now() - timeStartRef.current) / 1000));
      }, 1000);
    }

    return () => {
      if (timeIntervalRef.current) {
        clearInterval(timeIntervalRef.current);
      }
    };
  }, [isOpen]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return { timeSpent, formatTime };
};
