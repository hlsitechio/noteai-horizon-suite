
import React, { useState, useRef, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { 
  Command, Sparkles, Brain, Wand2, Search, 
  ArrowRight, Clock, MapPin, Zap, X 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useQuantumAI } from '@/contexts/QuantumAIContext';
import { useEnhancedAIChat } from '@/hooks/useEnhancedAIChat';

const QuantumAIInterface: React.FC = () => {
  const { state, hideAssistant, addToMemory, getRelevantMemory } = useQuantumAI();
  const { sendMessage, isLoading } = useEnhancedAIChat();
  const [input, setInput] = useState('');
  const [response, setResponse] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-focus input when visible
  useEffect(() => {
    if (state.isVisible && inputRef.current) {
      inputRef.current.focus();
    }
  }, [state.isVisible]);

  // Pre-fill input based on selected text
  useEffect(() => {
    if (state.mode === 'selection' && state.selectedText) {
      setInput(`Help me with: "${state.selectedText}"`);
    } else if (state.mode === 'command') {
      setInput('');
    }
  }, [state.mode, state.selectedText]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    try {
      // Build context with current page and selected text
      const contextPrompt = `
Current context:
- Page: ${state.currentContext.page}
- Selected text: ${state.selectedText || 'None'}
- Recent actions: ${getRelevantMemory(input).map(m => `${m.action}: ${m.context}`).join(', ') || 'None'}

User request: ${input}
      `;

      const messages = [{
        id: Date.now().toString(),
        content: contextPrompt,
        isUser: true,
        timestamp: new Date()
      }];

      const aiResponse = await sendMessage(messages);
      setResponse(aiResponse);
      
      // Add to memory
      addToMemory(input, state.currentContext.page, aiResponse);
      
      setInput('');
    } catch (error) {
      console.error('Quantum AI error:', error);
    }
  };

  const getInterfacePosition = () => {
    if (state.mode === 'selection' && state.position) {
      return {
        position: 'fixed' as const,
        left: state.position.x,
        top: state.position.y,
        transform: 'translate(-50%, -100%)',
        zIndex: 9999
      };
    }
    
    // Command palette - center of screen
    return {
      position: 'fixed' as const,
      left: '50%',
      top: '30%',
      transform: 'translate(-50%, -50%)',
      zIndex: 9999
    };
  };

  const getVariants = () => {
    if (state.mode === 'selection') {
      return {
        initial: { opacity: 0, scale: 0.8, y: 10 },
        animate: { opacity: 1, scale: 1, y: 0 },
        exit: { opacity: 0, scale: 0.8, y: 10 }
      };
    }
    
    return {
      initial: { opacity: 0, scale: 0.95, y: -20 },
      animate: { opacity: 1, scale: 1, y: 0 },
      exit: { opacity: 0, scale: 0.95, y: -20 }
    };
  };

  if (!state.isVisible) return null;

  return (
    <>
      {/* Backdrop for command palette */}
      {state.mode === 'command' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[9998]"
          onClick={hideAssistant}
        />
      )}

      <AnimatePresence>
        <motion.div
          style={getInterfacePosition()}
          variants={getVariants()}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={{ duration: 0.2, ease: "easeOut" }}
        >
          <Card className={`
            ${state.mode === 'selection' ? 'w-80' : 'w-[600px]'} 
            border-2 border-purple-200/50 shadow-2xl bg-white/95 backdrop-blur-xl
          `}>
            <CardContent className="p-0">
              {/* Header */}
              <div className="p-4 border-b border-purple-100/50 bg-gradient-to-r from-purple-50 to-blue-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg">
                      <Brain className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-800">Quantum AI</h3>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="bg-purple-100 text-purple-700 text-xs">
                          {state.mode === 'selection' ? 'Context Mode' : 'Command Mode'}
                        </Badge>
                        <Badge variant="secondary" className="bg-blue-100 text-blue-700 text-xs flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {state.currentContext.page.replace('/app/', '') || 'Home'}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={hideAssistant}
                    className="h-8 w-8 p-0 hover:bg-red-100 text-gray-500 hover:text-red-600"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Selected Text Preview */}
              {state.selectedText && (
                <div className="p-3 bg-blue-50/50 border-b border-blue-100/50">
                  <div className="text-xs text-blue-600 mb-1 font-medium">SELECTED TEXT</div>
                  <div className="text-sm text-gray-700 bg-white/80 rounded p-2 border border-blue-200/30">
                    "{state.selectedText.slice(0, 150)}{state.selectedText.length > 150 ? '...' : ''}"
                  </div>
                </div>
              )}

              {/* Input Form */}
              <form onSubmit={handleSubmit} className="p-4">
                <div className="flex gap-2">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      ref={inputRef}
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder={state.mode === 'selection' ? 'What would you like me to do with this text?' : 'Ask me anything or describe what you need help with...'}
                      className="pl-10 border-purple-200 focus:border-purple-400 focus:ring-purple-400/20"
                      disabled={isLoading}
                    />
                  </div>
                  <Button 
                    type="submit" 
                    disabled={!input.trim() || isLoading}
                    className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                  >
                    {isLoading ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      >
                        <Sparkles className="w-4 h-4" />
                      </motion.div>
                    ) : (
                      <ArrowRight className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </form>

              {/* Response */}
              {response && (
                <div className="p-4 border-t border-gray-100">
                  <div className="flex items-center gap-2 mb-2">
                    <Zap className="w-4 h-4 text-green-500" />
                    <span className="text-sm font-medium text-gray-700">AI Response</span>
                  </div>
                  <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-lg p-3 text-sm text-gray-700 leading-relaxed border border-green-200/30">
                    {response}
                  </div>
                </div>
              )}

              {/* Quick Actions for Selection Mode */}
              {state.mode === 'selection' && !response && (
                <div className="p-4 border-t border-gray-100">
                  <div className="text-xs text-gray-500 mb-2">QUICK ACTIONS</div>
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setInput('Improve this text')}
                      className="justify-start text-xs h-8"
                    >
                      <Wand2 className="w-3 h-3 mr-1" />
                      Improve
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setInput('Summarize this')}
                      className="justify-start text-xs h-8"
                    >
                      <Command className="w-3 h-3 mr-1" />
                      Summarize
                    </Button>
                  </div>
                </div>
              )}

              {/* Keyboard Shortcuts */}
              <div className="px-4 py-2 border-t border-gray-100/50 bg-gray-50/30">
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <div className="flex items-center gap-4">
                    <span>⌘K to open anywhere</span>
                    <span>ESC to close</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>{new Date().toLocaleTimeString()}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </AnimatePresence>
    </>
  );
};

export default QuantumAIInterface;
