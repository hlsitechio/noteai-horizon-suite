
import React from 'react';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

const NotesQueryDevtools: React.FC = () => {
  // Only show in development mode
  if (import.meta.env.PROD) {
    return null;
  }

  return (
    <ReactQueryDevtools
      initialIsOpen={false}
      position="bottom"
      buttonPosition="bottom-right"
    />
  );
};

export default NotesQueryDevtools;
