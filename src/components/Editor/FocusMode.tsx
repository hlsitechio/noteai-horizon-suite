
import React, { useState, useEffect, useRef } from 'react';
import { X, Maximize2, Save, Type, Eye, EyeOff, Timer, Target } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { motion, AnimatePresence } from 'framer-motion';
import RichTextEditor from './RichTextEditor';

interface FocusModeProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  content: string;
  onTitleChange: (title: string) => void;
  onContentChange: (content: string) => void;
  onSave: () => void;
  isSaving: boolean;
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
}) => {
  const [backgroundOpacity, setBackgroundOpacity] = useState([85]);
  const [isControlsVisible, setIsControlsVisible] = useState(true);
  const [showStats, setShowStats] = useState(false);
  const [wordCount, setWordCount] = useState(0);
  const [characterCount, setCharacterCount] = useState(0);
  const [timeSpent, setTimeSpent] = useState(0);
  const [isZenMode, setIsZenMode] = useState(false);
  const timeStartRef = useRef<number>(Date.now());
  const timeIntervalRef = useRef<NodeJS.Timeout>();
  const hideControlsTimeoutRef = useRef<NodeJS.Timeout>();

  // Calculate writing stats
  useEffect(() => {
    const text = content.replace(/<[^>]*>/g, ''); // Remove HTML tags for accurate count
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    setWordCount(words);
    setCharacterCount(text.length);
  }, [content]);

  // Timer functionality
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

  // Auto-hide controls in zen mode
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

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
        className="fixed inset-0 z-50 flex items-center justify-center"
        onKeyDown={handleKeyDown}
        tabIndex={-1}
      >
        {/* Dynamic Blurred Background */}
        <motion.div 
          className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900"
          style={{ 
            backdropFilter: `blur(${Math.max(10, backgroundOpacity[0] / 10)}px)`,
            opacity: backgroundOpacity[0] / 100 
          }}
          onClick={!isZenMode ? onClose : undefined}
        />
        
        {/* Ambient Background Effects */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div 
            className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-full blur-3xl"
            animate={{ 
              x: [0, 100, 0],
              y: [0, -50, 0],
              scale: [1, 1.2, 1]
            }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          />
          <motion.div 
            className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-pink-500/10 to-orange-500/10 rounded-full blur-3xl"
            animate={{ 
              x: [0, -80, 0],
              y: [0, 60, 0],
              scale: [1, 0.8, 1]
            }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          />
        </div>
        
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
          <Card className={`h-full glass shadow-2xl overflow-hidden transition-all duration-500 ${
            isZenMode ? 'rounded-none border-none' : 'rounded-3xl'
          }`}>
            {/* Floating Controls */}
            <AnimatePresence>
              {isControlsVisible && (
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className={`absolute top-6 left-6 right-6 z-20 flex items-center justify-between ${
                    isZenMode ? 'bg-black/20 backdrop-blur-xl rounded-2xl p-4' : ''
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      className="flex items-center gap-3 text-white/90"
                    >
                      <Maximize2 className="w-6 h-6 text-blue-400" />
                      <span className="text-lg font-semibold">Focus Mode</span>
                    </motion.div>
                    
                    {/* Writing Stats */}
                    <motion.div 
                      className="flex items-center gap-4 text-sm text-white/70"
                      whileHover={{ scale: 1.02 }}
                    >
                      <div className="flex items-center gap-1">
                        <Type className="w-4 h-4" />
                        <span>{wordCount} words</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Timer className="w-4 h-4" />
                        <span>{formatTime(timeSpent)}</span>
                      </div>
                    </motion.div>
                  </div>

                  <div className="flex items-center gap-3">
                    {/* Zen Mode Toggle */}
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setIsZenMode(!isZenMode)}
                        className="text-white/80 hover:text-white hover:bg-white/10 transition-all duration-300"
                      >
                        {isZenMode ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                      </Button>
                    </motion.div>

                    {/* Stats Toggle */}
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowStats(!showStats)}
                        className="text-white/80 hover:text-white hover:bg-white/10 transition-all duration-300"
                      >
                        <Target className="w-4 h-4" />
                      </Button>
                    </motion.div>

                    {/* Save Button */}
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button
                        onClick={onSave}
                        disabled={!title.trim() || isSaving}
                        className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-none shadow-lg"
                      >
                        <Save className="w-4 h-4 mr-2" />
                        {isSaving ? 'Saving...' : 'Save'}
                      </Button>
                    </motion.div>

                    {/* Close Button */}
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={onClose}
                        className="text-white/80 hover:text-white hover:bg-red-500/20 transition-all duration-300"
                      >
                        <X className="w-5 h-5" />
                      </Button>
                    </motion.div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Title Input */}
            <div className={`${isZenMode ? 'pt-24 px-12' : 'pt-20 px-12'}`}>
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

            {/* Floating Background Opacity Control */}
            <AnimatePresence>
              {isControlsVisible && !isZenMode && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="absolute bottom-6 right-6 bg-black/20 backdrop-blur-xl rounded-2xl p-4"
                >
                  <div className="flex items-center gap-3 text-white/80">
                    <span className="text-sm font-medium">Ambience</span>
                    <Slider
                      value={backgroundOpacity}
                      onValueChange={setBackgroundOpacity}
                      max={95}
                      min={60}
                      step={5}
                      className="w-24"
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Writing Statistics Sidebar */}
            <AnimatePresence>
              {showStats && isControlsVisible && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="absolute bottom-6 left-6 bg-black/20 backdrop-blur-xl rounded-2xl p-6 min-w-[200px]"
                >
                  <h3 className="text-white font-semibold mb-4">Writing Session</h3>
                  <div className="space-y-3 text-white/80">
                    <div className="flex justify-between">
                      <span>Words:</span>
                      <span className="font-mono">{wordCount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Characters:</span>
                      <span className="font-mono">{characterCount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Time:</span>
                      <span className="font-mono">{formatTime(timeSpent)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>WPM:</span>
                      <span className="font-mono">
                        {timeSpent > 0 ? Math.round((wordCount / timeSpent) * 60) : 0}
                      </span>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Keyboard Shortcuts Help */}
            <AnimatePresence>
              {isControlsVisible && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  className="absolute bottom-6 left-1/2 transform -translate-x-1/2 text-center"
                >
                  <div className="flex gap-6 text-sm text-white/60">
                    <span>
                      <kbd className="px-2 py-1 bg-white/10 rounded text-xs mr-1">Esc</kbd>
                      Exit
                    </span>
                    <span>
                      <kbd className="px-2 py-1 bg-white/10 rounded text-xs mr-1">Ctrl+S</kbd>
                      Save
                    </span>
                    <span>
                      <kbd className="px-2 py-1 bg-white/10 rounded text-xs mr-1">Ctrl+H</kbd>
                      {isControlsVisible ? "Hide" : "Show"} Controls
                    </span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </Card>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default FocusMode;
