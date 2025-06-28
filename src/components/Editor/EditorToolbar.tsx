import React from 'react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { 
  Bold, 
  Italic, 
  Underline, 
  List, 
  ListOrdered,
  Quote,
  Code,
  Link,
  Image,
  Undo,
  Redo
} from 'lucide-react';
import SaveButton from './toolbar/SaveButton';
import ReminderButton from './toolbar/ReminderButton';
import { Note } from '../../types/note';

interface EditorToolbarProps {
  note: Note | null;
  canSave: boolean;
  isSaving: boolean;
  onSave: () => void;
  onReminderSet?: () => void;
}

const EditorToolbar: React.FC<EditorToolbarProps> = ({
  note,
  canSave,
  isSaving,
  onSave,
  onReminderSet
}) => {
  return (
    <div className="flex items-center gap-2 p-3 border-b border-gray-200 bg-white">
      {/* Text Formatting */}
      <div className="flex items-center gap-1">
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-gray-100">
          <Bold className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-gray-100">
          <Italic className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-gray-100">
          <Underline className="h-4 w-4" />
        </Button>
      </div>

      <Separator orientation="vertical" className="h-6" />

      {/* Lists */}
      <div className="flex items-center gap-1">
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-gray-100">
          <List className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-gray-100">
          <ListOrdered className="h-4 w-4" />
        </Button>
      </div>

      <Separator orientation="vertical" className="h-6" />

      {/* Other formatting */}
      <div className="flex items-center gap-1">
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-gray-100">
          <Quote className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-gray-100">
          <Code className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-gray-100">
          <Link className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-gray-100">
          <Image className="h-4 w-4" />
        </Button>
      </div>

      <Separator orientation="vertical" className="h-6" />

      {/* Undo/Redo */}
      <div className="flex items-center gap-1">
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-gray-100">
          <Undo className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-gray-100">
          <Redo className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex-1" />

      {/* Right side - Reminder and Save */}
      <div className="flex items-center gap-2">
        <ReminderButton note={note} onReminderSet={onReminderSet} />
        <SaveButton onSave={onSave} canSave={canSave} isSaving={isSaving} />
      </div>
    </div>
  );
};

export default EditorToolbar;
