import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Sparkles } from 'lucide-react';
import { EnhancedChatMessage } from '../../hooks/useEnhancedAIChatWithSessions';
import FormattedMessage from './FormattedMessage';
import InteractiveNoteCard from './InteractiveNoteCard';
import ChatQuickActions from './ChatQuickActions';
import { getActionIcon } from './ChatActionIcons';

interface ChatMessagesProps {
  messages: EnhancedChatMessage[];
  isLoading: boolean;
  onQuickActionSelect: (text: string) => void;
  profile?: { display_name: string } | null;
  profileLoading: boolean;
}

const ChatMessages: React.FC<ChatMessagesProps> = ({
  messages,
  isLoading,
  onQuickActionSelect,
  profile,
  profileLoading
}) => {
  return (
    <ScrollArea className="flex-1 mb-6 pr-4">
      <div className="space-y-6">
        {messages.length === 0 ? (
          <ChatQuickActions 
            onActionSelect={onQuickActionSelect}
            profile={profile}
            profileLoading={profileLoading}
          />
        ) : (
          messages.map((msg: EnhancedChatMessage, index) => (
            <div
              key={msg.id}
              className={`flex flex-col ${msg.isUser ? 'items-end' : 'items-start'} animate-fade-in`}
            >
              <div
                className={`max-w-[85%] p-4 rounded-2xl shadow-sm backdrop-blur-sm border transition-all duration-300 hover:shadow-md ${
                  msg.isUser
                    ? 'bg-gradient-to-br from-primary to-primary/90 text-primary-foreground border-primary/20'
                    : 'bg-gradient-to-br from-muted/80 to-muted/60 border-muted/50'
                }`}
              >
                <FormattedMessage content={msg.content} isUser={msg.isUser} />
                
                {/* Show actions that were executed */}
                {msg.actions && msg.actions.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {msg.actions.map((action, actionIndex) => (
                      <Badge 
                        key={actionIndex}
                        variant="secondary" 
                        className="text-xs flex items-center gap-1 bg-gradient-to-r from-secondary/80 to-secondary/60 hover:from-secondary to-secondary/80 transition-all duration-200"
                      >
                        {getActionIcon(action.type)}
                        {action.type.replace('_', ' ')}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
              
              {/* Show Interactive Note Cards for created notes */}
              {msg.actionResults && msg.actionResults.map((result, resultIndex) => {
                if (result.success && result.data && msg.actions?.[resultIndex]?.type === 'create_note') {
                  return (
                    <div key={`note-${result.data.id}`} className="mt-3 animate-scale-in">
                      <InteractiveNoteCard
                        noteId={result.data.id}
                        title={result.data.title}
                        content={result.data.content}
                        tags={result.data.tags || []}
                      />
                    </div>
                  );
                }
                return null;
              })}
              
              {/* Show timestamp */}
              <div className="text-xs text-muted-foreground/70 mt-2 px-2 font-medium">
                {msg.timestamp.toLocaleTimeString()}
              </div>
            </div>
          ))
        )}
        {isLoading && (
          <div className="flex justify-start animate-fade-in">
            <div className="bg-gradient-to-br from-muted/80 to-muted/60 p-4 rounded-2xl shadow-sm backdrop-blur-sm border border-muted/50">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <Sparkles className="w-5 h-5 animate-spin text-primary" />
                  <div className="absolute inset-0 w-5 h-5 text-primary/30 animate-ping">
                    <Sparkles className="w-5 h-5" />
                  </div>
                </div>
                <span className="text-sm text-muted-foreground font-medium">AI is thinking and taking actions...</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </ScrollArea>
  );
};

export default ChatMessages;