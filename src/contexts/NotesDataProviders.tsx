import React from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { OptimizedNotesProvider } from '../contexts/OptimizedNotesContext';
import { FoldersProvider } from '../contexts/FoldersContext';
import { NotificationsProvider } from '../contexts/NotificationsContext';
import { queryClient } from '../lib/queryClient';

interface NotesDataProvidersProps {
  children: React.ReactNode;
}

/**
 * Data management providers for notes, folders, and notifications
 * Grouped for logical separation and better performance
 */
export const NotesDataProviders: React.FC<NotesDataProvidersProps> = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    <NotificationsProvider>
      <FoldersProvider>
        <OptimizedNotesProvider>
          {children}
        </OptimizedNotesProvider>
      </FoldersProvider>
    </NotificationsProvider>
  </QueryClientProvider>
);