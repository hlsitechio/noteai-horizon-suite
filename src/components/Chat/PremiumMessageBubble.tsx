import React from 'react';
import { motion } from 'framer-motion';
import { Bot, User, Copy, ThumbsUp, ThumbsDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface PremiumMessageBubbleProps {
  message: {
    id: string;
    content: string;
    isUser: boolean;
    timestamp: Date;
  };
  index: number;
}

export const PremiumMessageBubble: React.FC<PremiumMessageBubbleProps> = ({ 
  message, 
  index 
}) => {
  const { toast } = useToast();

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    toast({
      title: "Copied to clipboard",
      description: "Message content has been copied.",
    });
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.5,
        delay: index * 0.1,
        ease: [0.4, 0, 0.2, 1] as const
      }
    }
  };

  if (message.isUser) {
    return (
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="flex justify-end mb-6"
      >
        <div className="max-w-[80%] flex items-start gap-3">
          <div className="relative group">
            <div className="
              bg-gradient-to-br from-primary/90 to-primary/70
              backdrop-blur-sm border border-primary/20
              rounded-2xl rounded-br-md px-4 py-3
              shadow-glow
              transition-all duration-300
              hover:shadow-primary-glow hover:scale-[1.02]
            ">
              <p className="text-primary-foreground font-medium">
                {message.content}
              </p>
              <div className="flex items-center justify-between mt-2 gap-2">
                <span className="text-xs text-primary-foreground/70">
                  {message.timestamp.toLocaleTimeString([], { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCopy}
                  className="h-6 w-6 p-0 text-primary-foreground/70 hover:text-primary-foreground hover:bg-white/10"
                >
                  <Copy className="h-3 w-3" />
                </Button>
              </div>
            </div>
          </div>
          <div className="
            w-8 h-8 rounded-full
            bg-gradient-to-br from-secondary to-accent
            border border-border/20
            flex items-center justify-center
            shadow-soft-premium
          ">
            <User className="h-4 w-4 text-secondary-foreground" />
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="flex justify-start mb-6"
    >
      <div className="max-w-[85%] flex items-start gap-3">
        <div className="
          w-8 h-8 rounded-full
          bg-gradient-holographic
          border border-primary/30
          flex items-center justify-center
          shadow-glow animate-pulse-glow
        ">
          <Bot className="h-4 w-4 text-background" />
        </div>
        <div className="relative group">
          <div className="
            bg-gradient-glass backdrop-blur-xl
            border border-border/30
            rounded-2xl rounded-bl-md px-4 py-3
            shadow-elegant
            transition-all duration-300
            hover:shadow-glow hover:scale-[1.01]
            hover:border-primary/20
          ">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 rounded-2xl rounded-bl-md pointer-events-none" />
            <div className="relative">
              <p className="text-foreground leading-relaxed font-light">
                {message.content}
              </p>
              <div className="flex items-center justify-between mt-3 gap-2">
                <span className="text-xs text-muted-foreground">
                  {message.timestamp.toLocaleTimeString([], { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </span>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleCopy}
                    className="h-6 w-6 p-0 text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0 text-muted-foreground hover:text-success hover:bg-success/10"
                  >
                    <ThumbsUp className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                  >
                    <ThumbsDown className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};