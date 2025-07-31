
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import FocusModeBackground from './FocusModeBackground';
import FocusModeControls from './FocusModeControls';
import FocusModeStats from './FocusModeStats';
import FocusModeKeyboardShortcuts from './FocusModeKeyboardShortcuts';
import FocusModeEditor from './FocusMode/FocusModeEditor';
import { useFocusModeTimer } from './hooks/useFocusModeTimer';
import { useFocusModeStats } from './hooks/useFocusModeStats';
import { useFocusModeControls } from './hooks/useFocusModeControls';

interface FocusModeProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  content: string;
  onTitleChange: (title: string) => void;
  onContentChange: (content: string) => void;
  onSave: () => void;
  isSaving: boolean;
  isDistractionFree?: boolean;
  isMobile?: boolean;
}

const FocusMode: React.FC<FocusModeProps> = ({
  isOpen,
  onClose,
  title,
  content,
  onTitleChange,
  onContentChange,
  onSave,
  isSaving,
  isDistractionFree = false,
  isMobile = false,
}) => {
  const [backgroundOpacity, setBackgroundOpacity] = useState([85]);
  const [showStats, setShowStats] = useState(false);
  const [isZenMode, setIsZenMode] = useState(isMobile); // Default to zen mode on mobile
  const [touchStartY, setTouchStartY] = useState(0);
  const [showMobileHint, setShowMobileHint] = useState(isMobile);

  const { timeSpent, formatTime } = useFocusModeTimer(isOpen);
  const { wordCount, characterCount, wpm } = useFocusModeStats(content, timeSpent);
  const { isControlsVisible, setIsControlsVisible } = useFocusModeControls(isZenMode);

  // Hide controls completely when in distraction-free mode or mobile
  const shouldShowControls = !isDistractionFree && !isMobile && isControlsVisible;

  // Mobile-specific: Hide hint after a few seconds
  useEffect(() => {
    if (isMobile && showMobileHint) {
      const timer = setTimeout(() => {
        setShowMobileHint(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isMobile, showMobileHint]);

  // Mobile gesture handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    if (isMobile) {
      setTouchStartY(e.touches[0].clientY);
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (isMobile) {
      const touchEndY = e.changedTouches[0].clientY;
      const deltaY = touchStartY - touchEndY;
      
      // Swipe up to close (minimum 100px swipe)
      if (deltaY > 100) {
        onClose();
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    }
    if (e.ctrlKey && e.key === 's') {
      e.preventDefault();
      onSave();
    }
    if (e.ctrlKey && e.key === 'h' && !isMobile) {
      e.preventDefault();
      setIsControlsVisible(!isControlsVisible);
    }
  };

  // Check if background should be completely hidden
  const isBackgroundHidden = backgroundOpacity[0] >= 100 || isMobile;

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
        className={`fixed inset-0 z-50 flex items-center justify-center ${
          isBackgroundHidden ? 'bg-black' : ''
        } ${isMobile ? 'p-0' : 'p-6'}`}
        onKeyDown={handleKeyDown}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        tabIndex={-1}
      >
        <FocusModeBackground
          backgroundOpacity={backgroundOpacity}
          onBackgroundOpacityChange={setBackgroundOpacity}
          isControlsVisible={shouldShowControls && !isDistractionFree && !isMobile}
          isZenMode={isZenMode}
          isBackgroundHidden={isBackgroundHidden}
          onClose={onClose}
        />
        
        {/* Mobile Swipe Hint */}
        {isMobile && showMobileHint && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-white/10 backdrop-blur-md rounded-full px-4 py-2 text-white/70 text-sm z-30"
          >
            Swipe up to exit
          </motion.div>
        )}
        
        {/* Main Focus Editor */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className={`relative w-full transition-all duration-500 ${
            isMobile 
              ? 'max-w-full h-screen p-0' 
              : isZenMode 
                ? 'max-w-4xl h-screen p-0' 
                : 'max-w-6xl h-[95vh] p-6'
          }`}
        >
          {shouldShowControls && (
            <FocusModeControls
              isControlsVisible={shouldShowControls}
              isZenMode={isZenMode}
              onZenModeToggle={() => setIsZenMode(!isZenMode)}
              showStats={showStats}
              onStatsToggle={() => setShowStats(!showStats)}
              onSave={onSave}
              onClose={onClose}
              isSaving={isSaving}
              title={title}
              wordCount={wordCount}
              timeSpent={timeSpent}
              formatTime={formatTime}
            />
          )}

          <FocusModeEditor
            title={title}
            content={content}
            onTitleChange={onTitleChange}
            onContentChange={onContentChange}
            isMobile={isMobile}
            isZenMode={isZenMode}
            isDistractionFree={isDistractionFree}
            isBackgroundHidden={isBackgroundHidden}
          />

          {!isDistractionFree && !isMobile && (
            <>
              <FocusModeStats
                showStats={showStats}
                isControlsVisible={shouldShowControls}
                wordCount={wordCount}
                characterCount={characterCount}
                timeSpent={timeSpent}
                wpm={wpm}
                formatTime={formatTime}
              />

              <FocusModeKeyboardShortcuts
                isControlsVisible={shouldShowControls}
              />
            </>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default FocusMode;
