export type AIAction = 'improve' | 'continue' | 'translate' | 'summarize' | 'expand' | 'simplify' | 'change-tone' | 'change-style' | 'longer' | 'shorter' | 'copy-text' | 'custom';

export interface AIAssistantProps {
  selectedText: string;
  onTextInsert: (text: string) => void;
  onTextReplace: (text: string) => void;
  isVisible: boolean;
  onClose: () => void;
  position?: { x: number; y: number };
  noteId?: string;
  mode?: 'bar' | 'popup';
}

export interface Language {
  value: string;
  label: string;
}

export const languages: Language[] = [
  { value: 'es', label: 'Spanish' },
  { value: 'fr', label: 'French' },
  { value: 'de', label: 'German' },
  { value: 'it', label: 'Italian' },
  { value: 'pt', label: 'Portuguese' },
  { value: 'zh', label: 'Chinese' },
  { value: 'ja', label: 'Japanese' },
  { value: 'ko', label: 'Korean' },
  { value: 'ar', label: 'Arabic' },
  { value: 'ru', label: 'Russian' },
];

export const aiActions = [
  { id: 'improve', label: 'Improve', icon: 'SparklesIcon', color: 'from-blue-500 to-blue-600', category: 'primary' },
  { id: 'continue', label: 'Continue', icon: 'ArrowRightIcon', color: 'from-green-500 to-green-600', category: 'primary' },
  { id: 'change-tone', label: 'Change Tone', icon: 'ChatBubbleLeftIcon', color: 'from-purple-500 to-purple-600', category: 'style' },
  { id: 'change-style', label: 'Change Style', icon: 'PaintBrushIcon', color: 'from-indigo-500 to-indigo-600', category: 'style' },
  { id: 'longer', label: 'Longer', icon: 'PlusIcon', color: 'from-emerald-500 to-emerald-600', category: 'length' },
  { id: 'shorter', label: 'Shorter', icon: 'MinusIcon', color: 'from-orange-500 to-orange-600', category: 'length' },
  { id: 'translate', label: 'Translate', icon: 'LanguageIcon', color: 'from-cyan-500 to-cyan-600', category: 'advanced' },
  { id: 'summarize', label: 'Summarize', icon: 'DocumentTextIcon', color: 'from-violet-500 to-violet-600', category: 'advanced' },
  { id: 'copy-text', label: 'Copy Text', icon: 'ClipboardIcon', color: 'from-gray-500 to-gray-600', category: 'utility' },
];