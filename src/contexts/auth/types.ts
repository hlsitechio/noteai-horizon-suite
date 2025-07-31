
import { User as SupabaseUser, Session } from '@supabase/supabase-js';

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  welcome_message?: string;
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  authError?: string | null;
  showPasskeySetup: boolean;
  setShowPasskeySetup: (show: boolean) => void;
  showStorageSetup: boolean;
  setShowStorageSetup: (show: boolean) => void;
  storageInitialization: {
    isInitialized: boolean;
    isLoading: boolean;
    needsInitialization: boolean;
    error: string | null;
    refreshStatus: () => void;
    markAsInitialized: () => void;
  };
}

export interface AuthState {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
}

export type AuthAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_SESSION'; payload: Session | null }
  | { type: 'SET_USER'; payload: User | null }
  | { type: 'CLEAR_AUTH' };
