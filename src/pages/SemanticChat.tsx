import React from 'react';
import SemanticChatInterface from '@/components/Chat/SemanticChatInterface';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Brain, MessageSquare, History, Lightbulb } from 'lucide-react';

const SemanticChat: React.FC = () => {
  return (
    <div className="h-screen bg-gradient-to-br from-background to-muted/20">
      {/* Feature Overview - shown briefly on first load */}
      <div className="absolute inset-0 z-10 bg-background/80 backdrop-blur-sm flex items-center justify-center opacity-0 animate-fade-in pointer-events-none" 
           style={{ animation: 'fadeOut 3s ease-in-out forwards' }}>
        <div className="max-w-4xl mx-auto p-8">
          <div className="text-center mb-8">
            <Brain className="w-16 h-16 mx-auto mb-4 text-primary" />
            <h1 className="text-4xl font-bold mb-2">Semantic Chat</h1>
            <p className="text-xl text-muted-foreground">
              AI assistant with advanced memory and context awareness
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="border-primary/20">
              <CardHeader className="text-center">
                <MessageSquare className="w-8 h-8 mx-auto mb-2 text-primary" />
                <CardTitle className="text-lg">Smart Conversations</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Have natural conversations with AI that remembers context and provides relevant responses
                </CardDescription>
              </CardContent>
            </Card>
            
            <Card className="border-primary/20">
              <CardHeader className="text-center">
                <History className="w-8 h-8 mx-auto mb-2 text-primary" />
                <CardTitle className="text-lg">Persistent Memory</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Your conversations are stored and can be referenced in future chats for better context
                </CardDescription>
              </CardContent>
            </Card>
            
            <Card className="border-primary/20">
              <CardHeader className="text-center">
                <Lightbulb className="w-8 h-8 mx-auto mb-2 text-primary" />
                <CardTitle className="text-lg">Semantic Search</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Find similar past conversations and relevant information using advanced vector search
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      
      {/* Main Chat Interface */}
      <SemanticChatInterface />
      
      <style>{`
        @keyframes fadeOut {
          0% { opacity: 0; }
          20% { opacity: 1; }
          80% { opacity: 1; }
          100% { opacity: 0; pointer-events: none; }
        }
        
        .animate-fade-in {
          animation: fadeOut 3s ease-in-out forwards;
        }
      `}</style>
    </div>
  );
};

export default SemanticChat;