import React from 'react';

interface LoadingStateProps {
  message: string;
}

const LoadingState: React.FC<LoadingStateProps> = ({ message }) => (
  <div className="h-full flex items-center justify-center">
    <div className="text-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
      <p className="text-muted-foreground">{message}</p>
    </div>
  </div>
);

export const DashboardLoadingState = () => (
  <LoadingState message="Loading dashboard..." />
);

export const RedirectLoadingState = () => (
  <LoadingState message="Redirecting to onboarding..." />
);