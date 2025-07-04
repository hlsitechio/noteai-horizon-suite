import React from 'react';
import { OptimizedNotesProvider } from '../contexts/OptimizedNotesContext';
import { FoldersProvider } from '../contexts/FoldersContext';
import { NotificationsProvider } from '../contexts/NotificationsContext';
import { composeProviders } from '../utils/composeProviders';

/**
 * Data management providers for notes, folders, and notifications
 * Grouped for logical separation and better performance
 */
export const NotesDataProviders = composeProviders(
  NotificationsProvider,
  FoldersProvider,
  OptimizedNotesProvider
);