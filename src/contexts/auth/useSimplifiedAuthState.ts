import { useState, useCallback, useRef } from 'react';
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
  const stateRef = useRef(state);

  // Keep ref in sync with state
  stateRef.current = state;

  const setLoading = useCallback((loading: boolean) => {
    // Only update if loading state actually changed
    if (stateRef.current.isLoading !== loading) {
      console.log('Auth: Setting loading to', loading);
      setState(prev => ({ ...prev, isLoading: loading }));
    }
  }, []);

  const setSession = useCallback((session: Session | null) => {
    const newUser = session?.user ? {
      id: session.user.id,
      email: session.user.email || '',
      name: session.user.email?.split('@')[0] || 'User',
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(session.user.email?.split('@')[0] || 'User')}&background=6366f1&color=fff`
    } : null;

    const newState = {
      session,
      user: newUser,
      isLoading: false,
      isAuthenticated: !!session?.user,
    };

    // Only update if state actually changed
    if (
      stateRef.current.session?.user?.id !== session?.user?.id ||
      stateRef.current.isLoading !== false ||
      stateRef.current.isAuthenticated !== !!session?.user
    ) {
      console.log('Auth: Setting session', session ? 'exists' : 'null');
      console.log('Auth: New state -', { 
        hasUser: !!newUser, 
        isAuthenticated: !!session?.user,
        isLoading: false 
      });
      setState(newState);
    }
  }, []);

  const clearAuth = useCallback(() => {
    // Only clear if not already cleared
    if (stateRef.current.user || stateRef.current.session || stateRef.current.isAuthenticated || stateRef.current.isLoading) {
      console.log('Auth: Clearing auth state');
      setState({
        user: null,
        session: null,
        isLoading: false,
        isAuthenticated: false,
      });
    }
  }, []);

  return {
    ...state,
    setLoading,
    setSession,
    clearAuth,
  };
};
