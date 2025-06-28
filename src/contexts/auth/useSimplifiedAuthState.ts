
import { useState, useCallback } from 'react';
import { Session } from '@supabase/supabase-js';
import { User } from './types';

interface SimplifiedAuthState {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

const initialState: SimplifiedAuthState = {
  user: null,
  session: null,
  isLoading: true,
  isAuthenticated: false,
};

export const useSimplifiedAuthState = () => {
  const [state, setState] = useState<SimplifiedAuthState>(initialState);

  const setLoading = useCallback((loading: boolean) => {
    console.log('Auth: Setting loading to', loading);
    setState(prev => ({ ...prev, isLoading: loading }));
  }, []);

  const setSession = useCallback((session: Session | null) => {
    console.log('Auth: Setting session', session ? 'exists' : 'null');
    setState(prev => {
      // Only update if session actually changed
      if (prev.session === session) {
        console.log('Auth: Session unchanged, not updating state');
        return prev;
      }
      
      const user = session?.user ? {
        id: session.user.id,
        email: session.user.email || '',
        name: session.user.email?.split('@')[0] || 'User',
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(session.user.email?.split('@')[0] || 'User')}&background=6366f1&color=fff`
      } : null;

      console.log('Auth: New state -', { 
        hasUser: !!user, 
        isAuthenticated: !!session?.user,
        isLoading: false 
      });

      return {
        ...prev,
        session,
        user,
        isLoading: false,
        isAuthenticated: !!session?.user,
      };
    });
  }, []);

  const clearAuth = useCallback(() => {
    console.log('Auth: Clearing auth state');
    setState({
      user: null,
      session: null,
      isLoading: false,
      isAuthenticated: false,
    });
  }, []);

  return {
    ...state,
    setLoading,
    setSession,
    clearAuth,
  };
};
