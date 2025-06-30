
import React from 'react';
import { 
  H1Icon,
  H2Icon,
  ChatBubbleLeftRightIcon,
  ListBulletIcon,
  NumberedListIcon
} from '@heroicons/react/24/outline';
import FormatButton from './FormatButton';

interface BlockFormattingSectionProps {
  onFormatClick: (formatId: string, event: React.MouseEvent) => void;
  activeFormats: Set<string>;
}

const BlockFormattingSection: React.FC<BlockFormattingSectionProps> = ({
  onFormatClick,
  activeFormats
}) => {
  const blockButtons = [
    { id: 'heading-one', icon: H1Icon, title: 'Heading 1' },
    { id: 'heading-two', icon: H2Icon, title: 'Heading 2' },
    { id: 'block-quote', icon: ChatBubbleLeftRightIcon, title: 'Quote' },
    { id: 'bulleted-list', icon: ListBulletIcon, title: 'Bullet List' },
    { id: 'numbered-list', icon: NumberedListIcon, title: 'Numbered List' },
  ];

  return (
    <>
      {blockButtons.map(({ id, icon, title }) => (
        <FormatButton
          key={id}
          id={id}
          icon={icon}
          title={title}
          isActive={activeFormats.has(id)}
          onClick={onFormatClick}
          variant="block"
        />
      ))}
    </>
  );
};

export default BlockFormattingSection;
