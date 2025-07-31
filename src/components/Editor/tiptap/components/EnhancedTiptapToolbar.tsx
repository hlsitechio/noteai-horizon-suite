import React, { useState } from 'react';
import { Editor } from '@tiptap/react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { 
  Bold, 
  Italic, 
  Underline, 
  Code, 
  Heading1, 
  Heading2, 
  Heading3,
  List, 
  ListOrdered, 
  CheckSquare,
  Quote, 
  Highlighter, 
  Link, 
  Image, 
  Youtube,
  CodeIcon,
  Table,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Palette,
  Save,
  Focus
} from 'lucide-react';
import { executeCommand, isCommandActive } from '../utils/editorUtils';

interface EnhancedTiptapToolbarProps {
  editor: Editor | null;
  onSave?: () => void;
  canSave?: boolean;
  isSaving?: boolean;
  onFocusModeToggle?: () => void;
}

const EnhancedTiptapToolbar: React.FC<EnhancedTiptapToolbarProps> = ({ 
  editor, 
  onSave, 
  canSave = true, 
  isSaving = false,
  onFocusModeToggle 
}) => {
  const [linkUrl, setLinkUrl] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [textColor, setTextColor] = useState('#000000');

  if (!editor) return null;

  const formatButtons = [
    { command: 'bold' as const, icon: Bold, label: 'Bold', shortcut: 'Ctrl+B' },
    { command: 'italic' as const, icon: Italic, label: 'Italic', shortcut: 'Ctrl+I' },
    { command: 'underline' as const, icon: Underline, label: 'Underline', shortcut: 'Ctrl+U' },
    { command: 'code' as const, icon: Code, label: 'Inline Code', shortcut: 'Ctrl+E' },
  ];

  const headingButtons = [
    { command: 'heading1' as const, icon: Heading1, label: 'Heading 1' },
    { command: 'heading2' as const, icon: Heading2, label: 'Heading 2' },
    { command: 'heading3' as const, icon: Heading3, label: 'Heading 3' },
  ];

  const listButtons = [
    { command: 'bulletList' as const, icon: List, label: 'Bullet List' },
    { command: 'orderedList' as const, icon: ListOrdered, label: 'Numbered List' },
    { command: 'taskList' as const, icon: CheckSquare, label: 'Task List' },
  ];

  const alignButtons = [
    { command: 'alignLeft' as const, icon: AlignLeft, label: 'Align Left' },
    { command: 'alignCenter' as const, icon: AlignCenter, label: 'Align Center' },
    { command: 'alignRight' as const, icon: AlignRight, label: 'Align Right' },
    { command: 'alignJustify' as const, icon: AlignJustify, label: 'Justify' },
  ];

  const handleAddLink = () => {
    if (linkUrl) {
      editor.chain().focus().setLink({ href: linkUrl }).run();
      setLinkUrl('');
    }
  };

  const handleAddImage = () => {
    if (imageUrl) {
      editor.chain().focus().setImage({ src: imageUrl }).run();
      setImageUrl('');
    }
  };

  const handleAddYoutube = () => {
    if (youtubeUrl) {
      editor.chain().focus().setYoutubeVideo({ src: youtubeUrl }).run();
      setYoutubeUrl('');
    }
  };

  const handleTextColor = () => {
    editor.chain().focus().setColor(textColor).run();
  };

  const renderButton = (command: any, icon: any, label: string, shortcut?: string) => {
    const Icon = icon;
    return (
      <Button
        key={command}
        variant="ghost"
        size="sm"
        onClick={() => executeCommand(editor, command)}
        className={`h-8 px-2 ${
          isCommandActive(editor, command)
            ? 'bg-primary text-primary-foreground'
            : 'hover:bg-accent'
        }`}
        title={shortcut ? `${label} (${shortcut})` : label}
      >
        <Icon className="w-4 h-4" />
      </Button>
    );
  };

  return (
    <div className="border-b border-border p-3 bg-background/95 backdrop-blur-sm sticky top-0 z-10">
      <div className="flex flex-wrap items-center gap-1">
        {/* Save Button */}
        {onSave && (
          <>
            <Button
              variant="default"
              size="sm"
              onClick={onSave}
              disabled={!canSave || isSaving}
              className="h-8 px-3"
            >
              <Save className="w-4 h-4 mr-1" />
              {isSaving ? 'Saving...' : 'Save'}
            </Button>
            <Separator orientation="vertical" className="h-6 mx-1" />
          </>
        )}

        {/* Focus Mode Toggle */}
        {onFocusModeToggle && (
          <>
            <Button
              variant="ghost"
              size="sm"
              onClick={onFocusModeToggle}
              className="h-8 px-2"
              title="Toggle Focus Mode"
            >
              <Focus className="w-4 h-4" />
            </Button>
            <Separator orientation="vertical" className="h-6 mx-1" />
          </>
        )}

        {/* Text Formatting */}
        {formatButtons.map(({ command, icon, label, shortcut }) => 
          renderButton(command, icon, label, shortcut)
        )}

        <Separator orientation="vertical" className="h-6 mx-1" />

        {/* Headings */}
        {headingButtons.map(({ command, icon, label }) => 
          renderButton(command, icon, label)
        )}

        <Separator orientation="vertical" className="h-6 mx-1" />

        {/* Lists */}
        {listButtons.map(({ command, icon, label }) => 
          renderButton(command, icon, label)
        )}

        <Separator orientation="vertical" className="h-6 mx-1" />

        {/* Text Alignment */}
        {alignButtons.map(({ command, icon, label }) => 
          renderButton(command, icon, label)
        )}

        <Separator orientation="vertical" className="h-6 mx-1" />

        {/* Quote and Highlight */}
        {renderButton('blockquote', Quote, 'Blockquote')}
        {renderButton('highlight', Highlighter, 'Highlight')}

        <Separator orientation="vertical" className="h-6 mx-1" />

        {/* Text Color */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 px-2" title="Text Color">
              <Palette className="w-4 h-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-64 p-3">
            <div className="space-y-3">
              <h4 className="text-sm font-medium">Text Color</h4>
              <div className="flex items-center gap-2">
                <Input
                  type="color"
                  value={textColor}
                  onChange={(e) => setTextColor(e.target.value)}
                  className="w-12 h-8 border rounded cursor-pointer"
                />
                <Button size="sm" onClick={handleTextColor}>Apply</Button>
              </div>
            </div>
          </PopoverContent>
        </Popover>

        {/* Link */}
        <Popover>
          <PopoverTrigger asChild>
            <Button 
              variant="ghost" 
              size="sm" 
              className={`h-8 px-2 ${
                isCommandActive(editor, 'insertLink') ? 'bg-primary text-primary-foreground' : ''
              }`}
              title="Insert Link"
            >
              <Link className="w-4 h-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-64 p-3">
            <div className="space-y-3">
              <h4 className="text-sm font-medium">Insert Link</h4>
              <div className="flex gap-2">
                <Input
                  placeholder="Enter URL"
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddLink()}
                />
                <Button size="sm" onClick={handleAddLink}>Add</Button>
              </div>
            </div>
          </PopoverContent>
        </Popover>

        {/* Image */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 px-2" title="Insert Image">
              <Image className="w-4 h-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-64 p-3">
            <div className="space-y-3">
              <h4 className="text-sm font-medium">Insert Image</h4>
              <div className="flex gap-2">
                <Input
                  placeholder="Enter image URL"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddImage()}
                />
                <Button size="sm" onClick={handleAddImage}>Add</Button>
              </div>
            </div>
          </PopoverContent>
        </Popover>

        {/* YouTube */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 px-2" title="Insert YouTube Video">
              <Youtube className="w-4 h-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-64 p-3">
            <div className="space-y-3">
              <h4 className="text-sm font-medium">Insert YouTube Video</h4>
              <div className="flex gap-2">
                <Input
                  placeholder="Enter YouTube URL"
                  value={youtubeUrl}
                  onChange={(e) => setYoutubeUrl(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddYoutube()}
                />
                <Button size="sm" onClick={handleAddYoutube}>Add</Button>
              </div>
            </div>
          </PopoverContent>
        </Popover>

        <Separator orientation="vertical" className="h-6 mx-1" />

        {/* Code Block */}
        {renderButton('insertCodeBlock', CodeIcon, 'Code Block')}

        {/* Table */}
        {renderButton('insertTable', Table, 'Insert Table')}
      </div>
    </div>
  );
};

export default EnhancedTiptapToolbar;