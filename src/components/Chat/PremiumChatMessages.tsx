import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PremiumMessageBubble } from './PremiumMessageBubble';
import { PremiumTypingIndicator } from './PremiumTypingIndicator';
import { PremiumQuickActions } from './PremiumQuickActions';

interface ChatMessage {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
}

interface PremiumChatMessagesProps {
  messages: ChatMessage[];
  isLoading: boolean;
  onQuickActionSelect: (text: string) => void;
  profile?: { display_name: string } | null;
  profileLoading: boolean;
}

export const PremiumChatMessages: React.FC<PremiumChatMessagesProps> = ({
  messages,
  isLoading,
  onQuickActionSelect,
  profile,
  profileLoading
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [messages, isLoading]);

  return (
    <div className="flex-1 relative">
      {/* Custom Scrollbar Styles */}
      <style>{`
        .premium-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .premium-scrollbar::-webkit-scrollbar-track {
          background: hsl(var(--muted) / 0.1);
          border-radius: 3px;
        }
        .premium-scrollbar::-webkit-scrollbar-thumb {
          background: hsl(var(--primary) / 0.3);
          border-radius: 3px;
        }
        .premium-scrollbar::-webkit-scrollbar-thumb:hover {
          background: hsl(var(--primary) / 0.5);
        }
      `}</style>

      <div
        ref={scrollRef}
        className="
          h-full overflow-y-auto premium-scrollbar
          px-6 py-4
          scroll-smooth
        "
      >
        {/* Welcome Message */}
        {messages.length === 0 && !isLoading && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex flex-col items-center justify-center h-full min-h-[400px] text-center"
          >
            <div className="
              w-20 h-20 rounded-full mb-6
              bg-gradient-holographic
              border-2 border-primary/30
              flex items-center justify-center
              shadow-glow animate-pulse-glow
            ">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              >
                ✨
              </motion.div>
            </div>
            
            <h3 className="text-2xl font-semibold mb-2 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Welcome to Neural Chat
            </h3>
            
            <p className="text-muted-foreground mb-8 max-w-md leading-relaxed">
              Experience the future of AI conversation with our premium neural assistant. 
              Ask anything, and let's explore possibilities together.
            </p>

            <PremiumQuickActions 
              onQuickActionSelect={onQuickActionSelect}
              profile={profile}
              profileLoading={profileLoading}
            />
          </motion.div>
        )}

        {/* Message List */}
        <AnimatePresence mode="popLayout">
          {messages.map((message, index) => (
            <PremiumMessageBubble
              key={message.id}
              message={message}
              index={index}
            />
          ))}
          
          {/* Typing Indicator */}
          {isLoading && <PremiumTypingIndicator />}
        </AnimatePresence>

        {/* Bottom Spacer */}
        <div className="h-4" />
      </div>
    </div>
  );
};