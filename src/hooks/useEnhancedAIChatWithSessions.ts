import { useState, useEffect, useCallback } from 'react';
import { useEnhancedAIChat, ChatMessage } from './useEnhancedAIChat';
import { useAIActions, AIAction } from './useAIActions';
import { useToast } from './useToast';
import { ChatSession } from '@/components/Chat/ChatHistoryPanel';

export interface EnhancedChatMessage extends ChatMessage {
  actions?: AIAction[];
  actionResults?: any[];
}

interface StoredChatSession {
  id: string;
  title: string;
  messages: EnhancedChatMessage[];
  createdAt: string;
  updatedAt: string;
}

// Define the JSON schema for AI action responses
const ACTION_SCHEMA = {
  name: "ai_response_with_actions",
  schema: {
    type: "object",
    properties: {
      message: {
        type: "string",
        description: "The conversational response to the user"
      },
      actions: {
        type: "array",
        items: {
          type: "object",
          properties: {
            type: {
              type: "string",
              enum: [
                "create_note", "set_reminder", "search_notes", "update_note", "delete_note",
                "improve_text", "summarize_text", "translate_text", "check_grammar", 
                "adjust_tone", "expand_content", "extract_keywords"
              ]
            },
            data: {
              type: "object",
              description: "The data needed to execute the action"
            },
            message: {
              type: "string",
              description: "Optional message about this specific action"
            }
          },
          required: ["type", "data"]
        }
      },
      needs_clarification: {
        type: "boolean",
        description: "Whether the AI needs more information from the user"
      },
      clarification_question: {
        type: "string",
        description: "Question to ask user if clarification is needed"
      }
    },
    required: ["message"]
  }
};

const STORAGE_KEY = 'ai_chat_sessions';
const CURRENT_SESSION_KEY = 'current_ai_chat_session';

export const useEnhancedAIChatWithSessions = () => {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<EnhancedChatMessage[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const { sendStructuredMessage, isLoading } = useEnhancedAIChat();
  const { executeAction, isExecuting } = useAIActions();
  const { toast } = useToast();

  // Load sessions from localStorage
  const loadSessions = useCallback(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      const currentSession = localStorage.getItem(CURRENT_SESSION_KEY);
      
      if (stored) {
        const storedSessions: StoredChatSession[] = JSON.parse(stored);
        const sessions: ChatSession[] = storedSessions.map(session => ({
          id: session.id,
          title: session.title,
          lastMessage: session.messages[session.messages.length - 1]?.content || 'No messages',
          messageCount: session.messages.length,
          createdAt: new Date(session.createdAt),
          updatedAt: new Date(session.updatedAt)
        }));
        
        setSessions(sessions);
        
        // Load current session if exists
        if (currentSession && storedSessions.find(s => s.id === currentSession)) {
          setCurrentSessionId(currentSession);
          const session = storedSessions.find(s => s.id === currentSession);
          if (session) {
            const messagesWithDates = session.messages.map(msg => ({
              ...msg,
              timestamp: new Date(msg.timestamp)
            }));
            setMessages(messagesWithDates);
          }
        }
      }
    } catch (error) {
      console.error('Error loading sessions:', error);
    }
  }, []);

  // Save sessions to localStorage
  const saveSessions = useCallback((updatedSessions: ChatSession[], sessionMessages: Record<string, EnhancedChatMessage[]>) => {
    try {
      const storedSessions: StoredChatSession[] = updatedSessions.map(session => ({
        id: session.id,
        title: session.title,
        messages: sessionMessages[session.id] || [],
        createdAt: session.createdAt.toISOString(),
        updatedAt: session.updatedAt.toISOString()
      }));
      
      localStorage.setItem(STORAGE_KEY, JSON.stringify(storedSessions));
    } catch (error) {
      console.error('Error saving sessions:', error);
    }
  }, []);

  // Generate a title from the first user message
  const generateSessionTitle = (firstMessage: string): string => {
    const words = firstMessage.split(' ').slice(0, 6).join(' ');
    return words.length > 50 ? words.substring(0, 50) + '...' : words;
  };

  // Create new session
  const createNewSession = useCallback(() => {
    const newSessionId = Date.now().toString();
    const newSession: ChatSession = {
      id: newSessionId,
      title: 'New Chat',
      lastMessage: 'No messages',
      messageCount: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    setSessions(prev => [newSession, ...prev]);
    setCurrentSessionId(newSessionId);
    setMessages([]);
    localStorage.setItem(CURRENT_SESSION_KEY, newSessionId);
  }, []);

  // Load session
  const loadSession = useCallback((sessionId: string) => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const storedSessions: StoredChatSession[] = JSON.parse(stored);
        const session = storedSessions.find(s => s.id === sessionId);
        if (session) {
          const messagesWithDates = session.messages.map(msg => ({
            ...msg,
            timestamp: new Date(msg.timestamp)
          }));
          setMessages(messagesWithDates);
          setCurrentSessionId(sessionId);
          localStorage.setItem(CURRENT_SESSION_KEY, sessionId);
        }
      }
    } catch (error) {
      console.error('Error loading session:', error);
    }
  }, []);

  // Delete session
  const deleteSession = useCallback((sessionId: string) => {
    setSessions(prev => {
      const updated = prev.filter(s => s.id !== sessionId);
      
      // If we're deleting the current session, switch to the next one
      if (currentSessionId === sessionId) {
        if (updated.length > 0) {
          const nextSession = updated[0];
          setCurrentSessionId(nextSession.id);
          loadSession(nextSession.id);
        } else {
          setCurrentSessionId(null);
          setMessages([]);
          localStorage.removeItem(CURRENT_SESSION_KEY);
        }
      }
      
      // Update localStorage
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          const storedSessions: StoredChatSession[] = JSON.parse(stored);
          const filteredSessions = storedSessions.filter(s => s.id !== sessionId);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredSessions));
        }
      } catch (error) {
        console.error('Error updating localStorage after delete:', error);
      }
      
      return updated;
    });
    
    toast.success('Chat session deleted');
  }, [currentSessionId, loadSession, toast]);

  // Rename session
  const renameSession = useCallback((sessionId: string, newTitle: string) => {
    setSessions(prev => {
      const updated = prev.map(session => 
        session.id === sessionId 
          ? { ...session, title: newTitle, updatedAt: new Date() }
          : session
      );
      
      // Update localStorage
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          const storedSessions: StoredChatSession[] = JSON.parse(stored);
          const updatedStored = storedSessions.map(session => 
            session.id === sessionId 
              ? { ...session, title: newTitle, updatedAt: new Date().toISOString() }
              : session
          );
          localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedStored));
        }
      } catch (error) {
        console.error('Error updating localStorage after rename:', error);
      }
      
      return updated;
    });
  }, []);

  // Update current session in storage
  const updateCurrentSession = useCallback((newMessages: EnhancedChatMessage[]) => {
    if (!currentSessionId) return;

    setSessions(prev => {
      const updated = prev.map(session => {
        if (session.id === currentSessionId) {
          const lastMessage = newMessages[newMessages.length - 1];
          let title = session.title;
          
          // Auto-generate title from first user message if still default
          if (title === 'New Chat' && newMessages.length > 0) {
            const firstUserMessage = newMessages.find(m => m.isUser);
            if (firstUserMessage) {
              title = generateSessionTitle(firstUserMessage.content);
            }
          }
          
          return {
            ...session,
            title,
            lastMessage: lastMessage?.content || 'No messages',
            messageCount: newMessages.length,
            updatedAt: new Date()
          };
        }
        return session;
      });

      // Save to localStorage
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        const storedSessions: StoredChatSession[] = stored ? JSON.parse(stored) : [];
        
        const sessionMessages: Record<string, EnhancedChatMessage[]> = {};
        storedSessions.forEach(session => {
          sessionMessages[session.id] = session.messages;
        });
        sessionMessages[currentSessionId] = newMessages;

        saveSessions(updated, sessionMessages);
      } catch (error) {
        console.error('Error saving session:', error);
      }

      return updated;
    });
  }, [currentSessionId, generateSessionTitle, saveSessions]);

  const sendMessageWithActions = async (userMessage: string): Promise<void> => {
    // Create new session if none exists
    if (!currentSessionId) {
      createNewSession();
      // Wait for the session to be created
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    setIsProcessing(true);
    
    try {
      // Add user message
      const newUserMessage: EnhancedChatMessage = {
        id: Date.now().toString(),
        content: userMessage,
        isUser: true,
        timestamp: new Date()
      };

      const updatedMessages = [...messages, newUserMessage];
      setMessages(updatedMessages);

      // Build context for AI with conversation history and system prompt
      const systemPrompt = `You are an intelligent note-taking, productivity, and writing assistant. You can help users:

1. PRODUCTIVITY ACTIONS:
   - CREATE NOTES: When users want to save information, create notes, or write something down
   - SET REMINDERS: When users mention future events, deadlines, or want to be reminded of something
   - SEARCH NOTES: When users ask about finding existing information or notes
   - UPDATE NOTES: When users want to modify existing notes
   - DELETE NOTES: When users want to remove notes

2. WRITING ASSISTANT ACTIONS:
   - IMPROVE TEXT: Make text clearer, more engaging, and better structured
   - SUMMARIZE TEXT: Create concise summaries of long content
   - TRANSLATE TEXT: Translate text to different languages
   - CHECK GRAMMAR: Fix grammar, spelling, and punctuation errors
   - ADJUST TONE: Change the tone to be more professional, casual, formal, etc.
   - EXPAND CONTENT: Add more detail, examples, and context to brief text
   - EXTRACT KEYWORDS: Identify key terms and phrases from content

IMPORTANT INSTRUCTIONS:
- Parse user intent carefully and suggest appropriate actions
- For reminders, always include a specific date/time in ISO format
- For note creation, extract a meaningful title and content
- For writing tasks, identify the text to process and the desired outcome
- If you need more information, set needs_clarification: true
- Always provide a helpful conversational response
- Be proactive in suggesting actions based on context

Current conversation context: The user is chatting with an AI assistant that can take actions and help with writing tasks.`;

      const contextMessages: ChatMessage[] = [
        {
          id: 'system',
          content: systemPrompt,
          isUser: false,
          timestamp: new Date()
        },
        ...messages.slice(-5), // Last 5 messages for context
        newUserMessage
      ];

      // Get structured response from AI
      console.log('Sending structured message to AI...');
      const aiResponseJson = await sendStructuredMessage(contextMessages, ACTION_SCHEMA);
      
      let parsedResponse;
      try {
        parsedResponse = JSON.parse(aiResponseJson);
      } catch (parseError) {
        console.error('Failed to parse AI response:', parseError);
        throw new Error('AI returned invalid response format');
      }

      // Create AI message
      const aiMessage: EnhancedChatMessage = {
        id: (Date.now() + 1).toString(),
        content: parsedResponse.message || aiResponseJson,
        isUser: false,
        timestamp: new Date(),
        actions: parsedResponse.actions || []
      };

      const messagesWithAI = [...updatedMessages, aiMessage];
      setMessages(messagesWithAI);

      // Execute actions if any
      if (parsedResponse.actions && parsedResponse.actions.length > 0) {
        console.log('Executing actions:', parsedResponse.actions);
        const actionResults = [];
        
        for (const action of parsedResponse.actions) {
          try {
            const result = await executeAction(action);
            actionResults.push(result);
            
            if (result.success) {
              console.log(`Action ${action.type} executed successfully:`, result);
            } else {
              console.error(`Action ${action.type} failed:`, result.message);
              toast.error(`Action failed: ${result.message}`);
            }
          } catch (error: any) {
            console.error(`Error executing action ${action.type}:`, error);
            actionResults.push({
              success: false,
              message: error.message
            });
          }
        }

        // Update the AI message with action results
        const finalMessages = messagesWithAI.map(msg => 
          msg.id === aiMessage.id 
            ? { ...msg, actionResults }
            : msg
        );
        setMessages(finalMessages);

        // Provide feedback about completed actions
        const successfulActions = actionResults.filter(r => r.success);
        const failedActions = actionResults.filter(r => !r.success);
        
        if (successfulActions.length > 0) {
          const feedbackMessage: EnhancedChatMessage = {
            id: (Date.now() + 2).toString(),
            content: `✅ Completed ${successfulActions.length} action(s) successfully!`,
            isUser: false,
            timestamp: new Date()
          };
          const finalWithFeedback = [...finalMessages, feedbackMessage];
          setMessages(finalWithFeedback);
          updateCurrentSession(finalWithFeedback);
        } else {
          updateCurrentSession(finalMessages);
        }

        if (failedActions.length > 0) {
          console.warn('Some actions failed:', failedActions);
        }
      } else {
        updateCurrentSession(messagesWithAI);
      }

      // Handle clarification if needed
      if (parsedResponse.needs_clarification && parsedResponse.clarification_question) {
        const clarificationMessage: EnhancedChatMessage = {
          id: (Date.now() + 3).toString(),
          content: parsedResponse.clarification_question,
          isUser: false,
          timestamp: new Date()
        };
        const finalWithClarification = [...messagesWithAI, clarificationMessage];
        setMessages(finalWithClarification);
        updateCurrentSession(finalWithClarification);
      }

    } catch (error: any) {
      console.error('Error in enhanced AI chat:', error);
      
      const errorMessage: EnhancedChatMessage = {
        id: (Date.now() + 4).toString(),
        content: `Sorry, I encountered an error: ${error.message}. Please try again.`,
        isUser: false,
        timestamp: new Date()
      };
      
      const finalMessages = [...messages, errorMessage];
      setMessages(finalMessages);
      updateCurrentSession(finalMessages);
      toast.error('AI chat error. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const clearCurrentChat = () => {
    setMessages([]);
    if (currentSessionId) {
      updateCurrentSession([]);
    }
  };

  // Load sessions on mount
  useEffect(() => {
    loadSessions();
  }, [loadSessions]);

  return {
    // Chat functionality
    messages,
    sendMessageWithActions,
    clearCurrentChat,
    isLoading: isLoading || isProcessing || isExecuting,
    
    // Session management
    sessions,
    currentSessionId,
    createNewSession,
    loadSession,
    deleteSession,
    renameSession
  };
};