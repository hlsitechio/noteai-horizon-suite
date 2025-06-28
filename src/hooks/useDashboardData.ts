
import { useState, useEffect, useRef, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { SupabaseNotesService } from '../services/supabaseNotesService';
import { supabase } from '@/integrations/supabase/client';
import { Note } from '../types/note';
import { toast } from 'sonner';

interface DashboardData {
  notes: Note[];
  banners: any[];
  projects: any[];
  isLoading: boolean;
  syncStatus: 'connected' | 'disconnected' | 'syncing';
  error: string | null;
}

interface DashboardStats {
  totalNotes: number;
  totalWords: number;
  avgWords: number;
  categoriesCount: number;
  weeklyNotes: number;
  favoriteNotes: number;
}

export const useDashboardData = () => {
  const [data, setData] = useState<DashboardData>({
    notes: [],
    banners: [],
    projects: [],
    isLoading: true,
    syncStatus: 'disconnected',
    error: null,
  });

  const { user, isLoading: authLoading } = useAuth();
  const channelRef = useRef<any>(null);
  const mountedRef = useRef(true);
  const fetchingRef = useRef(false);

  // Memoized stats calculation
  const stats: DashboardStats = {
    totalNotes: data.notes.length,
    totalWords: data.notes.reduce((sum, note) => {
      const wordCount = note.content ? note.content.split(/\s+/).filter(word => word.length > 0).length : 0;
      return sum + wordCount;
    }, 0),
    avgWords: data.notes.length > 0 ? Math.round(data.notes.reduce((sum, note) => {
      const wordCount = note.content ? note.content.split(/\s+/).filter(word => word.length > 0).length : 0;
      return sum + wordCount;
    }, 0) / data.notes.length) : 0,
    categoriesCount: new Set(data.notes.map(note => note.category)).size,
    weeklyNotes: data.notes.filter(note => {
      const noteDate = new Date(note.createdAt);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return noteDate >= weekAgo;
    }).length,
    favoriteNotes: data.notes.filter(note => note.isFavorite).length,
  };

  const fetchAllData = useCallback(async () => {
    if (!user || fetchingRef.current || !mountedRef.current) return;

    fetchingRef.current = true;
    setData(prev => ({ ...prev, isLoading: true, syncStatus: 'syncing' }));

    try {
      console.log('Fetching dashboard data...');
      
      // Fetch all data in parallel
      const [notesData, bannersData, projectsData] = await Promise.all([
        SupabaseNotesService.getAllNotes(),
        supabase
          .from('banners')
          .select('*')
          .eq('user_id', user.id)
          .eq('banner_type', 'dashboard')
          .is('project_id', null)
          .order('updated_at', { ascending: false }),
        supabase
          .from('project_realms')
          .select('*')
          .eq('creator_id', user.id)
          .order('last_activity_at', { ascending: false })
      ]);

      if (mountedRef.current) {
        setData({
          notes: notesData,
          banners: bannersData.data || [],
          projects: projectsData.data || [],
          isLoading: false,
          syncStatus: 'connected',
          error: null,
        });
        console.log('Dashboard data fetched successfully');
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      if (mountedRef.current) {
        setData(prev => ({
          ...prev,
          isLoading: false,
          syncStatus: 'disconnected',
          error: error instanceof Error ? error.message : 'Failed to fetch data',
        }));
        toast.error('Failed to load dashboard data');
      }
    } finally {
      fetchingRef.current = false;
    }
  }, [user]);

  const setupRealtimeSubscription = useCallback(async () => {
    if (!user || !mountedRef.current || channelRef.current) return;

    try {
      console.log('Setting up dashboard real-time subscription');
      
      const channelName = `dashboard-${user.id}-${Date.now()}`;
      const channel = supabase
        .channel(channelName)
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'notes_v2',
            filter: `user_id=eq.${user.id}`
          },
          (payload) => {
            if (!mountedRef.current) return;
            console.log('Dashboard: Notes real-time update:', payload.eventType);
            
            // Debounce updates to prevent excessive re-renders
            setTimeout(() => {
              if (mountedRef.current && !fetchingRef.current) {
                fetchAllData();
              }
            }, 500);
          }
        )
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'banners',
            filter: `user_id=eq.${user.id}`
          },
          (payload) => {
            if (!mountedRef.current) return;
            console.log('Dashboard: Banners real-time update:', payload.eventType);
            
            setTimeout(() => {
              if (mountedRef.current && !fetchingRef.current) {
                fetchAllData();
              }
            }, 500);
          }
        )
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'project_realms',
            filter: `creator_id=eq.${user.id}`
          },
          (payload) => {
            if (!mountedRef.current) return;
            console.log('Dashboard: Projects real-time update:', payload.eventType);
            
            setTimeout(() => {
              if (mountedRef.current && !fetchingRef.current) {
                fetchAllData();
              }
            }, 500);
          }
        );

      channel.subscribe((status) => {
        if (!mountedRef.current) return;
        
        console.log('Dashboard subscription status:', status);
        
        if (status === 'SUBSCRIBED') {
          channelRef.current = channel;
          setData(prev => ({ ...prev, syncStatus: 'connected' }));
        } else if (status === 'CHANNEL_ERROR') {
          setData(prev => ({ ...prev, syncStatus: 'disconnected' }));
        }
      });

    } catch (error) {
      console.error('Error setting up dashboard real-time subscription:', error);
      if (mountedRef.current) {
        setData(prev => ({ ...prev, syncStatus: 'disconnected' }));
      }
    }
  }, [user, fetchAllData]);

  const cleanupSubscription = useCallback(async () => {
    if (channelRef.current) {
      try {
        await supabase.removeChannel(channelRef.current);
        console.log('Dashboard subscription cleaned up');
      } catch (error) {
        console.warn('Error cleaning up dashboard subscription:', error);
      }
      channelRef.current = null;
    }
  }, []);

  // Initialize data fetching and real-time subscription
  useEffect(() => {
    if (authLoading || !user) return;

    const initializeDashboard = async () => {
      await fetchAllData();
      await setupRealtimeSubscription();
    };

    initializeDashboard();

    return () => {
      cleanupSubscription();
    };
  }, [user?.id, authLoading, fetchAllData, setupRealtimeSubscription, cleanupSubscription]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      mountedRef.current = false;
      cleanupSubscription();
    };
  }, [cleanupSubscription]);

  const refreshData = useCallback(() => {
    if (!fetchingRef.current) {
      fetchAllData();
    }
  }, [fetchAllData]);

  return {
    ...data,
    stats,
    refreshData,
  };
};
