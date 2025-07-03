import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Eye, X, Heart, Save, Sparkles } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import EditorControlsTest from '@/components/Editor/EditorControlsTest';

const FocusModeDemo = () => {
  const [isInFocusMode, setIsInFocusMode] = useState(false);
  const [title, setTitle] = useState('My Amazing Story');
  const [content, setContent] = useState('Once upon a time, in a world where writers could focus without distractions...');
  const [focusStats, setFocusStats] = useState({ words: 12, time: 0, wpm: 0 });
  const [focusStartTime, setFocusStartTime] = useState<number | null>(null);

  const handleContentChange = (value: string) => {
    setContent(value);
    if (isInFocusMode) {
      const words = value.trim() ? value.trim().split(/\s+/).length : 0;
      const timeElapsed = focusStartTime ? Math.floor((Date.now() - focusStartTime) / 1000) : 0;
      const wpm = timeElapsed > 0 ? Math.round((words / timeElapsed) * 60) : 0;
      
      setFocusStats({ words, time: timeElapsed, wpm });
      
      if (!focusStartTime && value.length > 0) {
        setFocusStartTime(Date.now());
      }
    }
  };

  const handleFocusModeToggle = () => {
    setIsInFocusMode(!isInFocusMode);
    if (!isInFocusMode) {
      setFocusStartTime(Date.now());
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -50 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8 }}
      className="group"
    >
      <Card className="bg-gradient-to-br from-slate-900/5 to-slate-800/5 backdrop-blur-xl border-0 transition-all duration-500 rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(168,85,247,0.3)] hover:shadow-2xl">
        <CardContent className="p-0">
          <div className="grid lg:grid-cols-2 gap-0">
            {/* Feature Description */}
            <div className="p-10 flex flex-col justify-center">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-r from-purple-400 via-pink-500 to-red-600 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500 shadow-2xl">
                <Eye className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-3xl font-bold text-white mb-6">Focus Mode Experience</h3>
              <p className="text-gray-300 leading-relaxed text-lg mb-6">
                Transform your writing environment into a distraction-free zone. Click the focus button in the demo to experience our immersive writing mode with real-time stats.
              </p>
              <Badge className="w-fit bg-purple-500/20 text-purple-300 border-0">
                Interactive Demo
              </Badge>
            </div>
            
            {/* Live Demo */}
            <div className="bg-black/40 p-0 relative overflow-hidden">
              <Tabs defaultValue="focus-mode" className="h-full">
                <TabsList className="m-4 bg-white/5 border-0">
                  <TabsTrigger value="focus-mode" className="text-white data-[state=active]:bg-purple-600 data-[state=active]:text-white">
                    Focus Mode
                  </TabsTrigger>
                  <TabsTrigger value="editor-test" className="text-white data-[state=active]:bg-purple-600 data-[state=active]:text-white">
                    Editor Test
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="focus-mode" className="mt-0 h-[calc(100%-60px)]">
                  {!isInFocusMode ? (
                    /* Normal Editor View */
                    <div className="h-full">
                      {/* Editor Header */}
                      <div className="bg-gradient-to-r from-blue-50/5 via-purple-50/5 to-pink-50/5 p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Button
                              onClick={handleFocusModeToggle}
                              size="sm"
                              className="bg-purple-600 hover:bg-purple-700 text-white"
                            >
                              <Eye className="w-4 h-4 mr-1" />
                              Focus
                            </Button>
                            <Button size="sm" variant="ghost" className="text-white/70 hover:text-white">
                              <Heart className="w-4 h-4" />
                            </Button>
                            <Button size="sm" variant="ghost" className="text-white/70 hover:text-white">
                              <Save className="w-4 h-4 mr-1" />
                              Save
                            </Button>
                          </div>
                          <Button size="sm" variant="ghost" className="text-white/70 hover:text-white">
                            <Sparkles className="w-4 h-4 mr-1" />
                            AI
                          </Button>
                        </div>
                      </div>

                      {/* Editor Content */}
                      <div className="p-6 space-y-4">
                        <input
                          type="text"
                          value={title}
                          onChange={(e) => setTitle(e.target.value)}
                          className="w-full bg-transparent outline-none text-white text-2xl font-bold placeholder-white/50"
                          placeholder="Your title here..."
                        />
                        
                        <div className="bg-white/5 rounded-xl p-4 min-h-[200px] backdrop-blur-sm border-0">
                          <Textarea
                            value={content}
                            onChange={(e) => handleContentChange(e.target.value)}
                            placeholder="Start writing your story..."
                            className="w-full h-full bg-transparent outline-none text-white placeholder-white/50 resize-none text-base leading-relaxed border-0"
                          />
                        </div>

                        {/* Sidebar Preview */}
                        <div className="flex gap-4">
                          <div className="flex-1">
                            <div className="bg-white/5 rounded-lg p-3 border-0">
                              <div className="text-white/60 text-xs mb-2">Category</div>
                              <div className="text-white text-sm">Personal</div>
                            </div>
                          </div>
                          <div className="flex-1">
                            <div className="bg-white/5 rounded-lg p-3 border-0">
                              <div className="text-white/60 text-xs mb-2">Words</div>
                              <div className="text-white text-sm">{content.trim().split(/\s+/).length}</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    /* Focus Mode View */
                    <div className="h-full bg-black/90 relative">
                      {/* Focus Mode Header */}
                      <div className="absolute top-4 right-4 z-10">
                        <Button
                          onClick={handleFocusModeToggle}
                          size="sm"
                          variant="ghost"
                          className="text-white/70 hover:text-white"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>

                      {/* Focus Mode Content */}
                      <div className="p-8 pt-16 h-full">
                        <motion.input
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          type="text"
                          value={title}
                          onChange={(e) => setTitle(e.target.value)}
                          className="w-full bg-transparent outline-none text-white text-3xl font-bold mb-8 placeholder-white/50"
                          placeholder="Your masterpiece title..."
                        />
                        
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.1 }}
                          className="h-[calc(100%-140px)]"
                        >
                          <Textarea
                            value={content}
                            onChange={(e) => handleContentChange(e.target.value)}
                            placeholder="Focus on your writing... Let your thoughts flow without any distractions."
                            className="w-full h-full bg-transparent outline-none text-white placeholder-white/30 resize-none text-lg leading-relaxed"
                          />
                        </motion.div>

                        {/* Focus Stats */}
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.2 }}
                          className="absolute bottom-4 left-8 right-8 flex justify-between text-white/40 text-sm bg-white/5 rounded-lg p-3 backdrop-blur-sm border-0"
                        >
                          <span>Words: {focusStats.words}</span>
                          <span>Time: {formatTime(focusStats.time)}</span>
                          <span>WPM: {focusStats.wpm}</span>
                        </motion.div>
                      </div>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="editor-test" className="mt-0 h-[calc(100%-60px)] overflow-auto">
                  <div className="p-4 h-full">
                    <EditorControlsTest />
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default FocusModeDemo;
