
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useEnhancedAIChatWithSessions } from '@/hooks/useEnhancedAIChatWithSessions';
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

  return (
    <div className={`h-full flex ${isMobile ? 'flex-col gap-3 p-3' : 'gap-6 p-6'} bg-gradient-to-br from-background via-background to-muted/30`}>
      {/* Chat History Panel - Hidden on mobile */}
      {!isMobile && (
        <div className="flex-shrink-0">
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
            messagesLength={messages.length}
            onClearChat={clearCurrentChat}
          />

          <div className="flex-1 flex flex-col min-h-0">
            <Card className="flex-1 flex flex-col border-0 shadow-xl bg-gradient-to-br from-card/50 to-card backdrop-blur-sm">
              <CardContent className={`flex-1 flex flex-col ${isMobile ? 'p-3' : 'p-6'}`}>
                <ChatMessages
                  messages={messages}
                  isLoading={isLoading}
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
                  isLoading={isLoading}
                  isRecording={isRecording}
                  isProcessing={isProcessing}
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
