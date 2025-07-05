
import React, { useState } from 'react';
import { Send, Bot, User, Sparkles, Clock, FileText, Search, Trash2, Mic, MicOff, PenTool, Languages, Zap, BookOpen, Filter, Type } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import DynamicMobileHeader from '../components/DynamicMobileHeader';
import { useEnhancedAIChatWithActions, EnhancedChatMessage } from '../../hooks/useEnhancedAIChatWithActions';
import { useSpeechToText } from '../../hooks/useSpeechToText';

const MobileChat: React.FC = () => {
  const [input, setInput] = useState('');
  const { 
    messages, 
    sendMessageWithActions, 
    isLoading 
  } = useEnhancedAIChatWithActions();
  
  const {
    isRecording,
    isProcessing,
    startRecording,
    stopRecording,
    cancelRecording,
  } = useSpeechToText();

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    
    await sendMessageWithActions(input);
    setInput('');
  };

  const handleVoiceInput = async () => {
    if (isRecording) {
      // Stop recording and get transcription
      const transcription = await stopRecording();
      if (transcription) {
        setInput(transcription);
      }
    } else {
      // Start recording
      const success = await startRecording();
      if (!success) {
        console.error('Failed to start recording');
      }
    }
  };

  const getActionIcon = (actionType: string) => {
    switch (actionType) {
      case 'create_note': return <FileText className="w-3 h-3" />;
      case 'set_reminder': return <Clock className="w-3 h-3" />;
      case 'search_notes': return <Search className="w-3 h-3" />;
      case 'delete_note': return <Trash2 className="w-3 h-3" />;
      case 'improve_text': return <PenTool className="w-3 h-3" />;
      case 'summarize_text': return <BookOpen className="w-3 h-3" />;
      case 'translate_text': return <Languages className="w-3 h-3" />;
      case 'check_grammar': return <Zap className="w-3 h-3" />;
      case 'adjust_tone': return <Type className="w-3 h-3" />;
      case 'expand_content': return <Filter className="w-3 h-3" />;
      case 'extract_keywords': return <Search className="w-3 h-3" />;
      default: return <Sparkles className="w-3 h-3" />;
    }
  };

  const quickPrompts = [
    'Create a note about today\'s meeting',
    'Remind me to call John tomorrow at 2pm',
    'Find my notes about project planning',
    'Set a reminder for my dentist appointment',
    'Improve this text: Writing can be hard sometimes',
    'Summarize this paragraph for me',
    'Translate this to Spanish: Hello, how are you?',
    'Check grammar: Their going to the store tomorrow'
  ];

  return (
    <div className="h-full flex flex-col bg-background">
      <DynamicMobileHeader title="Enhanced AI Assistant" />
      
      {/* Messages */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">
              <Sparkles className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p className="mb-4">I can help you create notes, set reminders, organize your thoughts, and assist with writing tasks!</p>
            </div>
          ) : (
            messages.map((message: EnhancedChatMessage) => (
              <div
                key={message.id}
                className={`flex gap-3 ${
                  message.isUser ? 'justify-end' : 'justify-start'
                }`}
              >
                {!message.isUser && (
                  <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                    <Bot className="w-4 h-4 text-primary-foreground" />
                  </div>
                )}
                
                <div className={`max-w-[80%] ${message.isUser ? 'order-1' : ''}`}>
                  <Card className={`${
                    message.isUser 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-muted'
                  }`}>
                    <CardContent className="p-3">
                      <p className="text-sm">{message.content}</p>
                      
                      {/* Show actions that were executed */}
                      {message.actions && message.actions.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-1">
                          {message.actions.map((action, actionIndex) => (
                            <Badge 
                              key={actionIndex}
                              variant="secondary" 
                              className="text-xs flex items-center gap-1"
                            >
                              {getActionIcon(action.type)}
                              {action.type.replace('_', ' ')}
                            </Badge>
                          ))}
                        </div>
                      )}
                      
                      <p className={`text-xs mt-1 ${
                        message.isUser 
                          ? 'text-primary-foreground/70' 
                          : 'text-muted-foreground'
                      }`}>
                        {message.timestamp.toLocaleTimeString([], { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </p>
                    </CardContent>
                  </Card>
                </div>
                
                {message.isUser && (
                  <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center flex-shrink-0">
                    <User className="w-4 h-4 text-accent-foreground" />
                  </div>
                )}
              </div>
            ))
          )}
          
          {isLoading && (
            <div className="flex gap-3 justify-start">
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                <Bot className="w-4 h-4 text-primary-foreground" />
              </div>
              <Card className="bg-muted">
                <CardContent className="p-3">
                  <div className="flex items-center space-x-2">
                    <Sparkles className="w-4 h-4 animate-spin text-primary" />
                    <span className="text-sm text-muted-foreground">AI is thinking and taking actions...</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Quick Prompts */}
      {messages.length === 0 && (
        <div className="p-4 border-t">
          <p className="text-sm text-muted-foreground mb-3">Try these prompts:</p>
          <div className="grid grid-cols-1 gap-2">
            {quickPrompts.map((prompt) => (
              <Button
                key={prompt}
                variant="outline"
                size="sm"
                onClick={() => setInput(prompt)}
                className="justify-start text-left h-auto py-2"
              >
                <Sparkles className="w-3 h-3 mr-2" />
                {prompt}
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="p-4 border-t bg-background">
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={isRecording ? "Listening..." : "Ask me to create notes, set reminders, improve text, summarize content..."}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            className="flex-1"
            disabled={isLoading || isRecording}
          />
          
          {/* Voice Input Button */}
          <Button 
            variant={isRecording ? "destructive" : "outline"}
            size="sm"
            onClick={handleVoiceInput}
            disabled={isLoading || isProcessing}
            className={`${isRecording ? 'animate-pulse' : ''}`}
          >
            {isProcessing ? (
              <Sparkles className="w-4 h-4 animate-spin" />
            ) : isRecording ? (
              <MicOff className="w-4 h-4" />
            ) : (
              <Mic className="w-4 h-4" />
            )}
          </Button>
          
          {/* Send Button */}
          <Button 
            onClick={handleSend} 
            disabled={!input.trim() || isLoading || isRecording}
          >
            {isLoading ? (
              <Sparkles className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </Button>
        </div>
        
        {/* Recording Status */}
        {isRecording && (
          <div className="mt-2 text-center">
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
              Recording... Tap mic to stop
            </div>
          </div>
        )}
        
        {isProcessing && (
          <div className="mt-2 text-center">
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <Sparkles className="w-4 h-4 animate-spin" />
              Converting speech to text...
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MobileChat;
