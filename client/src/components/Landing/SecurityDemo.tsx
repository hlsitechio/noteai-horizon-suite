import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Lock, Key, CheckCircle, Eye, EyeOff, Fingerprint } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

const SecurityDemo = () => {
  const [activeDemo, setActiveDemo] = useState<'encryption' | 'security' | null>(null);
  const [encryptionProgress, setEncryptionProgress] = useState(0);
  const [showOriginalText, setShowOriginalText] = useState(true);
  const [securityChecks, setSecurityChecks] = useState([
    { name: 'SSL/TLS Encryption', completed: false, delay: 500 },
    { name: '2FA Authentication', completed: false, delay: 1000 },
    { name: 'Data Encryption', completed: false, delay: 1500 },
    { name: 'Secure Storage', completed: false, delay: 2000 },
    { name: 'Access Control', completed: false, delay: 2500 }
  ]);

  const securityFeatures = [
    { label: 'Encryption', value: 'AES-256', icon: Lock },
    { label: 'Authentication', value: 'Multi-Factor', icon: Key },
    { label: 'Compliance', value: 'SOC 2', icon: Shield }
  ];

  const originalText = "My secret business plan for 2024...";
  const encryptedText = "4a7f8b2e9c1d6f3a8b5e2f9c7d4a1b8e6f3c9a2d5b8e1f4c7a9b2e5d8f1c4a7b";

  const startEncryptionDemo = () => {
    setActiveDemo('encryption');
    setEncryptionProgress(0);
    setShowOriginalText(true);
    
    // Animate encryption process with better performance
    const interval = setInterval(() => {
      setEncryptionProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setShowOriginalText(false);
          return 100;
        }
        return prev + 5; // Increased step size to reduce frequency
      });
    }, 80); // Increased from 50ms to 80ms for better performance
  };

  const startSecurityDemo = () => {
    setActiveDemo('security');
    setSecurityChecks(prev => prev.map(check => ({ ...check, completed: false })));
    
    // Trigger security checks with delays
    securityChecks.forEach((check, index) => {
      setTimeout(() => {
        setSecurityChecks(prev => 
          prev.map((c, i) => i === index ? { ...c, completed: true } : c)
        );
      }, check.delay);
    });
  };

  const resetDemo = () => {
    setActiveDemo(null);
    setEncryptionProgress(0);
    setShowOriginalText(true);
    setSecurityChecks(prev => prev.map(check => ({ ...check, completed: false })));
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8 }}
      className="group"
    >
      <Card className="bg-gradient-to-br from-slate-900/5 to-slate-800/5 backdrop-blur-xl border-0 transition-all duration-500 rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(16,185,129,0.3)] hover:shadow-2xl">
        <CardContent className="p-0">
          <div className="grid lg:grid-cols-2 gap-0">
            {/* Live Demo */}
            <div className="bg-black/40 p-8 order-2 lg:order-1">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h4 className="text-white font-semibold text-lg">Security Tests</h4>
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
                    onClick={startEncryptionDemo}
                    disabled={activeDemo === 'encryption'}
                    className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:scale-105 transition-all justify-start text-left h-auto p-4 relative overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-black/50" />
                    <Lock className="w-5 h-5 mr-3 flex-shrink-0" />
                    <div className="text-left">
                      <div className="font-bold drop-shadow-sm text-white">Encryption Demo</div>
                      <div className="text-sm text-cyan-100/90 drop-shadow-sm">See real-time data encryption</div>
                    </div>
                  </Button>
                  
                  <Button 
                    onClick={startSecurityDemo}
                    disabled={activeDemo === 'security'}
                    className="bg-gradient-to-r from-teal-500 to-cyan-600 hover:scale-105 transition-all justify-start text-left h-auto p-4 relative overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-black/50" />
                    <Shield className="w-5 h-5 mr-3 flex-shrink-0" />
                    <div className="text-left">
                      <div className="font-bold drop-shadow-sm text-white">Security Scan</div>
                      <div className="text-sm text-teal-100/90 drop-shadow-sm">Verify protection layers</div>
                    </div>
                  </Button>
                </div>

                {/* Demo Results */}
                <AnimatePresence mode="wait">
                  {activeDemo === 'encryption' && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="space-y-4"
                    >
                      <div className="bg-white/10 rounded-xl p-4 space-y-3">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-white/70 text-sm">Encryption Progress</span>
                          <span className="text-emerald-400 text-sm font-medium">{encryptionProgress}%</span>
                        </div>
                        <Progress value={encryptionProgress} className="h-2" />
                      </div>
                      
                      <div className="bg-white/5 rounded-xl p-4 space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-white/70 text-sm">Data Preview</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setShowOriginalText(!showOriginalText)}
                            className="text-white/70 hover:text-white p-1"
                          >
                            {showOriginalText ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </Button>
                        </div>
                        
                        <div className="font-mono text-sm bg-black/40 rounded-lg p-3 min-h-[60px] flex items-center">
                          <AnimatePresence mode="wait">
                            {showOriginalText ? (
                              <motion.span
                                key="original"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="text-gray-300"
                              >
                                {originalText}
                              </motion.span>
                            ) : (
                              <motion.span
                                key="encrypted"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="text-emerald-400 break-all"
                              >
                                {encryptedText}
                              </motion.span>
                            )}
                          </AnimatePresence>
                        </div>
                        
                        {encryptionProgress === 100 && (
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-center"
                          >
                            <Badge className="bg-gradient-to-r from-emerald-500/20 to-teal-500/20 text-emerald-300 border-0">
                              🔒 Successfully Encrypted with AES-256
                            </Badge>
                          </motion.div>
                        )}
                      </div>
                    </motion.div>
                  )}

                  {activeDemo === 'security' && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="space-y-3"
                    >
                      {securityChecks.map((check, index) => (
                        <motion.div
                          key={check.name}
                          initial={{ opacity: 0.5 }}
                          animate={{ 
                            opacity: check.completed ? 1 : 0.5,
                            scale: check.completed ? 1.02 : 1
                          }}
                          className={`flex items-center justify-between p-3 rounded-lg transition-all ${
                            check.completed 
                              ? 'bg-gradient-to-r from-emerald-500/20 to-teal-500/20 border border-emerald-500/30' 
                              : 'bg-white/5'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                              check.completed ? 'bg-emerald-500' : 'bg-gray-600'
                            }`}>
                              {check.completed ? (
                                <CheckCircle className="w-4 h-4 text-white" />
                              ) : (
                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" />
                              )}
                            </div>
                            <span className="text-white text-sm">{check.name}</span>
                          </div>
                          {check.completed && (
                            <Badge variant="outline" className="text-emerald-400 border-emerald-400/30 text-xs">
                              Verified
                            </Badge>
                          )}
                        </motion.div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
            
            {/* Feature Description */}
            <div className="p-10 flex flex-col justify-center order-1 lg:order-2">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-r from-emerald-400 via-teal-500 to-cyan-600 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500 shadow-2xl">
                <Shield className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-3xl font-bold text-white mb-6">Enterprise Security</h3>
              <p className="text-gray-300 leading-relaxed text-lg mb-6">
                Bank-level encryption and multi-layered security protocols protect your data at every level. Experience our security measures in real-time.
              </p>
              <div className="grid grid-cols-1 gap-3 mb-6">
                {securityFeatures.map((feature) => (
                  <div key={feature.label} className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-emerald-400/20 to-teal-500/20 rounded-lg flex items-center justify-center">
                      <feature.icon className="w-4 h-4 text-emerald-400" />
                    </div>
                    <div className="flex-1">
                      <div className="text-white text-sm font-medium">{feature.label}</div>
                      <div className="text-emerald-400 text-xs">{feature.value}</div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex flex-wrap gap-2">
                <Badge className="bg-emerald-500/20 text-emerald-300 border-0">
                  Interactive Demo
                </Badge>
                <Badge className="bg-teal-500/20 text-teal-300 border-0">
                  Real-time
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default SecurityDemo;