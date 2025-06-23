
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Zap, Shield, Users, Eye, Brain, FileText, Play, X } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const Features = () => {
  const [activeDemo, setActiveDemo] = useState<string | null>(null);

  const features = [
    {
      icon: <Sparkles className="w-8 h-8" />,
      title: 'AI-Powered Intelligence',
      description: 'Advanced AI assistance to enhance your productivity and streamline your workflow with intelligent suggestions.',
      gradient: 'from-cyan-400 via-blue-500 to-purple-600',
      glow: 'shadow-[0_0_50px_rgba(6,182,212,0.3)]',
      demoType: 'ai-assistant'
    },
    {
      icon: <Eye className="w-8 h-8" />,
      title: 'Focus Mode Experience',
      description: 'Immersive distraction-free writing environment with customizable ambience and zen features.',
      gradient: 'from-purple-400 via-pink-500 to-red-600',
      glow: 'shadow-[0_0_50px_rgba(168,85,247,0.3)]',
      demoType: 'focus-mode'
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

  const FocusModeDemo = () => (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl flex items-center justify-center p-4"
    >
      <div className="relative w-full max-w-4xl h-[80vh] bg-gradient-to-br from-slate-900 to-black rounded-3xl overflow-hidden border border-white/20 shadow-2xl">
        <Button
          onClick={() => setActiveDemo(null)}
          className="absolute top-4 right-4 z-10 bg-white/10 hover:bg-white/20 text-white rounded-full p-2"
        >
          <X className="w-5 h-5" />
        </Button>
        
        <div className="h-full p-12 flex flex-col">
          <Badge className="w-fit mb-6 bg-purple-500/20 text-purple-300 border-purple-500/30">
            Focus Mode Demo
          </Badge>
          
          <motion.input
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            type="text"
            placeholder="Your masterpiece title..."
            className="w-full bg-transparent border-none outline-none text-white placeholder-white/50 text-4xl font-bold mb-8 leading-tight"
          />
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex-1 bg-white/5 rounded-2xl p-8 backdrop-blur-sm border border-white/10"
          >
            <div className="text-white/80 text-lg leading-relaxed">
              <div className="animate-pulse">
                <div className="h-4 bg-white/20 rounded mb-4 w-3/4"></div>
                <div className="h-4 bg-white/20 rounded mb-4 w-full"></div>
                <div className="h-4 bg-white/20 rounded mb-4 w-5/6"></div>
                <div className="h-4 bg-white/20 rounded mb-8 w-2/3"></div>
                <div className="h-4 bg-white/20 rounded mb-4 w-4/5"></div>
                <div className="h-4 bg-white/20 rounded mb-4 w-full"></div>
                <div className="h-4 bg-white/20 rounded w-1/2"></div>
              </div>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-6 flex items-center justify-between text-white/60 text-sm"
          >
            <span>Words: 247 | Time: 5:32 | WPM: 45</span>
            <span>Press Ctrl+S to save</span>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );

  const AIAssistantDemo = () => (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl flex items-center justify-center p-4"
    >
      <div className="relative w-full max-w-5xl h-[80vh] bg-gradient-to-br from-slate-900 to-black rounded-3xl overflow-hidden border border-white/20 shadow-2xl">
        <Button
          onClick={() => setActiveDemo(null)}
          className="absolute top-4 right-4 z-10 bg-white/10 hover:bg-white/20 text-white rounded-full p-2"
        >
          <X className="w-5 h-5" />
        </Button>
        
        <div className="h-full flex">
          {/* Main Content */}
          <div className="flex-1 p-8">
            <Badge className="mb-6 bg-cyan-500/20 text-cyan-300 border-cyan-500/30">
              AI Assistant Demo
            </Badge>
            
            <div className="bg-white/5 rounded-2xl p-6 h-[60%] mb-6 backdrop-blur-sm border border-white/10">
              <div className="text-white/90 space-y-4">
                <h3 className="text-2xl font-bold mb-4">The Future of AI Writing</h3>
                <p className="text-lg leading-relaxed">
                  Artificial intelligence is revolutionizing how we approach creative writing and content creation. 
                  With advanced language models, writers can now <span className="bg-blue-500/30 px-2 py-1 rounded">collaborate with AI</span> to enhance their productivity and creativity.
                </p>
                <p className="text-lg leading-relaxed text-white/70">
                  This technology enables seamless integration of human creativity with machine intelligence...
                </p>
              </div>
            </div>
          </div>
          
          {/* AI Assistant Sidebar */}
          <motion.div
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="w-80 bg-gradient-to-b from-slate-800/50 to-slate-900/50 backdrop-blur-lg border-l border-white/10 p-6"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center">
                <Brain className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-white font-semibold">AI Assistant</h3>
                <p className="text-white/60 text-sm">Smart suggestions</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-white/10 rounded-xl p-4 border border-white/20"
              >
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-4 h-4 text-yellow-400" />
                  <span className="text-white font-medium text-sm">Improve Writing</span>
                </div>
                <p className="text-white/70 text-xs">
                  Enhanced version with better clarity and flow
                </p>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="bg-white/10 rounded-xl p-4 border border-white/20"
              >
                <div className="flex items-center gap-2 mb-2">
                  <FileText className="w-4 h-4 text-green-400" />
                  <span className="text-white font-medium text-sm">Continue Writing</span>
                </div>
                <p className="text-white/70 text-xs">
                  "Furthermore, this opens up new possibilities for creative collaboration..."
                </p>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 }}
                className="bg-white/10 rounded-xl p-4 border border-white/20"
              >
                <div className="flex items-center gap-2 mb-2">
                  <Zap className="w-4 h-4 text-purple-400" />
                  <span className="text-white font-medium text-sm">Change Tone</span>
                </div>
                <p className="text-white/70 text-xs">
                  Professional, casual, creative options
                </p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );

  return (
    <section id="features" className="py-32 px-4 relative">
      <div className="max-w-6xl mx-auto">
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
            Discover the powerful capabilities that make our platform the ultimate choice for modern professionals.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.2, duration: 0.8 }}
              className="group relative"
            >
              <Card className={`h-full bg-gradient-to-br from-slate-900/50 to-slate-800/30 border-2 border-white/10 hover:border-white/30 backdrop-blur-xl transition-all duration-500 hover:scale-105 rounded-3xl overflow-hidden ${feature.glow} hover:shadow-2xl`}>
                <CardContent className="p-10">
                  <div className={`w-20 h-20 rounded-2xl bg-gradient-to-r ${feature.gradient} flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500 shadow-2xl`}>
                    {React.cloneElement(feature.icon, { className: "w-10 h-10 text-white" })}
                  </div>
                  <h3 className="text-3xl font-bold text-white mb-6">{feature.title}</h3>
                  <p className="text-gray-300 leading-relaxed text-lg mb-6">{feature.description}</p>
                  
                  {feature.demoType && (
                    <Button
                      onClick={() => setActiveDemo(feature.demoType)}
                      className={`bg-gradient-to-r ${feature.gradient} hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl`}
                    >
                      <Play className="w-4 h-4 mr-2" />
                      Try Demo
                    </Button>
                  )}
                </CardContent>
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Demo Modals */}
      <AnimatePresence>
        {activeDemo === 'focus-mode' && <FocusModeDemo />}
        {activeDemo === 'ai-assistant' && <AIAssistantDemo />}
      </AnimatePresence>
    </section>
  );
};

export default Features;
