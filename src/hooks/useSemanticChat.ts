import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { ChatMessage, ChatSession, ChatResponse, SemanticMemory, SimilarMessage } from '@/types/chat';

export const useSemanticChat = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [currentSession, setCurrentSession] = useState<ChatSession | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load chat sessions on mount
  useEffect(() => {
    loadSessions();
  }, []);

  // Load messages when current session changes
  useEffect(() => {
    if (currentSession) {
      loadMessages(currentSession.id);
    } else {
      setMessages([]);
    }
  }, [currentSession]);

  const loadSessions = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('chat_sessions')
        .select('*')
        .order('updated_at', { ascending: false });

      if (error) throw error;
      setSessions((data || []).map(session => ({
        ...session,
        metadata: session.metadata as Record<string, any>
      })));
    } catch (err) {
      console.error('Error loading sessions:', err);
      setError('Failed to load chat sessions');
    }
  }, []);

  const loadMessages = useCallback(async (sessionId: string) => {
    try {
      const { data, error } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('session_id', sessionId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setMessages((data || []).map(message => ({
        ...message,
        role: message.role as 'user' | 'assistant' | 'system'
      })));
    } catch (err) {
      console.error('Error loading messages:', err);
      setError('Failed to load messages');
    }
  }, []);

  const sendMessage = useCallback(async (content: string, systemPrompt?: string) => {
    if (!content.trim()) return;

    setIsLoading(true);
    setError(null);

    try {
      // Get auth token
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('Not authenticated');

      // Call semantic chat function
      const { data, error } = await supabase.functions.invoke('semantic-chat', {
        body: {
          message: content,
          sessionId: currentSession?.id,
          systemPrompt
        },
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (error) throw error;

      const response: ChatResponse = data;

      // Update current session if new one was created
      if (!currentSession && response.sessionId) {
        const { data: newSession } = await supabase
          .from('chat_sessions')
          .select('*')
          .eq('id', response.sessionId)
          .single();

        if (newSession) {
          const typedSession = {
            ...newSession,
            metadata: newSession.metadata as Record<string, any>
          };
          setCurrentSession(typedSession);
          setSessions(prev => [typedSession, ...prev]);
        }
      }

      // Reload messages to get the latest conversation
      if (response.sessionId) {
        await loadMessages(response.sessionId);
      }

      toast.success(`Message sent (${response.tokensUsed} tokens used)`);
    } catch (err) {
      console.error('Error sending message:', err);
      setError(err instanceof Error ? err.message : 'Failed to send message');
      toast.error('Failed to send message');
    } finally {
      setIsLoading(false);
    }
  }, [currentSession, loadMessages]);

  const createNewSession = useCallback(async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('chat_sessions')
        .insert({
          user_id: user.id,
          title: 'New Chat',
          metadata: {}
        })
        .select()
        .single();

      if (error) throw error;

      const typedSession = {
        ...data,
        metadata: data.metadata as Record<string, any>
      };

      setCurrentSession(typedSession);
      setSessions(prev => [typedSession, ...prev]);
      setMessages([]);
      
      toast.success('New chat session created');
    } catch (err) {
      console.error('Error creating session:', err);
      setError('Failed to create new session');
      toast.error('Failed to create new session');
    }
  }, []);

  const loadSession = useCallback(async (sessionId: string) => {
    try {
      const { data, error } = await supabase
        .from('chat_sessions')
        .select('*')
        .eq('id', sessionId)
        .single();

      if (error) throw error;
      setCurrentSession({
        ...data,
        metadata: data.metadata as Record<string, any>
      });
    } catch (err) {
      console.error('Error loading session:', err);
      setError('Failed to load session');
      toast.error('Failed to load session');
    }
  }, []);

  const deleteSession = useCallback(async (sessionId: string) => {
    try {
      const { error } = await supabase
        .from('chat_sessions')
        .delete()
        .eq('id', sessionId);

      if (error) throw error;

      setSessions(prev => prev.filter(s => s.id !== sessionId));
      
      if (currentSession?.id === sessionId) {
        setCurrentSession(null);
        setMessages([]);
      }

      toast.success('Chat session deleted');
    } catch (err) {
      console.error('Error deleting session:', err);
      setError('Failed to delete session');
      toast.error('Failed to delete session');
    }
  }, [currentSession]);

  const searchSimilarMessages = useCallback(async (query: string): Promise<SimilarMessage[]> => {
    try {
      // First generate embedding for the query
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('Not authenticated');

      // This would require an additional endpoint to generate embeddings
      // For now, return empty array - you could implement this later
      console.log('Searching for similar messages:', query);
      return [];
    } catch (err) {
      console.error('Error searching similar messages:', err);
      return [];
    }
  }, []);

  const getSemanticMemory = useCallback(async (): Promise<SemanticMemory[]> => {
    try {
      const { data, error } = await supabase
        .from('semantic_memory')
        .select('*')
        .order('importance_score', { ascending: false })
        .limit(10);

      if (error) throw error;
      return data || [];
    } catch (err) {
      console.error('Error loading semantic memory:', err);
      return [];
    }
  }, []);

  return {
    messages,
    sessions,
    currentSession,
    isLoading,
    error,
    sendMessage,
    createNewSession,
    loadSession,
    deleteSession,
    searchSimilarMessages,
    getSemanticMemory,
  };
};