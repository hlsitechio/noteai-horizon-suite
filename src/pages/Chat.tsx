
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Send, MessageCircle, Sparkles, Clock, FileText, Search, Trash2, Mic, MicOff, PenTool, Languages, Zap, BookOpen, Filter, Type } from 'lucide-react';
import { useEnhancedAIChatWithActions, EnhancedChatMessage } from '../hooks/useEnhancedAIChatWithActions';
import { useSpeechToText } from '../hooks/useSpeechToText';
import FormattedMessage from '../components/Chat/FormattedMessage';

const Chat: React.FC = () => {
  const [message, setMessage] = useState('');
  const { 
    messages, 
    sendMessageWithActions, 
    clearChat, 
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
    if (message.trim() && !isLoading) {
      await sendMessageWithActions(message);
      setMessage('');
    }
  };

  const handleVoiceInput = async () => {
    if (isRecording) {
      // Stop recording and get transcription
      const transcription = await stopRecording();
      if (transcription) {
        setMessage(transcription);
      }
    } else {
      // Start recording
      const success = await startRecording();
      if (!success) {
        console.error('Failed to start recording');
      }
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
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

  const quickActions = [
    "Create a note about today's meeting",
    "Remind me to call John tomorrow at 2pm",
    "Find my notes about project planning",
    "Set a reminder for my dentist appointment next week",
    "Improve this text: Writing can be hard sometimes",
    "Summarize this paragraph: [paste your text here]",
    "Translate this to Spanish: Hello, how are you?",
    "Check grammar: Their going to the store tomorrow"
  ];

  return (
    <div className="h-full flex flex-col">
      <div className="flex-shrink-0 mb-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-primary" />
                Enhanced AI Assistant
              </div>
              {messages.length > 0 && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={clearChat}
                  className="text-xs"
                >
                  Clear Chat
                </Button>
              )}
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      <div className="flex-1 flex flex-col min-h-0">
        <Card className="flex-1 flex flex-col">
          <CardContent className="flex-1 flex flex-col p-4">
            <ScrollArea className="flex-1 mb-4">
              <div className="space-y-4">
                {messages.length === 0 ? (
                  <div className="text-center text-muted-foreground py-8">
                    <Sparkles className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p className="mb-4">I can help you create notes, set reminders, organize your thoughts, and assist with writing tasks!</p>
                    <div className="grid grid-cols-1 gap-2 max-w-md mx-auto">
                      {quickActions.map((action, index) => (
                        <Button 
                          key={index}
                          variant="outline" 
                          size="sm"
                          onClick={() => setMessage(action)}
                          className="text-left justify-start h-auto py-2 px-3 text-xs"
                        >
                          {action}
                        </Button>
                      ))}
                    </div>
                  </div>
                ) : (
                  messages.map((msg: EnhancedChatMessage, index) => (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${msg.isUser ? 'items-end' : 'items-start'}`}
                    >
                      <div
                        className={`max-w-[80%] p-3 rounded-lg ${
                          msg.isUser
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted'
                        }`}
                      >
                        <FormattedMessage content={msg.content} isUser={msg.isUser} />
                        
                        {/* Show actions that were executed */}
                        {msg.actions && msg.actions.length > 0 && (
                          <div className="mt-2 space-y-1">
                            {msg.actions.map((action, actionIndex) => (
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
                      </div>
                      
                      {/* Show timestamp */}
                      <div className="text-xs text-muted-foreground mt-1 px-1">
                        {msg.timestamp.toLocaleTimeString()}
                      </div>
                    </div>
                  ))
                )}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-muted p-3 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <Sparkles className="w-4 h-4 animate-spin text-primary" />
                        <span className="text-sm text-muted-foreground">AI is thinking and taking actions...</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>

            <div className="space-y-2">
              <div className="flex gap-2 items-center">
                <Input
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder={isRecording ? "Listening..." : "Ask me to create notes, set reminders, improve text, summarize content..."}
                  disabled={isLoading || isRecording}
                  className="flex-1"
                />
                
                {/* Voice Input Button */}
                <Button 
                  variant={isRecording ? "destructive" : "outline"}
                  size="sm"
                  onClick={handleVoiceInput}
                  disabled={isLoading || isProcessing}
                  className={`shrink-0 ${isRecording ? 'animate-pulse' : ''}`}
                  type="button"
                >
                  {isProcessing ? (
                    <Sparkles className="w-4 h-4 animate-spin" />
                  ) : isRecording ? (
                    <MicOff className="w-4 h-4" />
                  ) : (
                    <Mic className="w-4 h-4" />
                  )}
                </Button>
                
                <Button
                  onClick={handleSend}
                  disabled={isLoading || !message.trim() || isRecording}
                  size="sm"
                  className="shrink-0"
                  type="button"
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
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                    <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                    Recording... Click mic to stop
                  </div>
                </div>
              )}
              
              {isProcessing && (
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                    <Sparkles className="w-4 h-4 animate-spin" />
                    Converting speech to text...
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Chat;
