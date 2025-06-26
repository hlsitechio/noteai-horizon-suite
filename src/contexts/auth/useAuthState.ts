
import { useReducer, useCallback } from 'react';
import { Session } from '@supabase/supabase-js';
import { AuthState, AuthAction, User } from './types';
import { transformUser } from './utils';

const initialState: AuthState = {
  user: null,
  session: null,
  isLoading: true,
};

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_SESSION':
      return { 
        ...state, 
        session: action.payload,
        user: action.payload?.user ? transformUser(action.payload.user) : null,
        isLoading: false
      };
    case 'SET_USER':
      return { ...state, user: action.payload };
    case 'CLEAR_AUTH':
      return { ...state, user: null, session: null, isLoading: false };
    default:
      return state;
  }
};

export const useAuthState = () => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  const setLoading = useCallback((loading: boolean) => {
    dispatch({ type: 'SET_LOADING', payload: loading });
  }, []);

  const setSession = useCallback((session: Session | null) => {
    dispatch({ type: 'SET_SESSION', payload: session });
  }, []);

  const setUser = useCallback((user: User | null) => {
    dispatch({ type: 'SET_USER', payload: user });
  }, []);

  const clearAuth = useCallback(() => {
    dispatch({ type: 'CLEAR_AUTH' });
  }, []);

  const refreshUser = useCallback(async () => {
    if (state.session?.user) {
      try {
        const transformedUser = transformUser(state.session.user);
        setUser(transformedUser);
      } catch (error) {
        console.error('Error refreshing user:', error);
      }
    }
  }, [state.session]);

  return {
    ...state,
    setLoading,
    setSession,
    setUser,
    clearAuth,
    refreshUser,
    isAuthenticated: !!state.user && !!state.session,
  };
};
