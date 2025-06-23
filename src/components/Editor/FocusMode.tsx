
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import RichTextEditor from './RichTextEditor';
import FocusModeBackground from './FocusModeBackground';
import FocusModeControls from './FocusModeControls';
import FocusModeStats from './FocusModeStats';
import FocusModeKeyboardShortcuts from './FocusModeKeyboardShortcuts';
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
}) => {
  const [backgroundOpacity, setBackgroundOpacity] = useState([85]);
  const [showStats, setShowStats] = useState(false);
  const [isZenMode, setIsZenMode] = useState(false);

  const { timeSpent, formatTime } = useFocusModeTimer(isOpen);
  const { wordCount, characterCount, wpm } = useFocusModeStats(content, timeSpent);
  const { isControlsVisible, setIsControlsVisible } = useFocusModeControls(isZenMode);

  // Hide controls completely when in distraction-free mode
  const shouldShowControls = !isDistractionFree && isControlsVisible;

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    }
    if (e.ctrlKey && e.key === 's') {
      e.preventDefault();
      onSave();
    }
    if (e.ctrlKey && e.key === 'h') {
      e.preventDefault();
      setIsControlsVisible(!isControlsVisible);
    }
  };

  // Check if background should be completely hidden
  const isBackgroundHidden = backgroundOpacity[0] >= 100;

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
        }`}
        onKeyDown={handleKeyDown}
        tabIndex={-1}
      >
        <FocusModeBackground
          backgroundOpacity={backgroundOpacity}
          onBackgroundOpacityChange={setBackgroundOpacity}
          isControlsVisible={shouldShowControls && !isDistractionFree}
          isZenMode={isZenMode}
          isBackgroundHidden={isBackgroundHidden}
          onClose={onClose}
        />
        
        {/* Main Focus Editor */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className={`relative w-full transition-all duration-500 ${
            isZenMode ? 'max-w-4xl h-screen p-0' : 'max-w-6xl h-[95vh] p-6'
          }`}
        >
          {isBackgroundHidden ? (
            /* Pure black background container when ambience is 100% */
            <div className="h-full bg-black overflow-hidden">
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

              {/* Title Input */}
              <div className={`${isZenMode ? 'pt-24 px-12' : isDistractionFree ? 'pt-12 px-12' : 'pt-20 px-12'}`}>
                <motion.input
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  type="text"
                  value={title}
                  onChange={(e) => onTitleChange(e.target.value)}
                  placeholder="Enter your title..."
                  className="w-full text-4xl font-bold bg-transparent border-none outline-none text-white placeholder-white/50 mb-8 leading-tight"
                  autoFocus
                />
              </div>

              {/* Editor Content */}
              <div className={`h-[calc(100%-140px)] ${isZenMode ? 'px-12 pb-12' : 'px-12 pb-6'}`}>
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="h-full"
                >
                  <RichTextEditor
                    value={content}
                    onChange={onContentChange}
                    placeholder="Focus on your writing... Let your thoughts flow without any distractions."
                  />
                </motion.div>
              </div>
            </div>
          ) : (
            /* Card container when ambience is less than 100% */
            <Card className={`h-full glass shadow-2xl overflow-hidden transition-all duration-500 ${
              isZenMode ? 'rounded-none border-none' : 'rounded-3xl'
            }`}>
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

              {/* Title Input */}
              <div className={`${isZenMode ? 'pt-24 px-12' : isDistractionFree ? 'pt-12 px-12' : 'pt-20 px-12'}`}>
                <motion.input
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  type="text"
                  value={title}
                  onChange={(e) => onTitleChange(e.target.value)}
                  placeholder="Enter your title..."
                  className="w-full text-4xl font-bold bg-transparent border-none outline-none text-white placeholder-white/50 mb-8 leading-tight"
                  autoFocus
                />
              </div>

              {/* Editor Content */}
              <CardContent className={`h-[calc(100%-140px)] ${isZenMode ? 'px-12 pb-12' : 'px-12 pb-6'}`}>
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="h-full"
                >
                  <RichTextEditor
                    value={content}
                    onChange={onContentChange}
                    placeholder="Focus on your writing... Let your thoughts flow without any distractions."
                  />
                </motion.div>
              </CardContent>
            </Card>
          )}

          {!isDistractionFree && (
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
