import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Smile } from 'lucide-react';

interface StatusBarEmojiPickerProps {
  onEmojiSelect: (emoji: string) => void;
}

const EMOJI_CATEGORIES = {
  Smileys: ['😀', '😃', '😄', '😁', '😅', '😂', '🤣', '😊', '😇', '🙂', '🙃', '😉', '😌', '😍', '🥰', '😘', '😗', '😙', '😚', '😋', '😛', '😝', '😜', '🤪', '🤨', '🧐', '🤓', '😎', '🤩', '🥳'],
  Activities: ['⚽', '🏀', '🏈', '⚾', '🎾', '🏐', '🏉', '🎱', '🏓', '🏸', '🏒', '🏑', '🥍', '🏏', '⛳', '🏹', '🎣', '🤿', '🥊', '🥋', '🎽', '⛷️', '🏂', '🏄', '🚣', '🏊', '⛹️', '🏋️', '🚴', '🚵'],
  Nature: ['🌱', '🌿', '🍀', '🌵', '🌲', '🌳', '🌴', '🌊', '🌍', '🌎', '🌏', '🌕', '🌖', '🌗', '🌘', '🌑', '🌒', '🌓', '🌔', '⭐', '🌟', '💫', '✨', '☄️', '☀️', '🌤️', '⛅', '🌦️', '🌧️', '⛈️'],
  Objects: ['📱', '💻', '⌨️', '🖥️', '🖨️', '🖱️', '💾', '💿', '📀', '📼', '📷', '📸', '📹', '🎥', '📞', '☎️', '📟', '📠', '📺', '📻', '🎙️', '🎚️', '🎛️', '⏱️', '⏲️', '⏰', '🕰️', '⏳', '⌛', '📡'],
  Symbols: ['❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍', '🤎', '💔', '❣️', '💕', '💞', '💓', '💗', '💖', '💘', '💝', '💟', '☮️', '✝️', '☪️', '🕉️', '☸️', '✡️', '🔯', '🕎', '☯️', '☦️', '🛐']
};

export const StatusBarEmojiPicker: React.FC<StatusBarEmojiPickerProps> = ({ onEmojiSelect }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<keyof typeof EMOJI_CATEGORIES>('Smileys');

  const handleEmojiClick = (emoji: string) => {
    onEmojiSelect(emoji);
    setIsOpen(false);
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="h-9">
          <Smile className="w-4 h-4 mr-1" />
          Emoji
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="start">
        <div className="border-b">
          <div className="flex overflow-x-auto">
            {Object.keys(EMOJI_CATEGORIES).map((category) => (
              <Button
                key={category}
                variant={activeCategory === category ? "default" : "ghost"}
                size="sm"
                className="flex-shrink-0 text-xs"
                onClick={() => setActiveCategory(category as keyof typeof EMOJI_CATEGORIES)}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>
        <div className="p-4 max-h-48 overflow-y-auto">
          <div className="grid grid-cols-8 gap-2">
            {EMOJI_CATEGORIES[activeCategory].map((emoji, index) => (
              <Button
                key={`${emoji}-${index}`}
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 text-lg hover:bg-muted"
                onClick={() => handleEmojiClick(emoji)}
              >
                {emoji}
              </Button>
            ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};