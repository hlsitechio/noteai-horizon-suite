export type AIAction = 'improve' | 'translate' | 'summarize' | 'expand' | 'simplify' | 'custom';

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
  { id: 'improve', label: 'Improve', icon: 'SparklesIcon', color: 'from-blue-500 to-purple-500' },
  { id: 'translate', label: 'Translate', icon: 'LanguageIcon', color: 'from-green-500 to-teal-500' },
  { id: 'summarize', label: 'Summarize', icon: 'DocumentTextIcon', color: 'from-purple-500 to-pink-500' },
  { id: 'expand', label: 'Expand', icon: 'PlusIcon', color: 'from-orange-500 to-red-500' },
  { id: 'simplify', label: 'Simplify', icon: 'MinusIcon', color: 'from-teal-500 to-blue-500' },
];