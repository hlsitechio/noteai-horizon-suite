import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { SparklesIcon, WrenchScrewdriverIcon, LanguageIcon, DocumentTextIcon, PlusIcon, MinusIcon, PencilIcon } from '@heroicons/react/24/outline';

interface AIAssistantBarProps {
  selectedText?: string;
  onAIProcess: (action: string, customInstruction?: string) => void;
  onClose: () => void;
}

const AIAssistantBar: React.FC<AIAssistantBarProps> = ({
  selectedText,
  onAIProcess,
  onClose
}) => {
  const [customInstruction, setCustomInstruction] = useState('');
  const [showCustom, setShowCustom] = useState(false);

  const aiActions = [
    { id: 'improve', label: 'Improve', icon: SparklesIcon, color: 'from-blue-500 to-purple-500' },
    { id: 'translate', label: 'Translate', icon: LanguageIcon, color: 'from-green-500 to-teal-500' },
    { id: 'summarize', label: 'Summarize', icon: DocumentTextIcon, color: 'from-purple-500 to-pink-500' },
    { id: 'expand', label: 'Expand', icon: PlusIcon, color: 'from-orange-500 to-red-500' },
    { id: 'simplify', label: 'Simplify', icon: MinusIcon, color: 'from-teal-500 to-blue-500' },
    { id: 'fix-grammar', label: 'Fix Grammar', icon: WrenchScrewdriverIcon, color: 'from-pink-500 to-purple-500' },
  ];

  const handleActionClick = (actionId: string) => {
    onAIProcess(actionId);
  };

  const handleCustomProcess = () => {
    if (customInstruction.trim()) {
      onAIProcess('custom', customInstruction);
      setCustomInstruction('');
      setShowCustom(false);
    }
  };

  return (
    <div className="bg-gray-900/95 border-t border-gray-400/30 p-4 animate-fade-in">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <SparklesIcon className="w-5 h-5 text-purple-400" />
          <span className="text-sm font-medium text-gray-200">AI Assistant</span>
          {selectedText && (
            <span className="text-xs text-gray-400 bg-gray-800 px-2 py-1 rounded">
              "{selectedText.slice(0, 30)}..."
            </span>
          )}
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="h-6 w-6 p-0 text-gray-400 hover:text-white"
        >
          ×
        </Button>
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        {aiActions.map(({ id, label, icon: Icon, color }) => (
          <Button
            key={id}
            variant="ghost"
            size="sm"
            onClick={() => handleActionClick(id)}
            className={`h-8 px-3 bg-gradient-to-r ${color} hover:opacity-90 text-white border border-white/20 shadow-md hover:shadow-lg transition-all duration-200 hover:scale-105`}
          >
            <Icon className="w-3 h-3 mr-1.5" />
            {label}
          </Button>
        ))}
        
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowCustom(!showCustom)}
          className="h-8 px-3 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-500 hover:to-gray-600 text-white border border-gray-400/30"
        >
          <PencilIcon className="w-3 h-3 mr-1.5" />
          Custom
        </Button>
      </div>

      {showCustom && (
        <div className="mt-3 animate-fade-in">
          <div className="flex gap-2">
            <Textarea
              value={customInstruction}
              onChange={(e) => setCustomInstruction(e.target.value)}
              placeholder="Tell the AI what you want to do with the text..."
              className="flex-1 h-20 text-sm bg-gray-800 border-gray-600 text-gray-200 placeholder-gray-400 resize-none"
            />
            <Button
              onClick={handleCustomProcess}
              disabled={!customInstruction.trim()}
              className="h-20 px-4 bg-gradient-to-r from-purple-500 via-blue-500 to-cyan-500 hover:from-purple-600 hover:via-blue-600 hover:to-cyan-600 border border-purple-400/30"
            >
              <SparklesIcon className="w-4 h-4 mr-2" />
              Process
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIAssistantBar;