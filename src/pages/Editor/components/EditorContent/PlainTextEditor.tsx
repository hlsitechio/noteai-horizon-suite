import React, { useRef, useEffect } from 'react';
import { Textarea } from '@/components/ui/textarea';

interface PlainTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  isMobile?: boolean;
}

const PlainTextEditor: React.FC<PlainTextEditorProps> = ({
  value,
  onChange,
  placeholder = "Start writing your note...",
  isMobile = false
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      // Auto-resize textarea
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value);
  };

  const handleTextareaClick = () => {
    if (isMobile) {
      // Small delay to ensure the click event is processed first
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.focus();
          // For iOS, this helps ensure the keyboard appears
          textareaRef.current.click();
        }
      }, 100);
    }
  };

  return (
    <div className="h-full">
      <Textarea
        ref={textareaRef}
        value={value}
        onChange={handleChange}
        onClick={handleTextareaClick}
        onTouchStart={isMobile ? handleTextareaClick : undefined}
        placeholder={placeholder}
        className={`
          w-full h-full resize-none border-none px-0 shadow-none 
          focus-visible:ring-0 text-base leading-relaxed bg-transparent
          ${isMobile ? 'text-base' : 'text-lg'}
        `}
        autoFocus={!isMobile}
      />
    </div>
  );
};

export default PlainTextEditor;