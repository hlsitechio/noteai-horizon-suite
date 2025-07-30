import React from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { languages } from '../types';

interface AITranslationSelectorProps {
  targetLanguage: string;
  onLanguageChange: (language: string) => void;
  onTranslate: () => void;
  isLoading: boolean;
}

const AITranslationSelector: React.FC<AITranslationSelectorProps> = ({
  targetLanguage,
  onLanguageChange,
  onTranslate,
  isLoading
}) => {
  return (
    <div className="space-y-3">
      <div>
        <label className="text-sm font-medium mb-2 block">Target Language</label>
        <Select value={targetLanguage} onValueChange={onLanguageChange}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {languages.map((lang) => (
              <SelectItem key={lang.value} value={lang.value}>
                {lang.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <Button onClick={onTranslate} disabled={isLoading} className="w-full">
        {isLoading ? 'Translating...' : 'Translate Text'}
      </Button>
    </div>
  );
};

export default AITranslationSelector;