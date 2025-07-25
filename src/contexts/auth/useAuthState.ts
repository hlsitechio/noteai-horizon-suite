
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
        session: action.payload
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

  const setLoading = (loading: boolean) => {
    dispatch({ type: 'SET_LOADING', payload: loading });
  };

  const setSession = async (session: Session | null) => {
    // Keep loading true until user transformation is complete
    dispatch({ type: 'SET_SESSION', payload: session });
    
    // Transform and set user when session changes
    if (session?.user) {
      try {
        const transformedUser = await transformUser(session.user);
        dispatch({ type: 'SET_USER', payload: transformedUser });
      } catch (error) {
        console.error('Error transforming user during session set:', error);
        // Fallback to basic user data if profile fetch fails
        const fallbackUser = {
          id: session.user.id,
          email: session.user.email || '',
          name: session.user.email?.split('@')[0] || 'User',
          avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(session.user.email?.split('@')[0] || 'User')}&background=6366f1&color=fff`
        };
        dispatch({ type: 'SET_USER', payload: fallbackUser });
      }
    } else {
      dispatch({ type: 'SET_USER', payload: null });
    }
    
    // Only set loading to false after user is set
    dispatch({ type: 'SET_LOADING', payload: false });
  };

  const setUser = (user: User | null) => {
    dispatch({ type: 'SET_USER', payload: user });
  };

  const clearAuth = () => {
    dispatch({ type: 'CLEAR_AUTH' });
  };

  const refreshUser = async () => {
    if (state.session?.user) {
      try {
        const transformedUser = await transformUser(state.session.user);
        setUser(transformedUser);
      } catch (error) {
        console.error('Error refreshing user:', error);
        // Fallback to basic user data if profile fetch fails
        const fallbackUser = {
          id: state.session.user.id,
          email: state.session.user.email || '',
          name: state.session.user.email?.split('@')[0] || 'User',
          avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(state.session.user.email?.split('@')[0] || 'User')}&background=6366f1&color=fff`
        };
        setUser(fallbackUser);
      }
    }
  };

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
