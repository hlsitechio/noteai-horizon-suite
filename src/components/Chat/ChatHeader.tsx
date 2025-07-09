import React from 'react';
import { CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sparkles } from 'lucide-react';

interface ChatHeaderProps {
  profile?: { display_name: string } | null;
  profileLoading: boolean;
  messagesLength: number;
  onClearChat: () => void;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({
  profile,
  profileLoading,
  messagesLength,
  onClearChat
}) => {
  return (
    <div className="flex-shrink-0 mb-6">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary/5 via-accent/5 to-primary/5 backdrop-blur-sm border border-border/50">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-accent/10 opacity-50"></div>
        <CardHeader className="relative">
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <Sparkles className="w-6 h-6 text-primary animate-pulse" />
                <div className="absolute inset-0 w-6 h-6 text-primary animate-ping opacity-20">
                  <Sparkles className="w-6 h-6" />
                </div>
              </div>
              <div>
                <h1 className="text-xl font-semibold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                  AI Assistant {profile && !profileLoading ? `for ${profile.display_name}` : ''}
                </h1>
                <p className="text-sm text-muted-foreground font-normal">
                  {profile && !profileLoading 
                    ? `Hi ${profile.display_name}! I can create notes in the canva, get help, and more` 
                    : 'Create notes in the canva, get help, and more'
                  }
                </p>
              </div>
            </div>
            {messagesLength > 0 && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={onClearChat}
                className="text-xs hover:bg-destructive/10 hover:text-destructive hover:border-destructive/20 transition-all duration-200"
              >
                Clear Chat
              </Button>
            )}
          </CardTitle>
        </CardHeader>
      </div>
    </div>
  );
};

export default ChatHeader;