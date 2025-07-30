import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { 
  SparklesIcon, 
  ChatBubbleLeftIcon,
  PencilIcon,
  LanguageIcon,
  DocumentTextIcon,
  BoltIcon
} from '@heroicons/react/24/outline';
import { useEnhancedAIChat } from '@/hooks/useEnhancedAIChat';
import { useToast } from '@/hooks/useToast';

interface AIAssistantToolbarProps {
  editor: any;
  className?: string;
}

export const AIAssistantToolbar: React.FC<AIAssistantToolbarProps> = ({
  editor,
  className = ""
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedAction, setSelectedAction] = useState<string | null>(null);
  const { sendMessage, isLoading } = useEnhancedAIChat();
  const { toast } = useToast();

  const getSelectedText = () => {
    const { from, to } = editor.state.selection;
    return editor.state.doc.textBetween(from, to, ' ');
  };

  const replaceSelectedText = (newText: string) => {
    const { from, to } = editor.state.selection;
    editor.chain().focus().deleteRange({ from, to }).insertContent(newText).run();
  };

  const insertTextAtCursor = (text: string) => {
    editor.chain().focus().insertContent(text).run();
  };

  const handleAIAction = async (action: string, customPrompt?: string) => {
    setIsProcessing(true);
    setSelectedAction(action);
    
    try {
      const selectedText = getSelectedText();
      const hasSelection = selectedText.trim().length > 0;
      
      let prompt = '';
      
      switch (action) {
        case 'improve':
          prompt = hasSelection 
            ? `Please improve this text while maintaining its meaning: "${selectedText}"`
            : 'Please help me write better content for this document.';
          break;
        case 'translate':
          prompt = hasSelection
            ? `Please translate this text to Spanish: "${selectedText}"`
            : 'Please help me translate content.';
          break;
        case 'summarize':
          prompt = hasSelection
            ? `Please create a concise summary of this text: "${selectedText}"`
            : 'Please help me summarize content.';
          break;
        case 'expand':
          prompt = hasSelection
            ? `Please expand on this text with more details and context: "${selectedText}"`
            : 'Please help me expand my content with more details.';
          break;
        case 'grammar':
          prompt = hasSelection
            ? `Please fix any grammar and spelling errors in this text: "${selectedText}"`
            : 'Please help me check grammar and spelling.';
          break;
        case 'custom':
          prompt = customPrompt || 'Please help me with this content.';
          if (hasSelection) {
            prompt += ` Selected text: "${selectedText}"`;
          }
          break;
        default:
          prompt = hasSelection
            ? `Please help me with this text: "${selectedText}"`
            : 'Please help me improve my writing.';
      }

      const messages = [
        {
          id: Date.now().toString(),
          content: prompt,
          isUser: true,
          timestamp: new Date()
        }
      ];

      const response = await sendMessage(messages);
      
      if (hasSelection && action !== 'custom') {
        // Replace selected text for improvement actions
        replaceSelectedText(response);
        toast.success(`Text ${action}d successfully!`);
      } else {
        // Insert at cursor for new content
        insertTextAtCursor('\n\n' + response);
        toast.success('AI content added successfully!');
      }

    } catch (error: any) {
      console.error('AI action failed:', error);
      toast.error(`AI ${action} failed: ${error.message}`);
    } finally {
      setIsProcessing(false);
      setSelectedAction(null);
    }
  };

  const aiActions = [
    {
      id: 'improve',
      label: 'Improve Writing',
      icon: PencilIcon,
      description: 'Enhance clarity and style'
    },
    {
      id: 'grammar',
      label: 'Fix Grammar',
      icon: DocumentTextIcon,
      description: 'Correct grammar and spelling'
    },
    {
      id: 'expand',
      label: 'Expand Content',
      icon: BoltIcon,
      description: 'Add more details and context'
    },
    {
      id: 'summarize',
      label: 'Summarize',
      icon: DocumentTextIcon,
      description: 'Create a concise summary'
    },
    {
      id: 'translate',
      label: 'Translate',
      icon: LanguageIcon,
      description: 'Translate to Spanish'
    }
  ];

  const selectedText = getSelectedText();
  const hasSelection = selectedText.trim().length > 0;

  return (
    <div className={`flex items-center gap-2 p-2 bg-muted/30 rounded-lg border ${className}`}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="h-8 px-3 bg-gradient-to-r from-primary/10 to-secondary/10 hover:from-primary/20 hover:to-secondary/20 border-primary/20"
            disabled={isLoading || isProcessing}
          >
            <SparklesIcon className="w-4 h-4 mr-1.5" />
            AI Assistant
            {selectedAction && (
              <span className="ml-1 text-xs text-muted-foreground">
                ({selectedAction}...)
              </span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80 p-4">
          <div className="space-y-3">
            <div>
              <h4 className="font-medium text-sm mb-1">AI Writing Assistant</h4>
              <p className="text-xs text-muted-foreground">
                {hasSelection 
                  ? `Selected: "${selectedText.slice(0, 50)}${selectedText.length > 50 ? '...' : ''}"`
                  : 'Select text for targeted improvements, or use actions to add new content'
                }
              </p>
            </div>
            
            <div className="grid grid-cols-1 gap-2">
              {aiActions.map((action) => (
                <Button
                  key={action.id}
                  variant="ghost"
                  size="sm"
                  className="justify-start h-auto p-2 text-left"
                  onClick={() => handleAIAction(action.id)}
                  disabled={isLoading || isProcessing}
                >
                  <action.icon className="w-4 h-4 mr-2 flex-shrink-0" />
                  <div>
                    <div className="text-sm font-medium">{action.label}</div>
                    <div className="text-xs text-muted-foreground">{action.description}</div>
                  </div>
                </Button>
              ))}
              
              <div className="border-t pt-2 mt-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="justify-start h-auto p-2 text-left w-full"
                  onClick={() => {
                    const customPrompt = prompt('Enter your custom AI request:');
                    if (customPrompt) {
                      handleAIAction('custom', customPrompt);
                    }
                  }}
                  disabled={isLoading || isProcessing}
                >
                  <ChatBubbleLeftIcon className="w-4 h-4 mr-2 flex-shrink-0" />
                  <div>
                    <div className="text-sm font-medium">Custom Request</div>
                    <div className="text-xs text-muted-foreground">Ask AI anything</div>
                  </div>
                </Button>
              </div>
            </div>
          </div>
        </PopoverContent>
      </Popover>
      
      {(isLoading || isProcessing) && (
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <div className="w-3 h-3 border border-primary/30 border-t-primary rounded-full animate-spin" />
          <span>AI processing...</span>
        </div>
      )}
    </div>
  );
};