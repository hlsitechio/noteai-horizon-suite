
import React from 'react';
import { useLocation } from 'react-router-dom';
import PageAICopilot from './PageAICopilot';

const SecureGlobalAICopilot: React.FC = () => {
  const location = useLocation();
  
  // Only show on app pages, not on landing/auth pages
  const shouldShowCopilot = location.pathname.startsWith('/app');
  
  if (!shouldShowCopilot) {
    return null;
  }

  return <PageAICopilot pageContext={location.pathname} />;
};

export default SecureGlobalAICopilot;
