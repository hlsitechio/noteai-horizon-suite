import React from 'react';
import { APMDashboard } from '@/components/APM/APMDashboard';
import { useAPMIntegration } from '@/hooks/useAPMIntegration';

export const APMPage: React.FC = () => {
  // Initialize APM integration
  useAPMIntegration();

  return (
    <div className="container mx-auto py-6">
      <APMDashboard />
    </div>
  );
};