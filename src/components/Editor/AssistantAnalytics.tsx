
import React from 'react';
import EnhancedAssistantAnalytics from './EnhancedAssistantAnalytics';

interface AssistantAnalyticsProps {
  content: string;
}

const AssistantAnalytics: React.FC<AssistantAnalyticsProps> = ({ content }) => {
  return <EnhancedAssistantAnalytics content={content} />;
};

export default AssistantAnalytics;
