
import React, { useState, useEffect } from 'react';
import { 
  Wand2, Palette, Type, ArrowUp, ArrowDown, 
  Sparkles, Brain, RefreshCw, Copy, X 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
} from '@/components/ui/context-menu';

interface TextSelectionContextMenuProps {
  selectedText: string;
  onTextReplace: (newText: string) => void;
  onTextInsert: (text: string) => void;
  position: { x: number; y: number } | null;
  onClose: () => void;
}

const toneOptions = [
  { id: 'professional', label: 'Professional', icon: '💼' },
  { id: 'casual', label: 'Casual', icon: '😊' },
  { id: 'creative', label: 'Creative', icon: '🎨' },
  { id: 'academic', label: 'Academic', icon: '🎓' },
  { id: 'persuasive', label: 'Persuasive', icon: '💪' },
  { id: 'friendly', label: 'Friendly', icon: '🌟' },
];

const styleOptions = [
  { id: 'simplify', label: 'Simplify', icon: '✂️' },
  { id: 'elaborate', label: 'Elaborate', icon: '📖' },
  { id: 'bullet-points', label: 'Bullet Points', icon: '•' },
  { id: 'paragraph', label: 'Paragraph', icon: '📄' },
];

const TextSelectionContextMenu: React.FC<TextSelectionContextMenuProps> = ({
  selectedText,
  onTextReplace,
  onTextInsert,
  position,
  onClose
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeAction, setActiveAction] = useState<string | null>(null);

  const simulateAIProcessing = async (action: string, option?: string): Promise<string> => {
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    switch (action) {
      case 'tone':
        return `[${option?.charAt(0).toUpperCase()}${option?.slice(1)} tone] ${selectedText}`;
      case 'style-simplify':
        return selectedText.split(' ').slice(0, Math.max(5, Math.floor(selectedText.split(' ').length / 2))).join(' ') + '.';
      case 'style-elaborate':
        return `${selectedText} This concept deserves deeper exploration, as it encompasses multiple dimensions that warrant careful consideration and analysis.`;
      case 'make-longer':
        return `${selectedText} Furthermore, this point can be expanded with additional context and supporting details that provide a more comprehensive understanding of the subject matter.`;
      case 'make-shorter':
        return selectedText.split(' ').slice(0, Math.max(3, Math.floor(selectedText.split(' ').length / 3))).join(' ') + '...';
      case 'improve':
        return `Enhanced: ${selectedText.charAt(0).toUpperCase() + selectedText.slice(1)}`;
      case 'continue':
        return `${selectedText} Additionally, this leads to further insights and opens up new possibilities for exploration and development.`;
      default:
        return `AI-processed: ${selectedText}`;
    }
  };

  const handleAction = async (action: string, option?: string) => {
    if (!selectedText) return;
    
    setIsProcessing(true);
    setActiveAction(action);
    
    try {
      const result = await simulateAIProcessing(action, option);
      onTextReplace(result);
      onClose();
    } catch (error) {
      console.error('AI processing failed:', error);
    } finally {
      setIsProcessing(false);
      setActiveAction(null);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(selectedText);
    onClose();
  };

  if (!position || !selectedText) return null;

  return (
    <div 
      className="fixed z-50 animate-scale-in"
      style={{ 
        left: position.x,
        top: position.y - 10,
        transform: 'translate(-50%, -100%)'
      }}
    >
      <div className="bg-black/95 backdrop-blur-xl border border-gray-700/50 rounded-2xl shadow-2xl p-4 min-w-[320px]">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-purple-500/20 rounded-lg">
              <Wand2 className="w-4 h-4 text-purple-400" />
            </div>
            <span className="text-white font-medium text-sm">AI Assistant</span>
            <Badge className="bg-purple-500/20 text-purple-300 text-xs">
              Pro
            </Badge>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onClose}
            className="text-gray-400 hover:text-white hover:bg-gray-800 h-6 w-6 p-0"
          >
            <X className="w-3 h-3" />
          </Button>
        </div>

        {/* Selected Text Preview */}
        <div className="bg-gray-800/50 rounded-lg p-3 mb-4 border border-gray-700/30">
          <div className="text-gray-400 text-xs mb-1 flex items-center gap-1">
            <Type className="w-3 h-3" />
            SELECTED TEXT
          </div>
          <div className="text-gray-200 text-sm max-h-16 overflow-y-auto">
            "{selectedText.slice(0, 100)}{selectedText.length > 100 ? '...' : ''}"
          </div>
        </div>

        {isProcessing ? (
          <div className="flex items-center justify-center py-8">
            <div className="text-center">
              <div className="w-8 h-8 bg-purple-500 rounded-full animate-pulse flex items-center justify-center mx-auto mb-2">
                <Brain className="w-4 h-4 text-white animate-bounce" />
              </div>
              <div className="text-white text-sm font-medium">Processing...</div>
              <div className="text-gray-400 text-xs">AI is enhancing your text</div>
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            {/* Quick Actions */}
            <div className="grid grid-cols-2 gap-2 mb-3">
              <Button
                onClick={() => handleAction('improve')}
                className="bg-gray-800 hover:bg-gray-700 text-white border border-gray-600 h-auto p-3 flex flex-col items-center gap-1"
              >
                <Sparkles className="w-4 h-4 text-blue-400" />
                <span className="text-xs">Improve</span>
              </Button>
              <Button
                onClick={() => handleAction('continue')}
                className="bg-gray-800 hover:bg-gray-700 text-white border border-gray-600 h-auto p-3 flex flex-col items-center gap-1"
              >
                <RefreshCw className="w-4 h-4 text-green-400" />
                <span className="text-xs">Continue</span>
              </Button>
            </div>

            {/* Context Menu Actions */}
            <ContextMenu>
              <ContextMenuTrigger asChild>
                <Button
                  className="w-full bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/30 justify-start"
                >
                  <Palette className="w-4 h-4 mr-2" />
                  Change Tone
                </Button>
              </ContextMenuTrigger>
              <ContextMenuContent className="bg-black/95 border-gray-700 text-white min-w-[200px]">
                {toneOptions.map((tone) => (
                  <ContextMenuItem 
                    key={tone.id}
                    onClick={() => handleAction('tone', tone.id)}
                    className="hover:bg-gray-800 focus:bg-gray-800 text-gray-200 hover:text-white"
                  >
                    <span className="mr-2">{tone.icon}</span>
                    {tone.label}
                  </ContextMenuItem>
                ))}
              </ContextMenuContent>
            </ContextMenu>

            <ContextMenu>
              <ContextMenuTrigger asChild>
                <Button
                  className="w-full bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 border border-blue-500/30 justify-start"
                >
                  <Type className="w-4 h-4 mr-2" />
                  Change Style
                </Button>
              </ContextMenuTrigger>
              <ContextMenuContent className="bg-black/95 border-gray-700 text-white min-w-[200px]">
                {styleOptions.map((style) => (
                  <ContextMenuItem 
                    key={style.id}
                    onClick={() => handleAction(`style-${style.id}`)}
                    className="hover:bg-gray-800 focus:bg-gray-800 text-gray-200 hover:text-white"
                  >
                    <span className="mr-2">{style.icon}</span>
                    {style.label}
                  </ContextMenuItem>
                ))}
              </ContextMenuContent>
            </ContextMenu>

            {/* Size Controls */}
            <div className="flex gap-2">
              <Button
                onClick={() => handleAction('make-longer')}
                className="flex-1 bg-green-600/20 hover:bg-green-600/30 text-green-300 border border-green-500/30 justify-center"
              >
                <ArrowUp className="w-4 h-4 mr-1" />
                Longer
              </Button>
              <Button
                onClick={() => handleAction('make-shorter')}
                className="flex-1 bg-orange-600/20 hover:bg-orange-600/30 text-orange-300 border border-orange-500/30 justify-center"
              >
                <ArrowDown className="w-4 h-4 mr-1" />
                Shorter
              </Button>
            </div>

            {/* Copy Action */}
            <Button
              onClick={copyToClipboard}
              className="w-full bg-gray-700/50 hover:bg-gray-600/50 text-gray-300 border border-gray-600/30 justify-start"
            >
              <Copy className="w-4 h-4 mr-2" />
              Copy Text
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TextSelectionContextMenu;
