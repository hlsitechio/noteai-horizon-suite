
import { useState, useEffect, useRef, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Note } from '../types/note';

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
  // Return static data without any API calls
  const [data] = useState<DashboardData>({
    notes: [],
    banners: [],
    projects: [],
    isLoading: false,
    syncStatus: 'disconnected',
    error: null,
  });

  const { user, isLoading: authLoading } = useAuth();
  const mountedRef = useRef(true);

  // Static stats calculation
  const stats: DashboardStats = {
    totalNotes: 0,
    totalWords: 0,
    avgWords: 0,
    categoriesCount: 0,
    weeklyNotes: 0,
    favoriteNotes: 0,
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const refreshData = useCallback(() => {
    // Do nothing - no API calls
    console.log('API calls disabled - no data refresh');
  }, []);

  return {
    ...data,
    stats,
    refreshData,
  };
};
