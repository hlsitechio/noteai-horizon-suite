import { useState, useCallback, useRef, useEffect } from 'react';
import { AgentCoordinator } from '../core/AgentCoordinator';
import { ChatMode, UserProfile, TaskContext, AgentResponse, AIMessage } from '../types';
import { useToast } from '@/hooks/useToast';

export interface AIAgentsState {
  messages: AIMessage[];
  isProcessing: boolean;
  currentAgent: { id: string; name: string };
  availableAgents: Array<{ id: string; name: string; description: string }>;
  currentMode: ChatMode;
  error: string | null;
}

const STORAGE_KEY = 'ai_agents_conversation';

export const useAIAgents = () => {
  const [state, setState] = useState<AIAgentsState>({
    messages: [],
    isProcessing: false,
    currentAgent: { id: 'general-agent', name: 'General Assistant' },
    availableAgents: [],
    currentMode: 'general',
    error: null
  });

  const coordinatorRef = useRef<AgentCoordinator | null>(null);
  const { toast } = useToast();

  // Load conversation from localStorage
  const loadConversation = useCallback(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const messages: AIMessage[] = JSON.parse(stored);
        return messages;
      }
    } catch (error) {
      console.warn('Failed to load conversation from localStorage:', error);
    }
    return [];
  }, []);

  // Save conversation to localStorage
  const saveConversation = useCallback((messages: AIMessage[]) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    } catch (error) {
      console.warn('Failed to save conversation to localStorage:', error);
    }
  }, []);

  // Initialize the coordinator
  useEffect(() => {
    if (!coordinatorRef.current) {
      coordinatorRef.current = new AgentCoordinator();
      
      // Load existing conversation
      const savedMessages = loadConversation();
      if (savedMessages.length > 0) {
        // Restore conversation history in the coordinator
        coordinatorRef.current.restoreConversationHistory(savedMessages);
      }
      
      // Update available agents and messages
      setState(prev => ({
        ...prev,
        messages: savedMessages,
        availableAgents: coordinatorRef.current!.getAvailableAgents(),
        currentAgent: coordinatorRef.current!.getCurrentAgent()
      }));
    }
  }, [loadConversation]);

  const sendMessage = useCallback(async (
    message: string, 
    options?: {
      mode?: ChatMode;
      userProfile?: UserProfile;
      taskContext?: TaskContext;
      autoDetectMode?: boolean;
    }
  ): Promise<void> => {
    if (!coordinatorRef.current) return;

    setState(prev => ({ ...prev, isProcessing: true, error: null }));

    try {
      // Auto-detect mode if requested
      let mode = options?.mode || state.currentMode;
      if (options?.autoDetectMode) {
        mode = coordinatorRef.current.getRecommendedMode(message);
      }

      // Process the message
      const response: AgentResponse = await coordinatorRef.current.processMessage(
        message,
        mode,
        options?.userProfile,
        options?.taskContext
      );

      // Update conversation history
      const history = coordinatorRef.current.getConversationHistory();
      
      // Save to localStorage
      saveConversation(history);
      
      setState(prev => ({
        ...prev,
        messages: history,
        currentAgent: coordinatorRef.current!.getCurrentAgent(),
        currentMode: mode,
        isProcessing: false
      }));

      // Show success toast if actions were executed
      if (response.actions && response.actions.length > 0) {
        toast.success(`Executed ${response.actions.length} action(s) successfully!`);
      }

      // Show follow-up suggestions if any
      if (response.suggestedFollowUps && response.suggestedFollowUps.length > 0) {
        console.log('Suggested follow-ups:', response.suggestedFollowUps);
      }

    } catch (error: any) {
      console.error('Error processing message:', error);
      
      setState(prev => ({
        ...prev,
        isProcessing: false,
        error: error.message || 'An error occurred while processing your message'
      }));

      toast.error('Failed to process message. Please try again.');
    }
  }, [state.currentMode, toast]);

  const switchAgent = useCallback((agentId: string) => {
    if (!coordinatorRef.current) return false;

    const success = coordinatorRef.current.switchAgent(agentId);
    if (success) {
      setState(prev => ({
        ...prev,
        currentAgent: coordinatorRef.current!.getCurrentAgent()
      }));
      toast.success(`Switched to ${coordinatorRef.current.getCurrentAgent().name}`);
    }
    return success;
  }, [toast]);

  const setMode = useCallback((mode: ChatMode) => {
    setState(prev => ({
      ...prev,
      currentMode: mode
    }));
  }, []);

  const updateUserPreferences = useCallback((preferences: any) => {
    if (!coordinatorRef.current) return;
    
    coordinatorRef.current.updateUserPreferences(preferences);
    toast.success('Preferences updated successfully');
  }, [toast]);

  const setUserProfile = useCallback((profile: UserProfile) => {
    if (!coordinatorRef.current) return;
    
    coordinatorRef.current.setUserProfile(profile);
  }, []);

  const setTaskContext = useCallback((taskContext: TaskContext) => {
    if (!coordinatorRef.current) return;
    
    coordinatorRef.current.setTaskContext(taskContext);
  }, []);

  const clearConversation = useCallback(() => {
    if (!coordinatorRef.current) return;
    
    coordinatorRef.current.clearConversationHistory();
    
    // Clear from localStorage
    localStorage.removeItem(STORAGE_KEY);
    
    setState(prev => ({
      ...prev,
      messages: []
    }));
    toast.success('Conversation cleared');
  }, [toast]);

  const searchKnowledge = useCallback((query: string, filters?: { tags?: string[]; category?: string }) => {
    if (!coordinatorRef.current) return [];
    
    return coordinatorRef.current.searchKnowledge(query, filters);
  }, []);

  const addNote = useCallback((title: string, content: string, tags: string[] = [], category?: string) => {
    if (!coordinatorRef.current) return null;
    
    const note = coordinatorRef.current.addNote(title, content, tags, category);
    toast.success('Note added successfully');
    return note;
  }, [toast]);

  const updateNote = useCallback((noteId: string, updates: any) => {
    if (!coordinatorRef.current) return;
    
    coordinatorRef.current.updateNote(noteId, updates);
    toast.success('Note updated successfully');
  }, [toast]);

  const deleteNote = useCallback((noteId: string) => {
    if (!coordinatorRef.current) return;
    
    coordinatorRef.current.deleteNote(noteId);
    toast.success('Note deleted successfully');
  }, [toast]);

  const getSharedKnowledge = useCallback(() => {
    if (!coordinatorRef.current) return null;
    
    return coordinatorRef.current.getSharedKnowledge();
  }, []);

  const analyzeUserBehavior = useCallback(() => {
    if (!coordinatorRef.current) return null;
    
    return coordinatorRef.current.analyzeUserBehavior();
  }, []);

  const getRecommendedMode = useCallback((message: string): ChatMode => {
    if (!coordinatorRef.current) return 'general';
    
    return coordinatorRef.current.getRecommendedMode(message);
  }, []);

  return {
    // State
    messages: state.messages,
    isProcessing: state.isProcessing,
    currentAgent: state.currentAgent,
    availableAgents: state.availableAgents,
    currentMode: state.currentMode,
    error: state.error,

    // Actions
    sendMessage,
    switchAgent,
    setMode,
    updateUserPreferences,
    setUserProfile,
    setTaskContext,
    clearConversation,

    // Knowledge management
    searchKnowledge,
    addNote,
    updateNote,
    deleteNote,
    getSharedKnowledge,
    analyzeUserBehavior,

    // Utilities
    getRecommendedMode
  };
};