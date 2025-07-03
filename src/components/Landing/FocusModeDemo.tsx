import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, X, Maximize2, Clock, Target, Zap } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import EditorControlsTest from '@/components/Editor/EditorControlsTest';

const FocusModeDemo = () => {
  const [isInFocusMode, setIsInFocusMode] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [focusStartTime, setFocusStartTime] = useState<number | null>(null);
  const [showStats, setShowStats] = useState(true);

  // Auto-typing effect for demo
  const demoText = "Focus Mode transforms your writing environment into a sanctuary of productivity. Every distraction fades away, leaving only you and your thoughts flowing freely onto the page...";
  const [autoText, setAutoText] = useState('');
  const [autoIndex, setAutoIndex] = useState(0);

  useEffect(() => {
    if (isInFocusMode && autoIndex < demoText.length) {
      const timer = setTimeout(() => {
        setAutoText(demoText.slice(0, autoIndex + 1));
        setAutoIndex(autoIndex + 1);
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [isInFocusMode, autoIndex]);

  const handleFocusModeToggle = () => {
    setIsInFocusMode(!isInFocusMode);
    if (!isInFocusMode) {
      setFocusStartTime(Date.now());
      setTitle('My Masterpiece');
      setContent('');
      setAutoText('');
      setAutoIndex(0);
    } else {
      setContent(autoText);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="group w-full max-w-7xl mx-auto"
    >
      <Card className="bg-gradient-to-br from-slate-900/5 to-slate-800/5 backdrop-blur-xl border-0 transition-all duration-500 rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(168,85,247,0.3)] hover:shadow-2xl">
        <CardContent className="p-0">
          {/* Feature Description */}
          <div className="p-8 text-center bg-gradient-to-r from-purple-900/20 via-blue-900/20 to-pink-900/20">
            <div className="flex items-center justify-center gap-6 mb-6">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-purple-400 via-pink-500 to-red-600 flex items-center justify-center group-hover:scale-110 transition-transform duration-500 shadow-2xl">
                <Eye className="w-8 h-8 text-white" />
              </div>
              <div className="text-left">
                <h3 className="text-3xl font-bold text-white mb-2">Focus Mode Experience</h3>
                <Badge className="bg-purple-500/20 text-purple-300 border-0">
                  Interactive Demo
                </Badge>
              </div>
            </div>
            <p className="text-gray-300 leading-relaxed text-lg max-w-4xl mx-auto">
              Enter a distraction-free zone where only your words matter. Experience seamless writing with real-time analytics.
            </p>
          </div>
            
          {/* Live Demo */}
          <div className="bg-black/40 relative overflow-hidden" style={{ aspectRatio: '16/9', minHeight: '500px' }}>
            <Tabs defaultValue="focus-mode" className="h-full">
              <TabsList className="absolute top-6 left-6 z-20 bg-black/50 backdrop-blur-md border border-white/20">
                <TabsTrigger value="focus-mode" className="text-white data-[state=active]:bg-purple-600 data-[state=active]:text-white text-sm px-4 py-2">
                  Focus Mode
                </TabsTrigger>
                <TabsTrigger value="editor-test" className="text-white data-[state=active]:bg-purple-600 data-[state=active]:text-white text-sm px-4 py-2">
                  Editor Test
                </TabsTrigger>
              </TabsList>

              <TabsContent value="focus-mode" className="mt-0 h-full">
                <AnimatePresence mode="wait">
                  {!isInFocusMode ? (
                    /* Normal Editor View */
                    <motion.div
                      key="normal"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="h-full flex flex-col"
                    >
                      {/* Editor Toolbar */}
                      <div className="bg-gradient-to-r from-slate-800/50 to-slate-700/50 p-4 border-b border-white/10 mt-16">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <Button
                              onClick={handleFocusModeToggle}
                              size="sm"
                              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-medium px-4 py-2 shadow-lg"
                            >
                              <Maximize2 className="w-4 h-4 mr-2" />
                              Enter Focus Mode
                            </Button>
                            <div className="text-white/60 text-sm">Transform your writing experience</div>
                          </div>
                          <div className="flex items-center gap-2 text-white/40 text-sm">
                            <Clock className="w-4 h-4" />
                            <span>Ready to focus</span>
                          </div>
                        </div>
                      </div>

                      {/* Preview Content */}
                      <div className="flex-1 p-8 flex items-center justify-center">
                        <div className="max-w-2xl text-center space-y-6">
                          <div className="text-white/30 text-sm uppercase tracking-wider">Preview Mode</div>
                          <h2 className="text-3xl font-bold text-white/80">Ready to Focus?</h2>
                          <p className="text-white/60 text-lg leading-relaxed">
                            Click "Enter Focus Mode" to experience distraction-free writing with immersive backgrounds, 
                            real-time stats, and an environment designed for deep focus.
                          </p>
                          <div className="flex items-center justify-center gap-6 pt-4">
                            <div className="flex items-center gap-2 text-white/40">
                              <Target className="w-5 h-5" />
                              <span className="text-sm">Distraction-Free</span>
                            </div>
                            <div className="flex items-center gap-2 text-white/40">
                              <Zap className="w-5 h-5" />
                              <span className="text-sm">Real-time Stats</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ) : (
                    /* Focus Mode View */
                    <motion.div
                      key="focus"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.5, ease: "easeOut" }}
                      className="h-full bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 relative overflow-hidden"
                    >
                      {/* Ambient Background Effects */}
                      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(139,69,244,0.1),transparent_50%)]" />
                      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(219,39,119,0.1),transparent_50%)]" />
                      
                      {/* Focus Mode Controls */}
                      <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="absolute top-6 right-6 z-10 flex items-center gap-3"
                      >
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setShowStats(!showStats)}
                          className="bg-white/10 backdrop-blur-md border border-white/20 rounded-lg p-2 text-white/70 hover:text-white transition-colors"
                        >
                          <Clock className="w-4 h-4" />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={handleFocusModeToggle}
                          className="bg-white/10 backdrop-blur-md border border-white/20 rounded-lg p-2 text-white/70 hover:text-white transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </motion.button>
                      </motion.div>

                      {/* Writing Area */}
                      <div className="h-full flex flex-col justify-center items-center p-12">
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.2 }}
                          className="w-full max-w-4xl space-y-8"
                        >
                          {/* Title Input */}
                          <motion.input
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.3 }}
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full bg-transparent outline-none text-white text-4xl font-bold text-center placeholder-white/30 border-b border-white/20 pb-4"
                            placeholder="Your masterpiece begins here..."
                          />
                          
                          {/* Content Area */}
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.4 }}
                            className="relative"
                          >
                            <Textarea
                              value={autoText}
                              onChange={() => {}}
                              placeholder="Let your thoughts flow freely..."
                              className="w-full min-h-[200px] bg-transparent outline-none text-white text-xl leading-relaxed placeholder-white/30 resize-none border-0 text-center"
                              readOnly
                            />
                            {/* Typing cursor effect */}
                            {isInFocusMode && autoIndex < demoText.length && (
                              <motion.div
                                animate={{ opacity: [1, 0, 1] }}
                                transition={{ duration: 1, repeat: Infinity }}
                                className="absolute inline-block w-0.5 h-6 bg-purple-400"
                                style={{
                                  left: '50%',
                                  top: `${Math.floor(autoText.length / 80) * 1.5 + 1}rem`,
                                  transform: 'translateX(-50%)'
                                }}
                              />
                            )}
                          </motion.div>
                        </motion.div>
                      </div>

                      {/* Focus Stats */}
                      <AnimatePresence>
                        {showStats && (
                          <motion.div
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 50 }}
                            className="absolute bottom-6 left-1/2 transform -translate-x-1/2"
                          >
                            <div className="bg-black/30 backdrop-blur-xl border border-white/20 rounded-2xl px-8 py-4 flex items-center gap-8">
                              <div className="text-center">
                                <div className="text-white text-2xl font-bold">{autoText.trim().split(/\s+/).filter(word => word.length > 0).length}</div>
                                <div className="text-white/60 text-sm">Words</div>
                              </div>
                              <div className="text-center">
                                <div className="text-white text-2xl font-bold">{formatTime(Math.floor(autoIndex / 20))}</div>
                                <div className="text-white/60 text-sm">Time</div>
                              </div>
                              <div className="text-center">
                                <div className="text-white text-2xl font-bold">{Math.floor(Math.random() * 20) + 40}</div>
                                <div className="text-white/60 text-sm">WPM</div>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  )}
                </AnimatePresence>
              </TabsContent>

              <TabsContent value="editor-test" className="mt-0 h-full pt-20">
                <div className="p-6 h-full">
                  <EditorControlsTest />
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default FocusModeDemo;