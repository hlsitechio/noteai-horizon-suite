
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Brain, Languages, Lightbulb, Copy, Check, Bot } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

const AIAssistantDemo = () => {
  const [aiSelectedText, setAiSelectedText] = useState('');
  const [aiResult, setAiResult] = useState('');
  const [aiProcessing, setAiProcessing] = useState(false);
  const [copied, setCopied] = useState(false);

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

  return (
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
  );
};

export default AIAssistantDemo;
