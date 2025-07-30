
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Brain, Languages, Lightbulb, Copy, Check, Bot, RotateCcw } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

const preBuiltExamples = {
  improve: {
    input: "The weather is good today. I think I will go outside.",
    output: "The weather is absolutely beautiful today, with clear skies and perfect temperature. I'm excited to step outside and enjoy this wonderful day in nature."
  },
  translate: {
    input: "Hello, how are you doing today?",
    output: "[Spanish]: Hola, ¿cómo estás hoy? (This is a simulated translation to Spanish)"
  },
  summarize: {
    input: "Artificial intelligence has revolutionized many industries by automating complex tasks, improving efficiency, and enabling new capabilities that were previously impossible. From healthcare to finance, AI is transforming how we work and live.",
    output: "Summary: AI has transformed industries through automation, efficiency improvements, and new capabilities across healthcare, finance, and other sectors."
  }
};

const AIAssistantDemo = () => {
  const [aiSelectedText, setAiSelectedText] = useState('');
  const [aiResult, setAiResult] = useState('');
  const [aiProcessing, setAiProcessing] = useState(false);
  const [copied, setCopied] = useState(false);
  const [activeExample, setActiveExample] = useState<string | null>(null);

  const simulateAI = async (action: string, text: string) => {
    setAiProcessing(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    let result = '';
    switch (action) {
      case 'improve':
        result = text === preBuiltExamples.improve.input 
          ? preBuiltExamples.improve.output
          : `Enhanced: ${text.charAt(0).toUpperCase() + text.slice(1)}. This improved version provides better clarity and flow while maintaining the original meaning.`;
        break;
      case 'translate':
        result = text === preBuiltExamples.translate.input
          ? preBuiltExamples.translate.output
          : `[Spanish]: ${text} (Esta es una traducción simulada)`;
        break;
      case 'summarize':
        result = text === preBuiltExamples.summarize.input
          ? preBuiltExamples.summarize.output
          : `Summary: ${text.split(' ').slice(0, Math.max(5, Math.floor(text.split(' ').length / 3))).join(' ')}...`;
        break;
      default:
        result = `Processed: ${text}`;
    }
    
    setAiResult(result);
    setAiProcessing(false);
    toast.success('AI processing completed!');
  };

  const handleExampleClick = (type: string) => {
    const example = preBuiltExamples[type as keyof typeof preBuiltExamples];
    setActiveExample(type);
    setAiSelectedText(example.input);
    setAiResult('');
    setTimeout(() => {
      simulateAI(type, example.input);
    }, 300);
  };

  const handleCustomAction = (action: string) => {
    if (!aiSelectedText.trim()) {
      toast.error('Please enter some text first or try one of our examples!');
      return;
    }
    setActiveExample(null);
    simulateAI(action, aiSelectedText);
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

  const resetDemo = () => {
    setAiSelectedText('');
    setAiResult('');
    setActiveExample(null);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8 }}
      className="group"
    >
      <Card className="bg-gradient-to-br from-slate-900/5 to-slate-800/5 backdrop-blur-xl border-0 transition-all duration-500 rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(6,182,212,0.3)] hover:shadow-2xl">
        <CardContent className="p-0">
          <div className="grid lg:grid-cols-2 gap-0">
            {/* Live Demo */}
            <div className="bg-black/40 p-8 order-2 lg:order-1">
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center">
                      <Brain className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-white font-bold text-lg">AI Assistant Demo</h3>
                      <p className="text-white/80 text-base">Try the AI features below</p>
                    </div>
                  </div>
                  {(aiSelectedText || aiResult) && (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={resetDemo}
                      className="text-white/70 hover:text-white"
                    >
                      <RotateCcw className="w-4 h-4" />
                    </Button>
                  )}
                </div>

                {/* Example Buttons */}
                <div className="space-y-4">
                  <p className="text-white/90 text-base font-medium">Try these examples:</p>
                  <div className="grid gap-3">
                    <Button 
                      size="lg" 
                      onClick={() => handleExampleClick('improve')}
                      disabled={aiProcessing}
                      className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:scale-105 transition-all justify-start text-left h-auto p-4 relative overflow-hidden"
                    >
                      <div className="absolute inset-0 bg-black/40" />
                      <Sparkles className="w-5 h-5 mr-3 flex-shrink-0" />
                      <div className="text-left">
                        <div className="font-semibold text-base drop-shadow-md text-white">Improve Writing</div>
                        <div className="text-sm opacity-90 leading-relaxed">Make text clearer and more engaging</div>
                      </div>
                    </Button>
                    <Button 
                      size="lg" 
                      onClick={() => handleExampleClick('translate')}
                      disabled={aiProcessing}
                      className="bg-gradient-to-r from-green-500 to-teal-600 hover:scale-105 transition-all justify-start text-left h-auto p-4 relative overflow-hidden"
                    >
                      <div className="absolute inset-0 bg-black/40" />
                      <Languages className="w-5 h-5 mr-3 flex-shrink-0" />
                      <div className="text-left">
                        <div className="font-semibold text-base drop-shadow-md text-white">Translate Text</div>
                        <div className="text-sm opacity-90 leading-relaxed">Convert to different languages</div>
                      </div>
                    </Button>
                    <Button 
                      size="lg" 
                      onClick={() => handleExampleClick('summarize')}
                      disabled={aiProcessing}
                      className="bg-gradient-to-r from-purple-500 to-pink-600 hover:scale-105 transition-all justify-start text-left h-auto p-4 relative overflow-hidden"
                    >
                      <div className="absolute inset-0 bg-black/40" />
                      <Lightbulb className="w-5 h-5 mr-3 flex-shrink-0" />
                      <div className="text-left">
                        <div className="font-semibold text-base drop-shadow-md text-white">Summarize Content</div>
                        <div className="text-sm opacity-90 leading-relaxed">Extract key points and insights</div>
                      </div>
                    </Button>
                  </div>
                </div>

                <div className="border-t border-white/10 pt-6">
                  <p className="text-white/90 text-base font-medium mb-4">Or enter your own text:</p>
                  
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeExample || 'custom'}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Textarea
                        placeholder="Enter some text to process with AI..."
                        value={aiSelectedText}
                        onChange={(e) => setAiSelectedText(e.target.value)}
                        className="w-full bg-white/10 border-0 text-white placeholder-white/60 rounded-xl min-h-[120px] text-base leading-relaxed"
                      />
                    </motion.div>
                  </AnimatePresence>
                  
                  {!activeExample && (
                    <div className="grid grid-cols-3 gap-2 mt-3">
                      <Button 
                        size="sm" 
                        onClick={() => handleCustomAction('improve')}
                        disabled={!aiSelectedText.trim() || aiProcessing}
                        className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:scale-105 transition-all"
                      >
                        <Sparkles className="w-4 h-4 mr-1" />
                        Improve
                      </Button>
                      <Button 
                        size="sm" 
                        onClick={() => handleCustomAction('translate')}
                        disabled={!aiSelectedText.trim() || aiProcessing}
                        className="bg-gradient-to-r from-green-500 to-teal-600 hover:scale-105 transition-all"
                      >
                        <Languages className="w-4 h-4 mr-1" />
                        Translate
                      </Button>
                      <Button 
                        size="sm" 
                        onClick={() => handleCustomAction('summarize')}
                        disabled={!aiSelectedText.trim() || aiProcessing}
                        className="bg-gradient-to-r from-purple-500 to-pink-600 hover:scale-105 transition-all"
                      >
                        <Lightbulb className="w-4 h-4 mr-1" />
                        Summary
                      </Button>
                    </div>
                  )}
                </div>
                
                {aiProcessing && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex items-center justify-center py-6"
                  >
                    <div className="flex items-center gap-3 text-base text-white/80">
                      <div className="w-10 h-10 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-full flex items-center justify-center">
                        <Bot className="w-5 h-5 animate-pulse text-white" />
                      </div>
                      <span className="font-medium">AI is processing...</span>
                    </div>
                  </motion.div>
                )}
                
                <AnimatePresence>
                  {aiResult && (
                    <motion.div 
                      initial={{ opacity: 0, y: 20, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -20, scale: 0.95 }}
                      transition={{ duration: 0.4, ease: "easeOut" }}
                      className="space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <Badge variant="secondary" className="bg-gradient-to-r from-cyan-500/20 to-purple-500/20 text-cyan-300 border-0">
                          ✨ AI Result
                        </Badge>
                        <Button variant="ghost" size="sm" onClick={handleCopy}>
                          {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                        </Button>
                      </div>
                      <div className="bg-gradient-to-br from-white/10 to-white/5 p-4 rounded-xl text-sm text-white/90 max-h-40 overflow-y-auto border-0">
                        {aiResult}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
            
            {/* Feature Description */}
            <div className="p-10 flex flex-col justify-center order-1 lg:order-2">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500 shadow-2xl">
                <Sparkles className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-3xl font-bold text-white mb-6">AI-Powered Intelligence</h3>
              <p className="text-gray-300 leading-relaxed text-lg mb-6">
                Experience the power of advanced AI assistance with intelligent text processing. 
                Try our pre-built examples or enter your own text to see AI enhance, translate, or summarize content instantly!
              </p>
              <div className="flex flex-wrap gap-2">
                <Badge className="bg-cyan-500/20 text-cyan-300 border-0">
                  Try Examples
                </Badge>
                <Badge className="bg-purple-500/20 text-purple-300 border-0">
                  Custom Text
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default AIAssistantDemo;
