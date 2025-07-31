import { useState } from 'react';
import { toast } from 'sonner';

export const useOptimizedAuth = () => {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  return {
    user,
    session,
    isLoading,
    signUp: async () => {
      toast.error('Authentication feature temporarily disabled');
      return { data: null, error: new Error('Feature disabled') };
    },
    signIn: async () => {
      toast.error('Authentication feature temporarily disabled');
      return { data: null, error: new Error('Feature disabled') };
    },
    signOut: async () => {
      toast.error('Authentication feature temporarily disabled');
      return { error: new Error('Feature disabled') };
    },
    resetPassword: async () => {
      toast.error('Authentication feature temporarily disabled');
      return { error: new Error('Feature disabled') };
    }
  };
};

export const useStableAuth = () => useOptimizedAuth();
export const useSessionSync = () => ({ syncSession: () => {} });