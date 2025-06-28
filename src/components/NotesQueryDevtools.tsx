
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
      toggleButtonProps={{
        style: {
          backgroundColor: '#3b82f6',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          padding: '8px 12px',
          fontSize: '12px',
          fontWeight: '500',
          cursor: 'pointer',
          zIndex: 99999,
        }
      }}
    />
  );
};

export default NotesQueryDevtools;
