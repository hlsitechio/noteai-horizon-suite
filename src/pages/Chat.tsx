
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Send, MessageCircle, Sparkles, Clock, FileText, Search, Trash2, Mic, MicOff, PenTool, Languages, Zap, BookOpen, Filter, Type } from 'lucide-react';
import { useEnhancedAIChatWithSessions, EnhancedChatMessage } from '../hooks/useEnhancedAIChatWithSessions';
import { useSpeechToText } from '../hooks/useSpeechToText';
import { useNotePreview } from '../hooks/useNotePreview';
import { useUserProfile } from '../hooks/useUserProfile';
import FormattedMessage from '../components/Chat/FormattedMessage';
import ChatHistoryPanel from '../components/Chat/ChatHistoryPanel';
import InteractiveNoteCard from '../components/Chat/InteractiveNoteCard';
import { NotePreviewPanel } from '../components/Chat/NotePreviewPanel';

const Chat: React.FC = () => {
  const [message, setMessage] = useState('');
  const [isHistoryCollapsed, setIsHistoryCollapsed] = useState(false);
  
  const { profile, isLoading: profileLoading } = useUserProfile();
  
  const { 
    messages, 
    sendMessageWithActions, 
    clearCurrentChat, 
    isLoading,
    sessions,
    currentSessionId,
    createNewSession,
    loadSession,
    deleteSession,
    renameSession
  } = useEnhancedAIChatWithSessions();

  const {
    isRecording,
    isProcessing,
    startRecording,
    stopRecording,
    cancelRecording,
  } = useSpeechToText();

  const {
    currentNote,
    isVisible: isPreviewVisible,
    isModifying,
    showNote,
    updateNote,
    toggleVisibility,
    requestModification,
    extractNoteFromActionResult
  } = useNotePreview();

  // Monitor messages for note creation to show in preview
  useEffect(() => {
    // Find the most recent AI message with actionResults (not just the last message)
    const aiMessagesWithResults = messages.filter(msg => 
      !msg.isUser && msg.actionResults && msg.actionResults.length > 0
    );
    
    if (aiMessagesWithResults.length > 0) {
      const latestAiMessage = aiMessagesWithResults[aiMessagesWithResults.length - 1];
      
      // Look for created notes in action results
      latestAiMessage.actionResults!.forEach((result, index) => {
        if (result.success && result.data && latestAiMessage.actions?.[index]?.type === 'create_note') {
          const note = extractNoteFromActionResult(result);
          if (note) {
            showNote(note);
          }
        }
      });
    }
  }, [messages, extractNoteFromActionResult, showNote]);

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
    {
      text: "Create a meeting notes template in the canva with agenda sections",
      icon: FileText,
      category: "Canva Templates",
      color: "text-blue-500"
    },
    {
      text: "Design a project planning note in the canva with task breakdowns",
      icon: FileText,
      category: "Canva Templates", 
      color: "text-blue-500"
    },
    {
      text: "Create a daily journal template in the canva with reflection prompts",
      icon: FileText,
      category: "Canva Templates",
      color: "text-blue-500"
    },
    {
      text: "Build a study notes template in the canva with summary sections",
      icon: FileText,
      category: "Canva Templates",
      color: "text-blue-500"
    },
    {
      text: "Create a recipe note in the canva with ingredients and steps",
      icon: FileText,
      category: "Canva Templates",
      color: "text-blue-500"
    },
    {
      text: "Design a travel itinerary note in the canva with day-by-day planning",
      icon: FileText,
      category: "Canva Templates",
      color: "text-blue-500"
    },
    {
      text: "Find my notes about project planning",
      icon: Search,
      category: "Search",
      color: "text-green-500"
    },
    {
      text: "Set a reminder for my dentist appointment next week",
      icon: Clock,
      category: "Reminders",
      color: "text-orange-500"
    },
    {
      text: "Improve this text: Writing can be hard sometimes",
      icon: PenTool,
      category: "Writing",
      color: "text-purple-500"
    },
    {
      text: "Summarize this paragraph: [paste your text here]",
      icon: BookOpen,
      category: "Writing",
      color: "text-purple-500"
    },
    {
      text: "Translate this to Spanish: Hello, how are you?",
      icon: Languages,
      category: "Language",
      color: "text-pink-500"
    },
    {
      text: "Check grammar: Their going to the store tomorrow",
      icon: Zap,
      category: "Writing",
      color: "text-purple-500"
    }
  ];

  return (
    <div className="h-full flex gap-6 p-6 bg-gradient-to-br from-background via-background to-muted/30">
      {/* Chat History Panel */}
      <ChatHistoryPanel
        sessions={sessions}
        currentSessionId={currentSessionId}
        onSessionSelect={loadSession}
        onNewSession={createNewSession}
        onDeleteSession={deleteSession}
        onRenameSession={renameSession}
        isCollapsed={isHistoryCollapsed}
        onToggleCollapse={() => setIsHistoryCollapsed(!isHistoryCollapsed)}
      />

      {/* Main Content Area with Chat and Preview */}
      <div className="flex-1 flex gap-6">
        {/* Chat Messages Area */}
        <div className="flex-1 flex flex-col">
          {/* Enhanced Header */}
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
                  {messages.length > 0 && (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={clearCurrentChat}
                      className="text-xs hover:bg-destructive/10 hover:text-destructive hover:border-destructive/20 transition-all duration-200"
                    >
                      Clear Chat
                    </Button>
                  )}
                </CardTitle>
              </CardHeader>
            </div>
          </div>

          <div className="flex-1 flex flex-col min-h-0">
            <Card className="flex-1 flex flex-col border-0 shadow-xl bg-gradient-to-br from-card/50 to-card backdrop-blur-sm">
              <CardContent className="flex-1 flex flex-col p-6">
                <ScrollArea className="flex-1 mb-6 pr-4">
                  <div className="space-y-6">
                    {messages.length === 0 ? (
                      <div className="text-center py-12">
                        <div className="relative mb-8">
                          <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-primary/20 via-accent/10 to-primary/20 flex items-center justify-center backdrop-blur-sm border border-primary/20">
                            <Sparkles className="w-10 h-10 text-primary" />
                          </div>
                          <div className="absolute inset-0 w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-primary/10 to-accent/10 animate-pulse"></div>
                        </div>
                        <h3 className="text-2xl font-bold text-foreground mb-3 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                          {profile && !profileLoading 
                            ? `Welcome back, ${profile.display_name}!` 
                            : 'Welcome to AI Assistant'
                          }
                        </h3>
                        <p className="text-muted-foreground mb-12 max-w-lg mx-auto leading-relaxed">
                          {profile && !profileLoading 
                            ? `Hi ${profile.display_name}! I can help you create notes in the canva, set reminders, organize your thoughts, and assist with writing tasks! Ask me to create notes in the canva for real-time editing.`
                            : 'I can help you create notes in the canva, set reminders, organize your thoughts, and assist with writing tasks! Ask me to create notes in the canva for real-time editing.'
                          }
                        </p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl mx-auto">
                          {quickActions.map((action, index) => {
                            const IconComponent = action.icon;
                            return (
                              <Card
                                key={index}
                                className="group cursor-pointer transition-all duration-300 hover:shadow-xl hover:scale-[1.02] border-muted/30 hover:border-primary/30 bg-gradient-to-br from-card to-card/50 backdrop-blur-sm overflow-hidden relative"
                                onClick={() => setMessage(action.text)}
                              >
                                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                <CardContent className="p-5 relative z-10">
                                  <div className="flex items-start gap-4">
                                    <div className={`p-3 rounded-xl bg-gradient-to-br from-muted/50 to-muted/30 group-hover:from-primary/20 group-hover:to-accent/20 transition-all duration-300 ${action.color}`}>
                                      <IconComponent className="w-5 h-5" />
                                    </div>
                                    <div className="flex-1 text-left">
                                      <div className="flex items-center gap-2 mb-2">
                                        <Badge variant="secondary" className="text-xs font-medium bg-gradient-to-r from-muted to-muted/50">
                                          {action.category}
                                        </Badge>
                                      </div>
                                      <p className="text-sm text-foreground leading-relaxed font-medium">
                                        {action.text}
                                      </p>
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>
                            );
                          })}
                        </div>
                      </div>
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

                <div className="space-y-4">
                  <div className="flex gap-3 items-end">
                    <div className="flex-1 relative">
                      <Input
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyPress={handleKeyPress}
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
                      onClick={handleVoiceInput}
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
                      onClick={handleSend}
                      disabled={isLoading || !message.trim() || isRecording}
                      size="lg"
                      className="h-12 px-6 rounded-xl bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-lg hover:shadow-xl transition-all duration-200"
                      type="button"
                    >
                      {isLoading ? (
                        <Sparkles className="w-5 h-5 animate-spin" />
                      ) : (
                        <div className="flex items-center gap-2">
                          <Send className="w-5 h-5" />
                          <span className="font-medium">Send</span>
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
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Note Canva Panel */}
        <NotePreviewPanel
          note={currentNote}
          isVisible={isPreviewVisible}
          onToggleVisibility={toggleVisibility}
          onNoteUpdate={updateNote}
          onRequestModification={requestModification}
          isModifying={isModifying}
          className="w-96"
        />
      </div>
    </div>
  );
};

export default Chat;
