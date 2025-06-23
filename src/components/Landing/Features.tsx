import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Zap, Shield, Users, Eye, Brain, FileText, Send, Bot, Languages, Lightbulb, Copy, Check } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

const Features = () => {
  // Focus Mode Demo State
  const [focusTitle, setFocusTitle] = useState('');
  const [focusContent, setFocusContent] = useState('');
  const [focusStats, setFocusStats] = useState({ words: 0, time: 0, wpm: 0 });
  const [focusStartTime, setFocusStartTime] = useState<number | null>(null);

  // AI Assistant Demo State
  const [aiSelectedText, setAiSelectedText] = useState('');
  const [aiAction, setAiAction] = useState<string>('');
  const [aiResult, setAiResult] = useState('');
  const [aiProcessing, setAiProcessing] = useState(false);
  const [aiLanguage, setAiLanguage] = useState('es');
  const [copied, setCopied] = useState(false);

  // Focus Mode Demo Functions
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

  // AI Assistant Demo Functions
  const simulateAI = async (action: string, text: string) => {
    setAiProcessing(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    let result = '';
    switch (action) {
      case 'improve':
        result = `Enhanced: ${text.charAt(0).toUpperCase() + text.slice(1)}. This improved version provides better clarity and flow while maintaining the original meaning.`;
        break;
      case 'translate':
        result = `[Spanish]: ${text} (Esta es una traducción simulada)`;
        break;
      case 'summarize':
        result = `Summary: ${text.split(' ').slice(0, Math.max(5, Math.floor(text.split(' ').length / 3))).join(' ')}...`;
        break;
      default:
        result = `Processed: ${text}`;
    }
    
    setAiResult(result);
    setAiProcessing(false);
    toast.success('AI processing completed!');
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(aiResult);
      setCopied(true);
      toast.success('Copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error('Failed to copy text');
    }
  };

  const features = [
    {
      icon: <Eye className="w-8 h-8" />,
      title: 'Focus Mode Experience',
      description: 'Immersive distraction-free writing environment with real-time stats and zen features.',
      gradient: 'from-purple-400 via-pink-500 to-red-600',
      glow: 'shadow-[0_0_50px_rgba(168,85,247,0.3)]',
      demoType: 'focus-mode'
    },
    {
      icon: <Sparkles className="w-8 h-8" />,
      title: 'AI-Powered Intelligence',
      description: 'Advanced AI assistance to enhance your productivity with intelligent text processing.',
      gradient: 'from-cyan-400 via-blue-500 to-purple-600',
      glow: 'shadow-[0_0_50px_rgba(6,182,212,0.3)]',
      demoType: 'ai-assistant'
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: 'Lightning Fast Performance',
      description: 'Optimized for speed with instant responses and real-time collaboration across all your devices.',
      gradient: 'from-yellow-400 via-orange-500 to-red-600',
      glow: 'shadow-[0_0_50px_rgba(251,191,36,0.3)]'
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: 'Enterprise Security',
      description: 'Bank-level encryption and security protocols to keep your data safe and protected at all times.',
      gradient: 'from-emerald-400 via-teal-500 to-cyan-600',
      glow: 'shadow-[0_0_50px_rgba(16,185,129,0.3)]'
    }
  ];

  return (
    <section id="features" className="py-32 px-4 relative">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <h2 className="text-5xl md:text-6xl font-bold mb-8 bg-gradient-to-r from-white via-cyan-200 to-blue-200 bg-clip-text text-transparent">
            Revolutionary Features
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Experience the power of our platform with these interactive demos. Try them right here!
          </p>
        </motion.div>

        <div className="space-y-20">
          {/* Focus Mode Demo */}
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

          {/* AI Assistant Demo */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="group"
          >
            <Card className="bg-gradient-to-br from-slate-900/50 to-slate-800/30 border-2 border-white/10 hover:border-cyan-500/30 backdrop-blur-xl transition-all duration-500 rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(6,182,212,0.3)] hover:shadow-2xl">
              <CardContent className="p-0">
                <div className="grid lg:grid-cols-2 gap-0">
                  {/* Live Demo */}
                  <div className="bg-black/40 p-8 border-r border-white/10 order-2 lg:order-1">
                    <div className="space-y-4">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center">
                          <Brain className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h3 className="text-white font-semibold">AI Assistant Demo</h3>
                          <p className="text-white/60 text-sm">Try the AI features below</p>
                        </div>
                      </div>
                      
                      <Textarea
                        placeholder="Enter some text to process with AI..."
                        value={aiSelectedText}
                        onChange={(e) => setAiSelectedText(e.target.value)}
                        className="w-full bg-white/10 border border-white/20 text-white placeholder-white/50 rounded-xl min-h-[100px]"
                      />
                      
                      <div className="grid grid-cols-3 gap-2">
                        <Button 
                          size="sm" 
                          onClick={() => simulateAI('improve', aiSelectedText)}
                          disabled={!aiSelectedText.trim() || aiProcessing}
                          className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:scale-105 transition-all"
                        >
                          <Sparkles className="w-4 h-4 mr-1" />
                          Improve
                        </Button>
                        <Button 
                          size="sm" 
                          onClick={() => simulateAI('translate', aiSelectedText)}
                          disabled={!aiSelectedText.trim() || aiProcessing}
                          className="bg-gradient-to-r from-green-500 to-teal-600 hover:scale-105 transition-all"
                        >
                          <Languages className="w-4 h-4 mr-1" />
                          Translate
                        </Button>
                        <Button 
                          size="sm" 
                          onClick={() => simulateAI('summarize', aiSelectedText)}
                          disabled={!aiSelectedText.trim() || aiProcessing}
                          className="bg-gradient-to-r from-purple-500 to-pink-600 hover:scale-105 transition-all"
                        >
                          <Lightbulb className="w-4 h-4 mr-1" />
                          Summary
                        </Button>
                      </div>
                      
                      {aiProcessing && (
                        <div className="flex items-center justify-center py-4">
                          <div className="flex items-center gap-2 text-sm text-white/60">
                            <Bot className="w-4 h-4 animate-pulse" />
                            <span>AI is processing...</span>
                          </div>
                        </div>
                      )}
                      
                      {aiResult && (
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <Badge variant="secondary" className="bg-cyan-500/20 text-cyan-300 border-cyan-500/30">
                              AI Result
                            </Badge>
                            <Button variant="ghost" size="sm" onClick={handleCopy}>
                              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                            </Button>
                          </div>
                          <div className="bg-white/10 p-3 rounded-lg text-sm text-white/90 max-h-32 overflow-y-auto">
                            {aiResult}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Feature Description */}
                  <div className="p-10 flex flex-col justify-center order-1 lg:order-2">
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500 shadow-2xl">
                      <Sparkles className="w-10 h-10 text-white" />
                    </div>
                    <h3 className="text-3xl font-bold text-white mb-6">AI-Powered Intelligence</h3>
                    <p className="text-gray-300 leading-relaxed text-lg mb-6">
                      Advanced AI assistance to enhance your productivity with intelligent text processing. 
                      Enter some text and try our AI features - improve writing, translate, or summarize content instantly!
                    </p>
                    <Badge className="w-fit bg-cyan-500/20 text-cyan-300 border-cyan-500/30">
                      Try It Now
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Other Features - Static Cards */}
          <div className="grid md:grid-cols-2 gap-8">
            {features.slice(2).map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2, duration: 0.8 }}
                className="group relative"
              >
                <Card className={`h-full bg-gradient-to-br from-slate-900/50 to-slate-800/30 border-2 border-white/10 hover:border-white/30 backdrop-blur-xl transition-all duration-500 hover:scale-105 rounded-3xl overflow-hidden ${feature.glow} hover:shadow-2xl`}>
                  <CardContent className="p-10">
                    <div className={`w-20 h-20 rounded-2xl bg-gradient-to-r ${feature.gradient} flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500 shadow-2xl`}>
                      {React.cloneElement(feature.icon, { className: "w-10 h-10 text-white" })}
                    </div>
                    <h3 className="text-3xl font-bold text-white mb-6">{feature.title}</h3>
                    <p className="text-gray-300 leading-relaxed text-lg">{feature.description}</p>
                  </CardContent>
                  <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
