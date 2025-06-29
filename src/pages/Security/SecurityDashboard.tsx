
import React from 'react';
import SecurityDashboard from '../../components/Security/SecurityDashboard';
import PageAICopilot from '../../components/Global/PageAICopilot';

const SecurityDashboardPage: React.FC = () => {
  return (
    <>
      <SecurityDashboard />
      <PageAICopilot pageContext="security-dashboard" />
    </>
  );
};

export default SecurityDashboardPage;
