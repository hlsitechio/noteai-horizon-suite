import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Clock, Globe, Smartphone, Monitor, Tablet } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

const PerformanceDemo = () => {
  const [activeDemo, setActiveDemo] = useState<'sync' | 'speed' | null>(null);
  const [syncProgress, setSyncProgress] = useState(0);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [devices, setDevices] = useState([
    { name: 'Desktop', icon: Monitor, synced: false, delay: 0 },
    { name: 'Mobile', icon: Smartphone, synced: false, delay: 300 },
    { name: 'Tablet', icon: Tablet, synced: false, delay: 600 }
  ]);

  const performanceMetrics = [
    { label: 'Response Time', value: '< 50ms', icon: Zap },
    { label: 'Sync Speed', value: '< 200ms', icon: Globe },
    { label: 'Uptime', value: '99.9%', icon: Clock }
  ];

  const startSyncDemo = () => {
    setActiveDemo('sync');
    setSyncProgress(0);
    setDevices(prev => prev.map(d => ({ ...d, synced: false })));
    
    // Animate sync progress with better performance
    const interval = setInterval(() => {
      setSyncProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 4; // Increased step size to reduce frequency
      });
    }, 60); // Increased from 30ms to 60ms for better performance

    // Sync devices with delays
    devices.forEach((device, index) => {
      setTimeout(() => {
        setDevices(prev => 
          prev.map((d, i) => i === index ? { ...d, synced: true } : d)
        );
      }, device.delay + 1000);
    });
  };

  const startSpeedDemo = () => {
    setActiveDemo('speed');
    setLoadingProgress(0);
    
    const interval = setInterval(() => {
      setLoadingProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 8; // Fast loading simulation
      });
    }, 50);
  };

  const resetDemo = () => {
    setActiveDemo(null);
    setSyncProgress(0);
    setLoadingProgress(0);
    setDevices(prev => prev.map(d => ({ ...d, synced: false })));
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -50 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8 }}
      className="group"
    >
      <Card className="bg-gradient-to-br from-slate-900/5 to-slate-800/5 backdrop-blur-xl border-0 transition-all duration-500 rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(251,191,36,0.3)] hover:shadow-2xl">
        <CardContent className="p-0">
          <div className="grid lg:grid-cols-2 gap-0">
            {/* Feature Description */}
            <div className="p-10 flex flex-col justify-center">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-r from-yellow-400 via-orange-500 to-red-600 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500 shadow-2xl">
                <Zap className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-3xl font-bold text-white mb-6">Lightning Fast Performance</h3>
              <p className="text-gray-300 leading-relaxed text-lg mb-6">
                Experience blazing-fast speeds with instant sync across all devices. Try our real-time demos to see the performance in action.
              </p>
              <div className="grid grid-cols-1 gap-3 mb-6">
                {performanceMetrics.map((metric) => (
                  <div key={metric.label} className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-yellow-400/20 to-orange-500/20 rounded-lg flex items-center justify-center">
                      <metric.icon className="w-4 h-4 text-yellow-400" />
                    </div>
                    <div className="flex-1">
                      <div className="text-white text-sm font-medium">{metric.label}</div>
                      <div className="text-yellow-400 text-xs">{metric.value}</div>
                    </div>
                  </div>
                ))}
              </div>
              <Badge className="w-fit bg-yellow-500/20 text-yellow-300 border-0">
                Interactive Demo
              </Badge>
            </div>
            
            {/* Live Demo */}
            <div className="bg-black/40 p-8">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h4 className="text-white font-semibold text-lg">Performance Tests</h4>
                  {activeDemo && (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={resetDemo}
                      className="text-white/70 hover:text-white"
                    >
                      Reset
                    </Button>
                  )}
                </div>

                {/* Demo Buttons */}
                <div className="grid gap-3">
                  <Button 
                    onClick={startSyncDemo}
                    disabled={activeDemo === 'sync'}
                    className="bg-gradient-to-r from-yellow-500 to-orange-600 hover:scale-105 transition-all justify-start text-left h-auto p-4 relative overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-black/50" />
                    <Globe className="w-5 h-5 mr-3 flex-shrink-0" />
                    <div className="text-left">
                      <div className="font-bold drop-shadow-sm text-white">Real-time Sync Test</div>
                      <div className="text-sm text-orange-100/90 drop-shadow-sm">See instant sync across devices</div>
                    </div>
                  </Button>
                  
                  <Button 
                    onClick={startSpeedDemo}
                    disabled={activeDemo === 'speed'}
                    className="bg-gradient-to-r from-orange-500 to-red-600 hover:scale-105 transition-all justify-start text-left h-auto p-4 relative overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-black/50" />
                    <Zap className="w-5 h-5 mr-3 flex-shrink-0" />
                    <div className="text-left">
                      <div className="font-bold drop-shadow-sm text-white">Speed Test</div>
                      <div className="text-sm text-red-100/90 drop-shadow-sm">Measure loading performance</div>
                    </div>
                  </Button>
                </div>

                {/* Demo Results */}
                <AnimatePresence mode="wait">
                  {activeDemo === 'sync' && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="space-y-4"
                    >
                      <div className="bg-white/10 rounded-xl p-4 space-y-3">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-white/70 text-sm">Sync Progress</span>
                          <span className="text-yellow-400 text-sm font-medium">{syncProgress}%</span>
                        </div>
                        <Progress value={syncProgress} className="h-2" />
                      </div>
                      
                      <div className="grid gap-2">
                        {devices.map((device, index) => (
                          <motion.div
                            key={device.name}
                            initial={{ opacity: 0.5 }}
                            animate={{ 
                              opacity: device.synced ? 1 : 0.5,
                              scale: device.synced ? 1.02 : 1
                            }}
                            className={`flex items-center justify-between p-3 rounded-lg transition-all ${
                              device.synced 
                                ? 'bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30' 
                                : 'bg-white/5'
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <device.icon className="w-4 h-4 text-white/70" />
                              <span className="text-white text-sm">{device.name}</span>
                            </div>
                            {device.synced && (
                              <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="w-2 h-2 bg-green-400 rounded-full"
                              />
                            )}
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {activeDemo === 'speed' && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="space-y-4"
                    >
                      <div className="bg-white/10 rounded-xl p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-white/70 text-sm">Loading Speed</span>
                          <span className="text-orange-400 text-sm font-medium">
                            {loadingProgress === 100 ? '47ms' : 'Testing...'}
                          </span>
                        </div>
                        <Progress value={loadingProgress} className="h-2" />
                        {loadingProgress === 100 && (
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mt-3 text-center"
                          >
                            <Badge className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-300 border-0">
                              ⚡ Ultra Fast Performance
                            </Badge>
                          </motion.div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default PerformanceDemo;