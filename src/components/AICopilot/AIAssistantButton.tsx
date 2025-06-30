
import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, Sparkles, Wand2, MessageSquare, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useAICopilot } from '@/hooks/useAICopilot';
import { toast } from 'sonner';

interface AIAssistantButtonProps {
  selectedText?: string;
  onTextReplace?: (text: string) => void;
  onTextInsert?: (text: string) => void;
  position?: { x: number; y: number };
  className?: string;
}

const AIAssistantButton: React.FC<AIAssistantButtonProps> = ({
  selectedText = '',
  onTextReplace,
  onTextInsert,
  position,
  className = ''
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [result, setResult] = useState('');
  const { processText, isLoading } = useAICopilot();
  const buttonRef = useRef<HTMLButtonElement>(null);

  const quickActions = [
    { 
      label: 'Improve', 
      action: 'improve', 
      icon: Wand2, 
      description: 'Enhance clarity and flow',
      color: 'from-blue-500 to-purple-500'
    },
    { 
      label: 'Summarize', 
      action: 'summarize', 
      icon: MessageSquare, 
      description: 'Create concise summary',
      color: 'from-green-500 to-teal-500'
    },
    { 
      label: 'Expand', 
      action: 'expand', 
      icon: Sparkles, 
      description: 'Add more detail',
      color: 'from-orange-500 to-red-500'
    },
    { 
      label: 'Simplify', 
      action: 'simplify', 
      icon: Brain, 
      description: 'Make it clearer',
      color: 'from-purple-500 to-pink-500'
    }
  ];

  const handleQuickAction = async (action: string) => {
    if (!selectedText.trim()) {
      toast.error('Please select some text first');
      return;
    }

    try {
      const response = await processText({
        action: action as any,
        text: selectedText,
      });
      
      setResult(response.result);
      toast.success(`Text ${action}d successfully!`);
    } catch (error) {
      console.error('AI processing error:', error);
      toast.error('Failed to process text');
    }
  };

  const handleCustomPrompt = async () => {
    if (!prompt.trim()) {
      toast.error('Please enter a prompt');
      return;
    }

    const textToProcess = selectedText || prompt;
    
    try {
      const response = await processText({
        action: 'custom',
        text: textToProcess,
        customPrompt: prompt,
      });
      
      setResult(response.result);
      toast.success('AI response generated!');
    } catch (error) {
      console.error('AI processing error:', error);
      toast.error('Failed to process request');
    }
  };

  const handleApplyResult = () => {
    if (result && selectedText && onTextReplace) {
      onTextReplace(result);
      toast.success('Text replaced successfully!');
    } else if (result && onTextInsert) {
      onTextInsert(result);
      toast.success('Text inserted successfully!');
    }
    setIsOpen(false);
    setResult('');
    setPrompt('');
  };

  const buttonStyle = position ? {
    position: 'fixed' as const,
    left: position.x,
    top: position.y,
    transform: 'translate(-50%, -100%)',
    zIndex: 1000
  } : {};

  return (
    <>
      <motion.div style={buttonStyle} className={className}>
        <Button
          ref={buttonRef}
          onClick={() => setIsOpen(true)}
          className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
          size="sm"
        >
          <Brain className="w-4 h-4 mr-2" />
          AI Assistant
          <Sparkles className="w-3 h-3 ml-1" />
        </Button>
      </motion.div>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[9998]"
              onClick={() => setIsOpen(false)}
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-[9999] w-[600px] max-w-[90vw]"
            >
              <Card className="border-2 border-purple-200/50 shadow-2xl bg-white/95 backdrop-blur-xl">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg">
                        <Brain className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="font-bold text-xl text-gray-800">AI Assistant</h3>
                        <p className="text-sm text-gray-600">Enhance your writing with AI</p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsOpen(false)}
                      className="h-8 w-8 p-0 hover:bg-red-100 text-gray-500 hover:text-red-600"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>

                  {selectedText && (
                    <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                          Selected Text
                        </Badge>
                      </div>
                      <div className="text-sm text-gray-700 bg-white/80 rounded p-3 border border-blue-200/50 max-h-32 overflow-y-auto">
                        "{selectedText.slice(0, 300)}{selectedText.length > 300 ? '...' : ''}"
                      </div>
                    </div>
                  )}

                  <div className="space-y-6">
                    {/* Quick Actions */}
                    <div>
                      <h4 className="font-semibold mb-3 text-gray-800">Quick Actions</h4>
                      <div className="grid grid-cols-2 gap-3">
                        {quickActions.map((action) => (
                          <Button
                            key={action.action}
                            variant="outline"
                            onClick={() => handleQuickAction(action.action)}
                            disabled={isLoading || !selectedText}
                            className={`h-auto p-4 flex flex-col items-start gap-2 hover:bg-gradient-to-r hover:${action.color} hover:text-white transition-all duration-200`}
                          >
                            <div className="flex items-center gap-2">
                              <action.icon className="w-4 h-4" />
                              <span className="font-medium">{action.label}</span>
                            </div>
                            <span className="text-xs opacity-75">{action.description}</span>
                          </Button>
                        ))}
                      </div>
                    </div>

                    {/* Custom Prompt */}
                    <div>
                      <h4 className="font-semibold mb-3 text-gray-800">Custom Prompt</h4>
                      <div className="space-y-3">
                        <Textarea
                          placeholder="Describe what you want the AI to do with your text..."
                          value={prompt}
                          onChange={(e) => setPrompt(e.target.value)}
                          className="min-h-[80px] border-purple-200 focus:border-purple-400 focus:ring-purple-400/20"
                        />
                        <Button
                          onClick={handleCustomPrompt}
                          disabled={isLoading || !prompt.trim()}
                          className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                        >
                          {isLoading ? (
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                              className="mr-2"
                            >
                              <Sparkles className="w-4 h-4" />
                            </motion.div>
                          ) : (
                            <Wand2 className="w-4 h-4 mr-2" />
                          )}
                          {isLoading ? 'Processing...' : 'Process with AI'}
                        </Button>
                      </div>
                    </div>

                    {/* Results */}
                    {result && (
                      <div className="space-y-3">
                        <h4 className="font-semibold text-gray-800">AI Result</h4>
                        <div className="p-4 bg-gradient-to-br from-green-50 to-blue-50 rounded-lg border border-green-200">
                          <div className="text-sm text-gray-700 leading-relaxed max-h-48 overflow-y-auto">
                            {result}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            onClick={handleApplyResult}
                            className="flex-1 bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700"
                          >
                            {selectedText ? 'Replace Text' : 'Insert Text'}
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() => setResult('')}
                          >
                            Clear
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default AIAssistantButton;
