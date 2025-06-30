
import React from 'react';
import { Brain } from 'lucide-react';

interface PageAICopilotProps {
  pageContext: string;
}

const PageAICopilot: React.FC<PageAICopilotProps> = ({ pageContext }) => {
  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="p-2 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full shadow-lg opacity-80 hover:opacity-100 transition-opacity">
        <Brain className="w-5 h-5 text-white" />
      </div>
    </div>
  );
};

export default PageAICopilot;
