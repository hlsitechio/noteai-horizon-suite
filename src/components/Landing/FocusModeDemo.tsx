
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Eye } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';

const FocusModeDemo = () => {
  const [focusTitle, setFocusTitle] = useState('');
  const [focusContent, setFocusContent] = useState('');
  const [focusStats, setFocusStats] = useState({ words: 0, time: 0, wpm: 0 });
  const [focusStartTime, setFocusStartTime] = useState<number | null>(null);

  const handleFocusContentChange = (value: string) => {
    setFocusContent(value);
    const words = value.trim() ? value.trim().split(/\s+/).length : 0;
    const timeElapsed = focusStartTime ? Math.floor((Date.now() - focusStartTime) / 1000) : 0;
    const wpm = timeElapsed > 0 ? Math.round((words / timeElapsed) * 60) : 0;
    
    setFocusStats({ words, time: timeElapsed, wpm });
    
    if (!focusStartTime && value.length > 0) {
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
      <Card className="bg-gradient-to-br from-slate-900/50 to-slate-800/30 border-2 border-white/10 hover:border-purple-500/30 backdrop-blur-xl transition-all duration-500 rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(168,85,247,0.3)] hover:shadow-2xl">
        <CardContent className="p-0">
          <div className="grid lg:grid-cols-2 gap-0">
            {/* Feature Description */}
            <div className="p-10 flex flex-col justify-center">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-r from-purple-400 via-pink-500 to-red-600 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500 shadow-2xl">
                <Eye className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-3xl font-bold text-white mb-6">Focus Mode Experience</h3>
              <p className="text-gray-300 leading-relaxed text-lg mb-6">
                Immersive distraction-free writing environment with real-time stats and zen features. 
                Try typing in the demo editor and watch your stats update live!
              </p>
              <Badge className="w-fit bg-purple-500/20 text-purple-300 border-purple-500/30">
                Interactive Demo
              </Badge>
            </div>
            
            {/* Live Demo */}
            <div className="bg-black/40 p-8 border-l border-white/10">
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Your masterpiece title..."
                  value={focusTitle}
                  onChange={(e) => setFocusTitle(e.target.value)}
                  className="w-full bg-transparent border-none outline-none text-white placeholder-white/50 text-2xl font-bold"
                />
                
                <div className="bg-white/5 rounded-xl p-4 min-h-[200px] backdrop-blur-sm border border-white/10">
                  <Textarea
                    placeholder="Start writing and watch your stats update in real-time..."
                    value={focusContent}
                    onChange={(e) => handleFocusContentChange(e.target.value)}
                    className="w-full h-full bg-transparent border-none outline-none text-white placeholder-white/50 resize-none text-lg leading-relaxed"
                  />
                </div>
                
                <div className="flex justify-between text-white/60 text-sm bg-white/5 rounded-lg p-3">
                  <span>Words: {focusStats.words}</span>
                  <span>Time: {formatTime(focusStats.time)}</span>
                  <span>WPM: {focusStats.wpm}</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default FocusModeDemo;
