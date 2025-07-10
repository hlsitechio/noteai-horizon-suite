import React from 'react';
import { CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sparkles } from 'lucide-react';
interface ChatHeaderProps {
  profile?: {
    display_name: string;
  } | null;
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
  return <div className="flex-shrink-0 mb-6">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary/5 via-accent/5 to-primary/5 backdrop-blur-sm border border-border/50">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-accent/10 opacity-50"></div>
        
      </div>
    </div>;
};
export default ChatHeader;