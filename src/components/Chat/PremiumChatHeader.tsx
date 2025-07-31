import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Settings, MoreHorizontal, Zap, Brain } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

interface PremiumChatHeaderProps {
  profile?: {
    display_name: string;
    avatar_url?: string;
  } | null;
  profileLoading: boolean;
  messagesLength: number;
  onClearChat: () => void;
}

export const PremiumChatHeader: React.FC<PremiumChatHeaderProps> = ({
  profile,
  profileLoading,
  messagesLength,
  onClearChat
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="relative mb-6"
    >
      <div className="
        relative overflow-hidden
        bg-gradient-glass backdrop-blur-xl
        border border-border/20
        rounded-2xl
        shadow-elegant
        p-6
      ">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-aurora opacity-20 animate-gradient-mesh pointer-events-none" />
        
        {/* Content */}
        <div className="relative z-10 flex items-center justify-between">
          {/* Left Section - AI Status */}
          <div className="flex items-center gap-4">
            <div className="
              w-12 h-12 rounded-full
              bg-gradient-holographic
              border-2 border-primary/30
              flex items-center justify-center
              shadow-glow animate-pulse-glow
            ">
              <Brain className="h-6 w-6 text-background" />
            </div>
            
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h2 className="text-xl font-semibold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  Neural Assistant
                </h2>
                <Badge variant="secondary" className="
                  bg-gradient-to-r from-success/20 to-info/20
                  text-success-foreground
                  border-success/30
                  animate-pulse
                ">
                  <Zap className="h-3 w-3 mr-1" />
                  Online
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                Advanced AI • Context-aware • Real-time
              </p>
            </div>
          </div>

          {/* Center Section - Stats */}
          <div className="hidden md:flex items-center gap-6">
            <div className="text-center">
              <div className="text-lg font-semibold text-primary">
                {messagesLength}
              </div>
              <div className="text-xs text-muted-foreground">Messages</div>
            </div>
            <div className="w-px h-8 bg-border/30" />
            <div className="text-center">
              <div className="text-lg font-semibold text-accent">GPT-4.1</div>
              <div className="text-xs text-muted-foreground">Model</div>
            </div>
            <div className="w-px h-8 bg-border/30" />
            <div className="text-center">
              <div className="text-lg font-semibold text-success">99.9%</div>
              <div className="text-xs text-muted-foreground">Uptime</div>
            </div>
          </div>

          {/* Right Section - User & Actions */}
          <div className="flex items-center gap-3">
            {/* User Profile */}
            <div className="flex items-center gap-2">
              {!profileLoading && profile && (
                <>
                  <div className="text-right hidden sm:block">
                    <div className="text-sm font-medium text-foreground">
                      {profile.display_name}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Premium User
                    </div>
                  </div>
                  <Avatar className="h-8 w-8 border-2 border-primary/20">
                    <AvatarImage src={profile.avatar_url} />
                    <AvatarFallback className="bg-gradient-to-br from-primary/20 to-accent/20">
                      {profile.display_name?.charAt(0)?.toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 hover:bg-muted/50"
              >
                <Settings className="h-4 w-4" />
              </Button>
              
              {messagesLength > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClearChat}
                  className="h-8 px-3 hover:bg-destructive/10 hover:text-destructive"
                >
                  <Sparkles className="h-4 w-4 mr-1" />
                  Clear
                </Button>
              )}
              
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 hover:bg-muted/50"
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};