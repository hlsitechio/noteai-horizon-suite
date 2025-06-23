
import { useState, useEffect, useRef } from 'react';

export const useFocusModeControls = (isZenMode: boolean) => {
  const [isControlsVisible, setIsControlsVisible] = useState(true);
  const hideControlsTimeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (isZenMode) {
      const hideControls = () => {
        setIsControlsVisible(false);
      };

      const showControls = () => {
        setIsControlsVisible(true);
        if (hideControlsTimeoutRef.current) {
          clearTimeout(hideControlsTimeoutRef.current);
        }
        hideControlsTimeoutRef.current = setTimeout(hideControls, 3000);
      };

      const handleMouseMove = () => {
        showControls();
      };

      document.addEventListener('mousemove', handleMouseMove);
      hideControlsTimeoutRef.current = setTimeout(hideControls, 3000);

      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        if (hideControlsTimeoutRef.current) {
          clearTimeout(hideControlsTimeoutRef.current);
        }
      };
    } else {
      setIsControlsVisible(true);
    }
  }, [isZenMode]);

  return { isControlsVisible, setIsControlsVisible };
};
