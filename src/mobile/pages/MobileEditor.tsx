
import React from 'react';
import { ArrowLeft, Save, MoreVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useNavigate } from 'react-router-dom';
import { useNotes } from '../../contexts/NotesContext';
import MobileEditorToolbar from '../components/MobileEditorToolbar';

const MobileEditor: React.FC = () => {
  const navigate = useNavigate();
  const { currentNote, updateNote } = useNotes();
  const [title, setTitle] = React.useState(currentNote?.title || '');
  const [content, setContent] = React.useState(currentNote?.content || '');
  const [isSaving, setIsSaving] = React.useState(false);

  const handleSave = async () => {
    if (!currentNote) return;
    
    setIsSaving(true);
    try {
      await updateNote(currentNote.id, { title, content });
    } catch (error) {
      console.error('Failed to save note:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleBack = () => {
    navigate('/mobile/notes');
  };

  return (
    <div className="h-full flex flex-col bg-background">
      {/* Mobile Editor Header */}
      <div className="flex items-center justify-between p-4 border-b border-border flex-shrink-0">
        <Button variant="ghost" size="sm" onClick={handleBack}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        
        <div className="flex items-center gap-2">
          <Button 
            variant="default" 
            size="sm" 
            onClick={handleSave}
            disabled={isSaving}
          >
            <Save className="w-4 h-4 mr-1" />
            {isSaving ? 'Saving...' : 'Save'}
          </Button>
          
          <Button variant="ghost" size="sm">
            <MoreVertical className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Editor Content */}
      <div className="flex-1 flex flex-col p-4 space-y-4">
        {/* Title Input */}
        <Input
          placeholder="Note title..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="text-lg font-semibold border-none px-0 shadow-none focus-visible:ring-0"
        />
        
        {/* Content Textarea */}
        <Textarea
          placeholder="Start writing your note..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="flex-1 resize-none border-none px-0 shadow-none focus-visible:ring-0 text-base leading-relaxed"
        />
      </div>

      {/* Mobile Toolbar */}
      <MobileEditorToolbar />
    </div>
  );
};

export default MobileEditor;
