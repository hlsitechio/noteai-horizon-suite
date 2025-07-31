import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Mic, 
  MicOff, 
  Phone, 
  PhoneOff, 
  Volume2, 
  VolumeX, 
  MessageCircle,
  Sparkles,
  Timer,
  Signal
} from 'lucide-react';
import { useRealtimeVoiceChat, VoiceMessage } from '@/hooks/useRealtimeVoiceChat';
import { Input } from '@/components/ui/input';

const VoiceChatInterface: React.FC = () => {
  const [textMessage, setTextMessage] = useState('');
  
  const {
    isConnected,
    isLoading,
    connect,
    disconnect,
    isRecording,
    startRecording,
    stopRecording,
    isPlaying,
    messages,
    currentSession,
    sendTextMessage,
    clearMessages
  } = useRealtimeVoiceChat();

  const handleConnect = async () => {
    if (isConnected) {
      disconnect();
    } else {
      await connect();
    }
  };

  const handleRecording = async () => {
    if (isRecording) {
      stopRecording();
    } else {
      await startRecording();
    }
  };

  const handleSendText = () => {
    if (textMessage.trim()) {
      sendTextMessage(textMessage);
      setTextMessage('');
    }
  };

  const formatDuration = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    return `${minutes}:${String(seconds % 60).padStart(2, '0')}`;
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <Card className="mb-4">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <Sparkles className="w-6 h-6 text-primary" />
                {isConnected && (
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                )}
              </div>
              <div>
                <h2 className="text-xl font-semibold">Real-Time Voice Chat</h2>
                <p className="text-sm text-muted-foreground font-normal">
                  Natural voice conversations with AI
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Badge variant={isConnected ? "default" : "secondary"} className="flex items-center gap-1">
                <Signal className="w-3 h-3" />
                {isConnected ? 'Connected' : 'Disconnected'}
              </Badge>
              
              {currentSession && (
                <Badge variant="outline" className="flex items-center gap-1">
                  <Timer className="w-3 h-3" />
                  {formatDuration(Date.now() - currentSession.startTime.getTime())}
                </Badge>
              )}
            </div>
          </CardTitle>
        </CardHeader>
      </Card>

      {/* Messages */}
      <Card className="flex-1 flex flex-col">
        <CardContent className="flex-1 flex flex-col p-6">
          <ScrollArea className="flex-1 mb-4">
            <div className="space-y-4">
              {messages.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center mb-4">
                    <Volume2 className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Start a Voice Conversation</h3>
                  <p className="text-muted-foreground mb-6">
                    Connect and start talking with AI in real-time. You can speak naturally or type messages.
                  </p>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <p>• 🎤 Click the microphone to speak</p>
                    <p>• 💬 Type messages for hybrid conversation</p>
                    <p>• 🔊 AI responses will be spoken aloud</p>
                  </div>
                </div>
              ) : (
                messages.map((message: VoiceMessage, index) => (
                  <div
                    key={message.id}
                    className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}
                  >
                    <div
                      className={`max-w-[80%] p-4 rounded-2xl shadow-sm border transition-all duration-300 ${
                        message.type === 'user'
                          ? 'bg-gradient-to-br from-primary to-primary/90 text-primary-foreground border-primary/20'
                          : 'bg-gradient-to-br from-muted/80 to-muted/60 border-muted/50'
                      }`}
                    >
                      <div className="flex items-start gap-2">
                        {message.type === 'assistant' && (
                          <Volume2 className="w-4 h-4 mt-1 flex-shrink-0" />
                        )}
                        <div className="flex-1">
                          <p className="text-sm leading-relaxed">
                            {message.content.replace(' [COMPLETE]', '')}
                          </p>
                          <div className="flex items-center gap-2 mt-2">
                            <span className="text-xs opacity-70">
                              {message.timestamp.toLocaleTimeString()}
                            </span>
                            {message.type === 'assistant' && isPlaying && index === messages.length - 1 && (
                              <Badge variant="secondary" className="text-xs">
                                <Volume2 className="w-3 h-3 mr-1" />
                                Speaking...
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </ScrollArea>

          {/* Controls */}
          <div className="space-y-4">
            {/* Connection Controls */}
            <div className="flex items-center justify-center gap-4">
              <Button
                onClick={handleConnect}
                disabled={isLoading}
                size="lg"
                variant={isConnected ? "destructive" : "default"}
                className="flex items-center gap-2"
              >
                {isLoading ? (
                  <Sparkles className="w-4 h-4 animate-spin" />
                ) : isConnected ? (
                  <PhoneOff className="w-4 h-4" />
                ) : (
                  <Phone className="w-4 h-4" />
                )}
                {isLoading ? 'Connecting...' : isConnected ? 'Disconnect' : 'Connect'}
              </Button>

              {isConnected && (
                <Button
                  onClick={handleRecording}
                  disabled={!isConnected}
                  size="lg"
                  variant={isRecording ? "destructive" : "secondary"}
                  className={`flex items-center gap-2 ${isRecording ? 'animate-pulse' : ''}`}
                >
                  {isRecording ? (
                    <>
                      <MicOff className="w-4 h-4" />
                      Stop Recording
                    </>
                  ) : (
                    <>
                      <Mic className="w-4 h-4" />
                      Start Recording
                    </>
                  )}
                </Button>
              )}

              {messages.length > 0 && (
                <Button
                  onClick={clearMessages}
                  variant="outline"
                  size="sm"
                >
                  Clear Chat
                </Button>
              )}
            </div>

            {/* Text Input (Hybrid Mode) */}
            {isConnected && (
              <div className="flex gap-2">
                <Input
                  value={textMessage}
                  onChange={(e) => setTextMessage(e.target.value)}
                  placeholder="Type a message or use voice..."
                  onKeyPress={(e) => e.key === 'Enter' && handleSendText()}
                  disabled={!isConnected}
                />
                <Button
                  onClick={handleSendText}
                  disabled={!textMessage.trim() || !isConnected}
                  size="sm"
                >
                  <MessageCircle className="w-4 h-4" />
                </Button>
              </div>
            )}

            {/* Status Indicators */}
            {isConnected && (
              <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
                {isRecording && (
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                    Recording...
                  </div>
                )}
                {isPlaying && (
                  <div className="flex items-center gap-1">
                    <Volume2 className="w-3 h-3" />
                    AI Speaking...
                  </div>
                )}
                {!isRecording && !isPlaying && (
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    Ready to chat
                  </div>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default VoiceChatInterface;