
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Zap, Cpu, Activity } from 'lucide-react';
import { useGPUAcceleration } from '@/hooks/useGPUAcceleration';

export const GPUPerformanceMonitor: React.FC = () => {
  const { capabilities } = useGPUAcceleration();
  const [performanceMetrics, setPerformanceMetrics] = useState({
    memoryUsage: 0,
    processingTime: 0,
    tasksCompleted: 0,
  });

  useEffect(() => {
    // Simulate performance monitoring
    const interval = setInterval(() => {
      if (capabilities.preferredDevice !== 'cpu') {
        setPerformanceMetrics(prev => ({
          memoryUsage: Math.random() * 100,
          processingTime: Math.random() * 50 + 10,
          tasksCompleted: prev.tasksCompleted + Math.floor(Math.random() * 3),
        }));
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [capabilities.preferredDevice]);

  if (!capabilities.isInitialized) {
    return null;
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <Activity className="w-4 h-4" />
          GPU Performance
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600 dark:text-gray-400">Device:</span>
          <Badge variant="secondary" className={
            capabilities.webGPUSupported 
              ? "bg-green-500/10 text-green-600" 
              : capabilities.webGLSupported
              ? "bg-blue-500/10 text-blue-600"
              : "bg-orange-500/10 text-orange-600"
          }>
            {capabilities.webGPUSupported && <Zap className="w-3 h-3 mr-1" />}
            {!capabilities.webGPUSupported && capabilities.webGLSupported && <Zap className="w-3 h-3 mr-1" />}
            {!capabilities.webGPUSupported && !capabilities.webGLSupported && <Cpu className="w-3 h-3 mr-1" />}
            {capabilities.preferredDevice.toUpperCase()}
          </Badge>
        </div>

        {capabilities.preferredDevice !== 'cpu' && (
          <>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Memory Usage</span>
                <span className="font-medium">{performanceMetrics.memoryUsage.toFixed(1)}%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${performanceMetrics.memoryUsage}%` }}
                />
              </div>
            </div>

            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">Avg Processing Time</span>
              <span className="font-medium">{performanceMetrics.processingTime.toFixed(1)}ms</span>
            </div>

            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">Tasks Completed</span>
              <span className="font-medium">{performanceMetrics.tasksCompleted}</span>
            </div>
          </>
        )}

        <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="flex items-center gap-1">
              <div className={`w-2 h-2 rounded-full ${capabilities.webGPUSupported ? 'bg-green-500' : 'bg-gray-400'}`} />
              <span>WebGPU</span>
            </div>
            <div className="flex items-center gap-1">
              <div className={`w-2 h-2 rounded-full ${capabilities.webGLSupported ? 'bg-blue-500' : 'bg-gray-400'}`} />
              <span>WebGL</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
