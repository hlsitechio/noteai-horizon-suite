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
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="group w-full max-w-7xl mx-auto"
    >
      <Card className="bg-gradient-to-br from-slate-900/5 to-slate-800/5 backdrop-blur-xl border-0 transition-all duration-500 rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(168,85,247,0.3)] hover:shadow-2xl">
        <CardContent className="p-0">
          {/* Feature Description - Compact Header */}
          <div className="p-6 text-center bg-gradient-to-r from-purple-900/20 via-blue-900/20 to-pink-900/20">
            <div className="flex items-center justify-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-purple-400 via-pink-500 to-red-600 flex items-center justify-center group-hover:scale-110 transition-transform duration-500 shadow-xl">
                <Eye className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white mb-1">Focus Mode Experience</h3>
                <Badge className="bg-purple-500/20 text-purple-300 border-0 text-xs">
                  Interactive Demo
                </Badge>
              </div>
            </div>
            <p className="text-gray-300 leading-relaxed text-base max-w-3xl mx-auto">
              Experience distraction-free writing with real-time stats and advanced editor controls.
            </p>
          </div>
            
          {/* Live Demo - 16:9 Landscape Container */}
          <div className="bg-black/40 relative overflow-hidden" style={{ aspectRatio: '16/9' }}>
            <Tabs defaultValue="focus-mode" className="h-full">
              <TabsList className="absolute top-4 left-4 z-20 bg-black/50 backdrop-blur-md border border-white/20">
                <TabsTrigger value="focus-mode" className="text-white data-[state=active]:bg-purple-600 data-[state=active]:text-white text-sm px-4 py-2">
                  Focus Mode
                </TabsTrigger>
                <TabsTrigger value="editor-test" className="text-white data-[state=active]:bg-purple-600 data-[state=active]:text-white text-sm px-4 py-2">
                  Editor Test
                </TabsTrigger>
              </TabsList>

              <TabsContent value="focus-mode" className="mt-0 h-full pt-16">{/* Added pt-16 to avoid tab overlap */}
                {!isInFocusMode ? (
                  /* Normal Editor View */
                  <div className="h-full flex flex-col">
                    {/* Editor Header */}
                    <div className="bg-gradient-to-r from-blue-50/5 via-purple-50/5 to-pink-50/5 p-3 flex-shrink-0">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Button
                            onClick={handleFocusModeToggle}
                            size="sm"
                            className="bg-purple-600 hover:bg-purple-700 text-white text-xs"
                          >
                            <Eye className="w-3 h-3 mr-1" />
                            Focus
                          </Button>
                          <Button size="sm" variant="ghost" className="text-white/70 hover:text-white">
                            <Heart className="w-3 h-3" />
                          </Button>
                          <Button size="sm" variant="ghost" className="text-white/70 hover:text-white">
                            <Save className="w-3 h-3 mr-1" />
                            Save
                          </Button>
                        </div>
                        <Button size="sm" variant="ghost" className="text-white/70 hover:text-white">
                          <Sparkles className="w-3 h-3 mr-1" />
                          AI
                        </Button>
                      </div>
                    </div>

                    {/* Editor Content */}
                    <div className="flex-1 p-4 flex gap-4">
                      <div className="flex-1 space-y-3">
                        <input
                          type="text"
                          value={title}
                          onChange={(e) => setTitle(e.target.value)}
                          className="w-full bg-transparent outline-none text-white text-lg font-bold placeholder-white/50"
                          placeholder="Your title here..."
                        />
                        
                        <div className="bg-white/5 rounded-lg p-3 flex-1 backdrop-blur-sm border-0">
                          <Textarea
                            value={content}
                            onChange={(e) => handleContentChange(e.target.value)}
                            placeholder="Start writing your story..."
                            className="w-full h-32 bg-transparent outline-none text-white placeholder-white/50 resize-none text-sm leading-relaxed border-0"
                          />
                        </div>
                      </div>

                      {/* Sidebar */}
                      <div className="w-48 space-y-3">
                        <div className="bg-white/5 rounded-lg p-3 border-0">
                          <div className="text-white/60 text-xs mb-1">Category</div>
                          <div className="text-white text-sm">Personal</div>
                        </div>
                        <div className="bg-white/5 rounded-lg p-3 border-0">
                          <div className="text-white/60 text-xs mb-1">Words</div>
                          <div className="text-white text-sm">{content.trim().split(/\s+/).length}</div>
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
                    <div className="p-8 h-full flex flex-col">
                      <motion.input
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full bg-transparent outline-none text-white text-2xl font-bold mb-6 placeholder-white/50"
                        placeholder="Your masterpiece title..."
                      />
                      
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="flex-1"
                      >
                        <Textarea
                          value={content}
                          onChange={(e) => handleContentChange(e.target.value)}
                          placeholder="Focus on your writing... Let your thoughts flow without any distractions."
                          className="w-full h-full bg-transparent outline-none text-white placeholder-white/30 resize-none text-base leading-relaxed border-0"
                        />
                      </motion.div>

                      {/* Focus Stats */}
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="flex justify-between text-white/40 text-sm bg-white/5 rounded-lg p-3 backdrop-blur-sm border-0 mt-4"
                      >
                        <span>Words: {focusStats.words}</span>
                        <span>Time: {formatTime(focusStats.time)}</span>
                        <span>WPM: {focusStats.wpm}</span>
                      </motion.div>
                    </div>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="editor-test" className="mt-0 h-full pt-16 overflow-hidden">
                <div className="p-4 h-full overflow-auto">
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
