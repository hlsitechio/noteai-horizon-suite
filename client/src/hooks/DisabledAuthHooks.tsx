// Disabled experimental hooks - placeholders
export const useOptimizedAuth = () => ({
  user: null,
  session: null,
  isLoading: false,
  signIn: () => Promise.resolve({ data: null, error: 'Disabled' }),
  signUp: () => Promise.resolve({ data: null, error: 'Disabled' }),
  signOut: () => Promise.resolve({ error: null }),
});

export const useSessionSync = () => ({
  isConnected: false,
  lastSync: null,
  sync: () => Promise.resolve(),
});

export const useStableAuth = () => ({
  user: null,
  session: null,
  isLoading: false,
  signIn: () => Promise.resolve({ data: null, error: 'Disabled' }),
  signUp: () => Promise.resolve({ data: null, error: 'Disabled' }),
  signOut: () => Promise.resolve({ error: null }),
});