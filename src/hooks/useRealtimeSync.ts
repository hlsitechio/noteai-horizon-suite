import { useEffect, useRef, useState, useCallback } from 'react';
import { RealtimeSyncService, RealtimeSyncConfig } from '../services/realtimeSync';
import { useToast } from './useToast';

export interface UseRealtimeSyncOptions {
  documentId: string;
  userId?: string;
  enabled?: boolean;
  onContentChange?: (content: string) => void;
}

export const useRealtimeSync = ({
  documentId,
  userId = 'anonymous',
  enabled = true,
  onContentChange
}: UseRealtimeSyncOptions) => {
  const [connected, setConnected] = useState(false);
  const [activeUsers, setActiveUsers] = useState<string[]>([]);
  const syncServiceRef = useRef<RealtimeSyncService | null>(null);
  const { toast } = useToast();
  const lastConnectionToastRef = useRef<string | null>(null);

  const handleUserJoined = useCallback((joinedUserId: string) => {
    setActiveUsers(prev => [...prev.filter(id => id !== joinedUserId), joinedUserId]);
    toast.success(`${joinedUserId} joined the session`);
  }, [toast]);

  const handleUserLeft = useCallback((leftUserId: string) => {
    setActiveUsers(prev => prev.filter(id => id !== leftUserId));
    toast.info(`${leftUserId} left the session`);
  }, [toast]);

  const handleConnectionChange = useCallback((isConnected: boolean) => {
    setConnected(isConnected);
    
    // Prevent spam notifications by tracking the last toast type
    const currentToastType = isConnected ? 'connected' : 'disconnected';
    
    if (lastConnectionToastRef.current !== currentToastType) {
      if (isConnected) {
        toast.success('Connected to real-time sync');
        lastConnectionToastRef.current = 'connected';
      } else {
        toast.error('Disconnected from real-time sync');
        lastConnectionToastRef.current = 'disconnected';
      }
    }
  }, [toast]);

  useEffect(() => {
    // Completely disable RealtimeSyncService to prevent any WebSocket connection attempts
    if (enabled) {
      console.warn('RealtimeSyncService disabled - WebSocket connections not available');
    }
    setConnected(false);

    return () => {
      if (syncServiceRef.current) {
        syncServiceRef.current.disconnect();
        syncServiceRef.current = null;
      }
    };
  }, [documentId, userId, enabled, onContentChange, handleUserJoined, handleUserLeft, handleConnectionChange]);

  const updateContent = useCallback((content: string) => {
    if (syncServiceRef.current) {
      syncServiceRef.current.updateContent(content);
    }
  }, []);

  const sendNoteUpdate = useCallback((noteId: string, content: string) => {
    if (syncServiceRef.current) {
      syncServiceRef.current.sendNoteUpdate(noteId, content);
    }
  }, []);

  const getContent = useCallback((): string => {
    return syncServiceRef.current?.getContent() || '';
  }, []);

  return {
    connected,
    activeUsers,
    updateContent,
    sendNoteUpdate,
    getContent,
    syncService: syncServiceRef.current
  };
};