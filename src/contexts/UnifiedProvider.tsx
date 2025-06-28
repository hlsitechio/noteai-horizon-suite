
import React, { createContext, useContext } from 'react';
import { ThemeProvider } from '../providers/ThemeProvider';
import { AuthProvider } from './AuthContext';
import { AccentColorProvider } from './AccentColorContext';
import { NotificationsProvider } from './NotificationsContext';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';

interface UnifiedProviderProps {
  children: React.ReactNode;
}

export const UnifiedProvider: React.FC<UnifiedProviderProps> = ({ children }) => {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="online-note-ai-theme">
      <TooltipProvider>
        <AuthProvider>
          <AccentColorProvider>
            <NotificationsProvider>
              {children}
              <Toaster />
              <Sonner />
            </NotificationsProvider>
          </AccentColorProvider>
        </AuthProvider>
      </TooltipProvider>
    </ThemeProvider>
  );
};
