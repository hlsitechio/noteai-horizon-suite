
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useAIAgents } from '@/ai/hooks/useAIAgents';
import { useSpeechToText } from '@/hooks/useSpeechToText';
import { useNotePreview } from '@/hooks/useNotePreview';
import { useUserProfile } from '@/hooks/useUserProfile';
import { useIsMobile } from '@/hooks/use-mobile';
import ChatHistoryPanel from '@/components/Chat/ChatHistoryPanel';
import { NotePreviewPanel } from '@/components/Chat/NotePreviewPanel';
import { CanvasDrawingPanel } from '@/components/Chat/CanvasDrawingPanel';
import ChatHeader from '@/components/Chat/ChatHeader';
import ChatMessages from '@/components/Chat/ChatMessages';
import ChatInput from '@/components/Chat/ChatInput';

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
    <div className={`h-full flex ${isMobile ? 'flex-col gap-3 p-3' : 'gap-6 p-6'} bg-gradient-to-br from-background via-background to-muted/30`}>
      {/* Chat History Panel - Hidden on mobile */}
      {!isMobile && (
        <div className="flex-shrink-0">
          {/* AI Agents Panel - Temporarily disabled for now */}
          <div className="w-64 h-full bg-card/30 border rounded-lg p-4 backdrop-blur-sm">
            <h3 className="text-sm font-medium mb-2">AI Assistant</h3>
            <p className="text-xs text-muted-foreground mb-2">Current: {currentAgent.name}</p>
            <p className="text-xs text-muted-foreground">Mode: {currentMode}</p>
          </div>
        </div>
      )}

      {/* Main Content Area with Chat and Preview */}
      <div className={`flex-1 flex ${isMobile ? 'flex-col gap-3' : 'gap-6'} min-w-0`}>
        {/* Chat Messages Area */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Enhanced Header */}
          <ChatHeader
            profile={profile}
            profileLoading={profileLoading}
            messagesLength={adaptedMessages.length}
            onClearChat={clearConversation}
          />

          <div className="flex-1 flex flex-col min-h-0">
            <Card className="flex-1 flex flex-col border-0 shadow-xl bg-gradient-to-br from-card/50 to-card backdrop-blur-sm">
              <CardContent className={`flex-1 flex flex-col ${isMobile ? 'p-3' : 'p-6'}`}>
                <ChatMessages
                  messages={adaptedMessages}
                  isLoading={isProcessing}
                  onQuickActionSelect={setMessage}
                  profile={profile}
                  profileLoading={profileLoading}
                />

                <ChatInput
                  message={message}
                  setMessage={setMessage}
                  onSend={handleSend}
                  onKeyPress={handleKeyPress}
                  onVoiceInput={handleVoiceInput}
                  isLoading={isProcessing}
                  isRecording={isRecording}
                  isProcessing={isSpeechProcessing}
                />
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Enhanced Canva Panel - Switch between Notes and Drawing Canvas */}
        {!isMobile && (
          <div className="flex-shrink-0 flex flex-col">
            {/* Panel Switcher */}
            <div className="h-12 border-l border-border/30 bg-muted/10 flex items-center justify-center gap-2 px-4">
              <button
                onClick={() => setActivePanel('notes')}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-all duration-200 ${
                  activePanel === 'notes' 
                    ? 'bg-primary text-primary-foreground shadow-sm' 
                    : 'bg-transparent text-muted-foreground hover:text-foreground hover:bg-muted/50'
                }`}
              >
                Notes
              </button>
              <button
                onClick={() => setActivePanel('canvas')}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-all duration-200 ${
                  activePanel === 'canvas' 
                    ? 'bg-primary text-primary-foreground shadow-sm' 
                    : 'bg-transparent text-muted-foreground hover:text-foreground hover:bg-muted/50'
                }`}
              >
                Drawing
              </button>
            </div>
            
            {/* Panel Content */}
            <div className="flex-1">
              {activePanel === 'notes' ? (
                <NotePreviewPanel
                  note={currentNote}
                  isVisible={isPreviewVisible}
                  onToggleVisibility={toggleVisibility}
                  onNoteUpdate={updateNote}
                  onRequestModification={requestModification}
                  isModifying={isModifying}
                  className="w-96 h-full"
                />
              ) : (
                <CanvasDrawingPanel
                  isVisible={isPreviewVisible}
                  onToggleVisibility={toggleVisibility}
                  className="w-96 h-full"
                />
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Chat;
