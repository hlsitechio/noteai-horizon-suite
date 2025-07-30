import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, Mic, MicOff, Sparkles } from 'lucide-react';

interface ChatInputProps {
  message: string;
  setMessage: (message: string) => void;
  onSend: () => void;
  onKeyPress: (e: React.KeyboardEvent) => void;
  onVoiceInput: () => void;
  isLoading: boolean;
  isRecording: boolean;
  isProcessing: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({
  message,
  setMessage,
  onSend,
  onKeyPress,
  onVoiceInput,
  isLoading,
  isRecording,
  isProcessing
}) => {
  return (
    <div className="space-y-4">
      <div className="flex gap-3 items-end">
        <div className="flex-1 relative">
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={onKeyPress}
            placeholder={isRecording ? "Listening..." : "Ask me to create notes in the canva, set reminders, improve text..."}
            disabled={isLoading || isRecording}
            className="pr-12 h-12 rounded-xl border-2 border-muted/50 focus:border-primary/50 bg-gradient-to-r from-background to-muted/20 backdrop-blur-sm transition-all duration-200"
          />
          {message && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
            </div>
          )}
        </div>
        
        {/* Voice Input Button */}
        <Button 
          variant={isRecording ? "destructive" : "outline"}
          size="lg"
          onClick={onVoiceInput}
          disabled={isLoading || isProcessing}
          className={`h-12 w-12 rounded-xl border-2 ${isRecording ? 'animate-pulse border-destructive/50' : 'border-muted/50 hover:border-primary/50'} transition-all duration-200`}
          type="button"
        >
          {isProcessing ? (
            <Sparkles className="w-5 h-5 animate-spin" />
          ) : isRecording ? (
            <MicOff className="w-5 h-5" />
          ) : (
            <Mic className="w-5 h-5" />
          )}
        </Button>
        
        <Button
          onClick={onSend}
          disabled={isLoading || !message.trim() || isRecording}
          variant="primary"
          size="lg"
          className="shadow-xl"
          type="button"
        >
          {isLoading ? (
            <Sparkles className="w-5 h-5 animate-spin" />
          ) : (
            <div className="flex items-center gap-2">
              <Send className="w-5 h-5" />
              <span className="text-sm font-bold tracking-wide">SEND MESSAGE</span>
            </div>
          )}
        </Button>
      </div>
      
      {/* Recording Status */}
      {isRecording && (
        <div className="text-center animate-fade-in">
          <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-gradient-to-r from-destructive/10 to-destructive/5 border border-destructive/20">
            <div className="w-3 h-3 bg-destructive rounded-full animate-pulse"></div>
            <span className="text-sm text-destructive font-medium">Recording... Click mic to stop</span>
          </div>
        </div>
      )}
      
      {isProcessing && (
        <div className="text-center animate-fade-in">
          <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20">
            <Sparkles className="w-4 h-4 animate-spin text-primary" />
            <span className="text-sm text-primary font-medium">Converting speech to text...</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatInput;