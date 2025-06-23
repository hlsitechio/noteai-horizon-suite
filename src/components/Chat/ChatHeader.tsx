
import React from 'react';
import { Plus, Zap, Cpu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { GPUCapabilities } from '@/hooks/useGPUAcceleration';

interface ChatHeaderProps {
  gpuCapabilities: GPUCapabilities;
  onNewChat: () => void;
  isLoading: boolean;
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({
  gpuCapabilities,
  onNewChat,
  isLoading
}) => {
  const getGPUStatusBadge = () => {
    if (!gpuCapabilities.isInitialized) {
      return (
        <Badge variant="secondary" className="bg-gray-500/10 text-gray-600">
          <Cpu className="w-3 h-3 mr-1" />
          Initializing...
        </Badge>
      );
    }

    if (gpuCapabilities.webGPUSupported) {
      return (
        <Badge variant="secondary" className="bg-green-500/10 text-green-600">
          <Zap className="w-3 h-3 mr-1" />
          WebGPU Enabled
        </Badge>
      );
    }

    if (gpuCapabilities.webGLSupported) {
      return (
        <Badge variant="secondary" className="bg-blue-500/10 text-blue-600">
          <Zap className="w-3 h-3 mr-1" />
          WebGL Enabled
        </Badge>
      );
    }

    return (
      <Badge variant="secondary" className="bg-orange-500/10 text-orange-600">
        <Cpu className="w-3 h-3 mr-1" />
        CPU Only
      </Badge>
    );
  };

  return (
    <div className="flex justify-between items-start">
      <div>
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
            AI Assistant
          </h1>
          <Badge variant="secondary" className="bg-blue-500/10 text-blue-600 dark:text-blue-400">
            DeepSeek R1
          </Badge>
          {getGPUStatusBadge()}
        </div>
        <p className="text-gray-600 dark:text-gray-400">
          Get help with your notes and ideas using GPU-accelerated AI
        </p>
      </div>
      <Button size="sm" onClick={onNewChat} disabled={isLoading}>
        <Plus className="w-4 h-4 mr-2" />
        New Chat
      </Button>
    </div>
  );
};
