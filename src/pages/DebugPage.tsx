import React from 'react';
import { ConsoleDebugViewer } from '@/components/Debug/ConsoleDebugViewer';

const DebugPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-background">
      <ConsoleDebugViewer />
    </div>
  );
};

export default DebugPage;