import { useEffect, useRef, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Note } from '../types/note';
import { useAuth } from '../contexts/AuthContext';

interface UseOptimizedRealtimeOptions {
  onInsert?: (note: Note) => void;
  onUpdate?: (note: Note) => void;
  onDelete?: (noteId: string) => void;
  enabled?: boolean;
  throttleMs?: number;
}

export const useOptimizedRealtime = ({
  onInsert,
  onUpdate,
  onDelete,
  enabled = true,
  throttleMs = 1000, // 1 second throttle
}: UseOptimizedRealtimeOptions) => {
  const { user, isAuthenticated } = useAuth();
  const channelRef = useRef<any>(null);
  const subscriptionActiveRef = useRef(false);
  const lastEventTimeRef = useRef<Record<string, number>>({});

  // Throttle function to prevent event flooding
  const throttleEvent = useCallback((eventKey: string, callback: () => void) => {
    const now = Date.now();
    const lastTime = lastEventTimeRef.current[eventKey] || 0;
    
    if (now - lastTime >= throttleMs) {
      lastEventTimeRef.current[eventKey] = now;
      callback();
    }
  }, [throttleMs]);

  const cleanup = useCallback(() => {
    if (channelRef.current) {
      console.log('Cleaning up realtime subscription');
      try {
        channelRef.current.unsubscribe();
        supabase.removeChannel(channelRef.current);
      } catch (error) {
        console.error('Error cleaning up realtime subscription:', error);
      }
      channelRef.current = null;
      subscriptionActiveRef.current = false;
    }
  }, []);

  const setupRealtime = useCallback(async () => {
    if (!enabled || !isAuthenticated || !user) {
      console.log('Realtime disabled or user not authenticated');
      return;
    }

    if (subscriptionActiveRef.current) {
      console.log('Realtime subscription already active');
      return;
    }

    cleanup(); // Clean up any existing subscription

    try {
      console.log('Setting up optimized realtime subscription for user:', user.id);

      const channel = supabase
        .channel(`notes-${user.id}-${Date.now()}`, {
          config: {
            broadcast: { self: false },
            presence: { key: user.id }
          }
        })
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'notes_v2',
            filter: `user_id=eq.${user.id}`
          },
          (payload) => {
            if (onInsert && payload.new) {
              throttleEvent('insert', () => {
                try {
                  const note: Note = {
                    id: payload.new.id,
                    title: payload.new.title,
                    content: payload.new.content,
                    category: payload.new.content_type || 'general',
                    tags: payload.new.tags || [],
                    createdAt: payload.new.created_at,
                    updatedAt: payload.new.updated_at,
                    isFavorite: payload.new.is_public || false,
                    folder_id: payload.new.folder_id,
                    reminder_date: payload.new.reminder_date,
                    reminder_status: (payload.new.reminder_status || 'none') as any,
                    reminder_frequency: (payload.new.reminder_frequency || 'once') as any,
                    reminder_enabled: payload.new.reminder_enabled || false,
                  };
                  onInsert(note);
                } catch (error) {
                  console.error('Error processing INSERT event:', error);
                }
              });
            }
          }
        )
        .on(
          'postgres_changes',
          {
            event: 'UPDATE',
            schema: 'public',
            table: 'notes_v2',
            filter: `user_id=eq.${user.id}`
          },
          (payload) => {
            if (onUpdate && payload.new) {
              throttleEvent('update', () => {
                try {
                  const note: Note = {
                    id: payload.new.id,
                    title: payload.new.title,
                    content: payload.new.content,
                    category: payload.new.content_type || 'general',
                    tags: payload.new.tags || [],
                    createdAt: payload.new.created_at,
                    updatedAt: payload.new.updated_at,
                    isFavorite: payload.new.is_public || false,
                    folder_id: payload.new.folder_id,
                    reminder_date: payload.new.reminder_date,
                    reminder_status: (payload.new.reminder_status || 'none') as any,
                    reminder_frequency: (payload.new.reminder_frequency || 'once') as any,
                    reminder_enabled: payload.new.reminder_enabled || false,
                  };
                  onUpdate(note);
                } catch (error) {
                  console.error('Error processing UPDATE event:', error);
                }
              });
            }
          }
        )
        .on(
          'postgres_changes',
          {
            event: 'DELETE',
            schema: 'public',
            table: 'notes_v2',
            filter: `user_id=eq.${user.id}`
          },
          (payload) => {
            if (onDelete && payload.old) {
              throttleEvent('delete', () => {
                try {
                  onDelete(payload.old.id);
                } catch (error) {
                  console.error('Error processing DELETE event:', error);
                }
              });
            }
          }
        );

      channel.subscribe((status) => {
        console.log(`Realtime subscription status: ${status}`);
        if (status === 'SUBSCRIBED') {
          subscriptionActiveRef.current = true;
        } else if (status === 'CLOSED' || status === 'CHANNEL_ERROR') {
          subscriptionActiveRef.current = false;
        }
      });

      channelRef.current = channel;
      console.log('Optimized realtime subscription setup completed');
    } catch (error) {
      console.error('Error setting up realtime subscription:', error);
      subscriptionActiveRef.current = false;
    }
  }, [enabled, isAuthenticated, user, onInsert, onUpdate, onDelete, throttleEvent, cleanup]);

  useEffect(() => {
    setupRealtime();
    return cleanup;
  }, [setupRealtime, cleanup]);

  return {
    isConnected: subscriptionActiveRef.current,
    reconnect: setupRealtime,
    disconnect: cleanup,
  };
};