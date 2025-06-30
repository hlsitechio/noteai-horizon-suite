
import React, { createContext, useContext } from 'react';

interface MockUser {
  id: string;
  email: string;
  name: string;
  avatar?: string;
}

interface MockAuthContextType {
  user: MockUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const MockAuthContext = createContext<MockAuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(MockAuthContext);
  if (!context) {
    throw new Error('useAuth must be used within a MockAuthProvider');
  }
  return context;
};

// Mock user data
const mockUser: MockUser = {
  id: 'mock-user-id',
  email: 'user@example.com',
  name: 'Demo User',
  avatar: 'https://ui-avatars.com/api/?name=Demo+User&background=6366f1&color=fff'
};

export const MockAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const contextValue: MockAuthContextType = {
    user: mockUser,
    isAuthenticated: true,
    isLoading: false,
    login: async () => true,
    register: async () => true,
    logout: () => {},
    refreshUser: async () => {},
  };

  return (
    <MockAuthContext.Provider value={contextValue}>
      {children}
    </MockAuthContext.Provider>
  );
};
