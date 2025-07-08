import { useState, useCallback, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  session_id: string;
}

export interface ChatSession {
  id: string;
  title: string;
  created_at: string;
  updated_at: string;
  user_id: string;
  metadata?: Record<string, any>;
}

export const useSemanticChat = () => {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [currentSession, setCurrentSession] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadSessions = useCallback(async () => {
    try {
      // Since chat_sessions table doesn't exist, return empty array for now
      // TODO: Create chat_sessions table if semantic chat functionality is needed
      console.warn('Chat sessions table not available in current schema');
      setSessions([]);
    } catch (err) {
      console.error('Error loading sessions:', err);
      setSessions([]);
    }
  }, []);

  const loadMessages = useCallback(async (sessionId: string) => {
    try {
      // Since chat_messages table doesn't exist, return empty array for now
      console.warn('Chat messages table not available in current schema');
      setMessages([]);
    } catch (err) {
      console.error('Error loading messages:', err);
      setMessages([]);
    }
  }, []);

  const createSession = useCallback(async (title: string): Promise<string | null> => {
    try {
      // Since chat_sessions table doesn't exist, return mock session ID
      console.warn('Cannot create chat session - table missing');
      const mockSessionId = `mock-session-${Date.now()}`;
      return mockSessionId;
    } catch (err) {
      console.error('Error creating session:', err);
      return null;
    }
  }, []);

  const sendMessage = useCallback(async (content: string, sessionId: string): Promise<ChatMessage | null> => {
    try {
      setIsLoading(true);
      console.warn('Cannot send chat message - chat functionality disabled');
      
      // Return mock message for now
      const mockMessage: ChatMessage = {
        id: `mock-${Date.now()}`,
        role: 'user',
        content,
        timestamp: new Date().toISOString(),
        session_id: sessionId
      };
      
      return mockMessage;
    } catch (err) {
      console.error('Error sending message:', err);
      setError('Failed to send message');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const deleteSession = useCallback(async (sessionId: string): Promise<boolean> => {
    try {
      console.warn('Cannot delete chat session - table missing');
      return true;
    } catch (err) {
      console.error('Error deleting session:', err);
      return false;
    }
  }, []);

  const clearHistory = useCallback(async (): Promise<boolean> => {
    try {
      setSessions([]);
      setMessages([]);
      setCurrentSession(null);
      return true;
    } catch (err) {
      console.error('Error clearing history:', err);
      return false;
    }
  }, []);

  useEffect(() => {
    loadSessions();
  }, [loadSessions]);

  useEffect(() => {
    if (currentSession) {
      loadMessages(currentSession);
    }
  }, [currentSession, loadMessages]);

  return {
    sessions,
    messages,
    currentSession,
    isLoading,
    error,
    setCurrentSession,
    loadSessions,
    loadMessages,
    createSession,
    sendMessage,
    deleteSession,
    clearHistory,
    setError
  };
};