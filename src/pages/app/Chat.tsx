
import React, { useState, useEffect } from 'react';
import { useAIAgents } from '@/ai/hooks/useAIAgents';
import { useSpeechToText } from '@/hooks/useSpeechToText';
import { useNotePreview } from '@/hooks/useNotePreview';
import { useUserProfile } from '@/hooks/useUserProfile';
import { useIsMobile } from '@/hooks/use-mobile';
import { PremiumChatContainer } from '@/components/Chat/PremiumChatContainer';
import { PremiumChatHeader } from '@/components/Chat/PremiumChatHeader';
import { PremiumChatMessages } from '@/components/Chat/PremiumChatMessages';
import { PremiumChatInput } from '@/components/Chat/PremiumChatInput';
import { NotePreviewPanel } from '@/components/Chat/NotePreviewPanel';
import { CanvasDrawingPanel } from '@/components/Chat/CanvasDrawingPanel';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Chat: React.FC = () => {
  const [message, setMessage] = useState('');
  const [isHistoryCollapsed, setIsHistoryCollapsed] = useState(false);
  const [activePanel, setActivePanel] = useState<'notes' | 'canvas'>('notes');
  const isMobile = useIsMobile();
  
  const { profile, isLoading: profileLoading } = useUserProfile();
  
  const { 
    messages, 
    sendMessage, 
    clearConversation, 
    isProcessing,
    currentAgent,
    availableAgents,
    currentMode,
    setMode
  } = useAIAgents();

  const {
    isRecording,
    isProcessing: isSpeechProcessing,
    startRecording,
    stopRecording,
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

  // Convert AIMessage format to EnhancedChatMessage format for compatibility
  const adaptedMessages = messages.map(msg => ({
    id: msg.id,
    content: msg.content,
    isUser: msg.role === 'user',
    timestamp: msg.timestamp,
    actions: msg.metadata?.actions as any, // Type cast to avoid conflicts
    actionResults: msg.metadata?.actionResults
  }));

  // Monitor messages for note creation to show in preview
  useEffect(() => {
    // Find the most recent AI message with action metadata (not just the last message)
    const aiMessagesWithResults = adaptedMessages.filter(msg => 
      !msg.isUser && msg.actions && msg.actions.length > 0
    );
    
    if (aiMessagesWithResults.length > 0) {
      const latestAiMessage = aiMessagesWithResults[aiMessagesWithResults.length - 1];
      
      // Look for created notes in action results
      if (latestAiMessage.actionResults) {
        latestAiMessage.actionResults.forEach((result: any, index: number) => {
          if (result.success && result.data && latestAiMessage.actions?.[index]?.type === 'create_note') {
            const note = extractNoteFromActionResult(result);
            if (note) {
              showNote(note);
            }
          }
        });
      }
    }
  }, [adaptedMessages, extractNoteFromActionResult, showNote]);

  const handleSend = async () => {
    if (message.trim() && !isProcessing) {
      await sendMessage(message, { autoDetectMode: true });
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-muted/10 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-20 left-20 w-64 h-64 bg-gradient-to-r from-primary/20 to-accent/20 rounded-full blur-3xl animate-float opacity-20" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-gradient-to-r from-accent/20 to-secondary/20 rounded-full blur-3xl animate-float-gentle opacity-15" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-quantum opacity-5 rounded-full blur-3xl animate-gradient-mesh" />
      </div>

      <div className="relative z-10 flex flex-col lg:flex-row h-screen">
        {/* Desktop: Left sidebar with chat history */}
        {!isMobile && (
          <div className="w-80 relative">
            <PremiumChatContainer className="h-full rounded-l-none border-r border-l-0">
              <div className="p-6">
                <h3 className="text-lg font-semibold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  AI Assistant
                </h3>
                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-gradient-glass border border-border/20">
                    <div className="text-sm font-medium text-foreground mb-2">
                      Current Agent: {currentAgent.name}
                    </div>
                    <div className="text-xs text-muted-foreground mb-2">
                      Mode: {currentMode}
                    </div>
                    <div className="text-xs text-success">
                      ● Online & Ready
                    </div>
                  </div>
                  
                  {adaptedMessages.length > 0 && (
                    <div className="p-3 rounded-xl bg-gradient-glass border border-border/20 hover:border-primary/20 transition-all duration-300 cursor-pointer">
                      <div className="text-sm font-medium text-foreground truncate mb-1">
                        Current Session
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {adaptedMessages.length} messages • Active
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </PremiumChatContainer>
          </div>
        )}

        {/* Main chat area */}
        <div className="flex-1 flex flex-col min-w-0">
          <div className="h-full flex flex-col p-6 max-w-5xl mx-auto w-full">
            <PremiumChatContainer className="flex-1 flex flex-col">
              <PremiumChatHeader
                profile={profile}
                profileLoading={profileLoading}
                messagesLength={adaptedMessages.length}
                onClearChat={clearConversation}
              />

              <PremiumChatMessages
                messages={adaptedMessages}
                isLoading={isProcessing}
                onQuickActionSelect={setMessage}
                profile={profile}
                profileLoading={profileLoading}
              />
            </PremiumChatContainer>

            <div className="mt-6">
              <PremiumChatInput
                message={message}
                setMessage={setMessage}
                onSend={handleSend}
                onKeyPress={handleKeyPress}
                onVoiceInput={handleVoiceInput}
                isLoading={isProcessing}
                isRecording={isRecording}
                isProcessing={isSpeechProcessing}
              />
            </div>
          </div>
        </div>

        {/* Desktop: Right sidebar with notes and canvas */}
        {!isMobile && (
          <div className="w-80 relative">
            <PremiumChatContainer className="h-full rounded-r-none border-l border-r-0">
              <Tabs defaultValue="notes" className="flex-1 flex flex-col h-full">
                <div className="px-6 pt-6">
                  <TabsList className="grid w-full grid-cols-2 bg-gradient-glass border border-border/20">
                    <TabsTrigger 
                      value="notes"
                      className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary/20 data-[state=active]:to-accent/20 data-[state=active]:text-primary"
                    >
                      Notes
                    </TabsTrigger>
                    <TabsTrigger 
                      value="canvas"
                      className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary/20 data-[state=active]:to-accent/20 data-[state=active]:text-primary"
                    >
                      Drawing
                    </TabsTrigger>
                  </TabsList>
                </div>
                
                <TabsContent value="notes" className="flex-1 mt-4 px-6 pb-6 overflow-hidden">
                  <div className="h-full bg-gradient-glass backdrop-blur-sm border border-border/20 rounded-xl">
                    <NotePreviewPanel
                      note={currentNote}
                      isVisible={isPreviewVisible}
                      onToggleVisibility={toggleVisibility}
                      onNoteUpdate={updateNote}
                      onRequestModification={requestModification}
                      isModifying={isModifying}
                      className="w-full h-full"
                    />
                  </div>
                </TabsContent>
                
                <TabsContent value="canvas" className="flex-1 mt-4 px-6 pb-6 overflow-hidden">
                  <div className="h-full bg-gradient-glass backdrop-blur-sm border border-border/20 rounded-xl">
                    <CanvasDrawingPanel
                      isVisible={isPreviewVisible}
                      onToggleVisibility={toggleVisibility}
                      className="w-full h-full"
                    />
                  </div>
                </TabsContent>
              </Tabs>
            </PremiumChatContainer>
          </div>
        )}

        {/* Mobile: Panel switcher */}
        {isMobile && activePanel === 'canvas' && (
          <div className="fixed inset-0 bg-background z-50">
            <PremiumChatContainer className="h-full rounded-none border-0">
              <div className="flex items-center justify-between p-6 border-b border-border/20">
                <h2 className="text-xl font-semibold capitalize bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  Drawing
                </h2>
                <button
                  onClick={() => setActivePanel('notes')}
                  className="text-muted-foreground hover:text-foreground transition-colors duration-200"
                >
                  Back to Chat
                </button>
              </div>
              
              <div className="flex-1 p-6">
                <CanvasDrawingPanel
                  isVisible={isPreviewVisible}
                  onToggleVisibility={toggleVisibility}
                  className="w-full h-full"
                />
              </div>
            </PremiumChatContainer>
          </div>
        )}

        {/* Mobile: Bottom navigation */}
        {isMobile && (
          <div className="border-t border-border/20 bg-gradient-glass backdrop-blur-xl p-4">
            <div className="flex justify-center gap-4">
              <button
                onClick={() => setActivePanel('notes')}
                className="px-6 py-3 text-sm rounded-xl bg-gradient-glass border border-border/20 text-muted-foreground hover:text-foreground hover:border-primary/20 transition-all duration-300"
              >
                Notes
              </button>
              <button
                onClick={() => setActivePanel('canvas')}
                className="px-6 py-3 text-sm rounded-xl bg-gradient-glass border border-border/20 text-muted-foreground hover:text-foreground hover:border-primary/20 transition-all duration-300"
              >
                Drawing
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Chat;
