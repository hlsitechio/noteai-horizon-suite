import React from 'react';
import { 
  BoldIcon,
  ItalicIcon,
  UnderlineIcon,
  CodeBracketIcon
} from '@heroicons/react/24/outline';
import FormatButton from './FormatButton';

interface TextFormattingGroupProps {
  onFormatClick: (formatId: string, event: React.MouseEvent) => void;
  activeFormats: Set<string>;
}

const TextFormattingGroup: React.FC<TextFormattingGroupProps> = ({ 
  onFormatClick, 
  activeFormats 
}) => {
  const formatButtons = [
    { id: 'bold', icon: BoldIcon, title: 'Bold (Ctrl+B)' },
    { id: 'italic', icon: ItalicIcon, title: 'Italic (Ctrl+I)' },
    { id: 'underline', icon: UnderlineIcon, title: 'Underline (Ctrl+U)' },
    { id: 'code', icon: CodeBracketIcon, title: 'Code (Ctrl+`)' },
  ];

  return (
    <div className="flex items-center gap-1">
      {formatButtons.map(({ id, icon, title }) => (
        <FormatButton
          key={id}
          id={id}
          icon={icon}
          title={title}
          isActive={activeFormats.has(id)}
          onClick={onFormatClick}
          variant="text"
        />
      ))}
    </div>
  );
};

export default TextFormattingGroup;