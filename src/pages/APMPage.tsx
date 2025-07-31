import React from 'react';
import { APMDashboard } from '@/components/APM/APMDashboard';

export const APMPage: React.FC = () => {
  return (
    <div className="container mx-auto py-6">
      <APMDashboard />
    </div>
  );
};