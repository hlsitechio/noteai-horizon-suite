import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Mic, MicOff, Sparkles, Paperclip } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

interface PremiumChatInputProps {
  message: string;
  setMessage: (message: string) => void;
  onSend: () => void;
  onKeyPress: (e: React.KeyboardEvent) => void;
  onVoiceInput: () => void;
  isLoading: boolean;
  isRecording: boolean;
  isProcessing: boolean;
}

export const PremiumChatInput: React.FC<PremiumChatInputProps> = ({
  message,
  setMessage,
  onSend,
  onKeyPress,
  onVoiceInput,
  isLoading,
  isRecording,
  isProcessing
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [message]);

  const quickSuggestions = [
    "Explain this concept",
    "Write a summary",
    "Help me brainstorm",
    "Create a plan"
  ];

  return (
    <motion.div 
      className="relative"
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      {/* Quick Suggestions */}
      <AnimatePresence>
        {!message && !isFocused && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mb-4 flex gap-2 flex-wrap justify-center"
          >
            {quickSuggestions.map((suggestion, index) => (
              <motion.button
                key={suggestion}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ 
                  opacity: 1, 
                  scale: 1,
                  transition: { delay: index * 0.1 }
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setMessage(suggestion)}
                className="
                  px-3 py-1.5 text-sm
                  bg-gradient-glass backdrop-blur-sm
                  border border-border/30
                  rounded-full
                  text-muted-foreground
                  hover:text-foreground
                  hover:border-primary/30
                  hover:bg-gradient-to-r hover:from-primary/10 hover:to-accent/10
                  transition-all duration-300
                  shadow-soft-premium
                "
              >
                {suggestion}
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Input Container */}
      <div className={`
        relative
        bg-gradient-glass backdrop-blur-xl
        border-2 transition-all duration-300
        rounded-2xl
        shadow-elegant
        ${isFocused 
          ? 'border-primary/50 shadow-glow' 
          : 'border-border/20'
        }
      `}>
        {/* Holographic Border Effect */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-holographic opacity-0 hover:opacity-10 transition-opacity duration-300 pointer-events-none" />
        
        <div className="relative z-10 p-4">
          <div className="flex items-end gap-3">
            {/* Voice Input Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={onVoiceInput}
              disabled={isLoading}
              className={`
                w-10 h-10 rounded-full p-0
                transition-all duration-300
                ${isRecording 
                  ? 'bg-destructive/20 text-destructive border-destructive/30 animate-pulse' 
                  : 'hover:bg-primary/10 hover:text-primary border-border/20'
                }
                border
              `}
            >
              {isRecording ? (
                <MicOff className="h-4 w-4" />
              ) : (
                <Mic className="h-4 w-4" />
              )}
            </Button>

            {/* Text Input */}
            <div className="flex-1 relative">
              <Textarea
                ref={textareaRef}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={onKeyPress}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                placeholder="Ask me anything..."
                disabled={isLoading}
                className="
                  min-h-[44px] max-h-[120px] resize-none
                  bg-transparent border-none
                  text-foreground placeholder:text-muted-foreground/70
                  focus:ring-0 focus:outline-none
                  text-base leading-relaxed
                  pr-12
                "
                rows={1}
              />
              
              {/* Send Button */}
              <Button
                onClick={onSend}
                disabled={isLoading || !message.trim()}
                size="sm"
                className={`
                  absolute right-2 bottom-2
                  w-8 h-8 rounded-full p-0
                  transition-all duration-300
                  ${message.trim() 
                    ? 'bg-gradient-to-r from-primary to-accent hover:shadow-glow' 
                    : 'bg-muted/50'
                  }
                `}
              >
                {isLoading ? (
                  <Sparkles className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </div>

            {/* Attachment Button */}
            <Button
              variant="ghost"
              size="sm"
              className="w-10 h-10 rounded-full p-0 hover:bg-muted/50 border border-border/20"
            >
              <Paperclip className="h-4 w-4" />
            </Button>
          </div>

          {/* Status Indicators */}
          <AnimatePresence>
            {(isRecording || isProcessing) && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-2 flex items-center gap-2 text-sm text-muted-foreground"
              >
                {isRecording && (
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-destructive rounded-full animate-pulse" />
                    Recording...
                  </div>
                )}
                {isProcessing && (
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                    Processing voice input...
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};