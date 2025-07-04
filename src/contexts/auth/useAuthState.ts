
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

  const setLoading = (loading: boolean) => {
    dispatch({ type: 'SET_LOADING', payload: loading });
  };

  const setSession = async (session: Session | null) => {
    dispatch({ type: 'SET_SESSION', payload: session });
    
    // Transform and set user when session changes
    if (session?.user) {
      try {
        const transformedUser = await transformUser(session.user);
        dispatch({ type: 'SET_USER', payload: transformedUser });
      } catch (error) {
        console.error('Error transforming user during session set:', error);
        dispatch({ type: 'SET_USER', payload: null });
      }
    } else {
      dispatch({ type: 'SET_USER', payload: null });
    }
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
