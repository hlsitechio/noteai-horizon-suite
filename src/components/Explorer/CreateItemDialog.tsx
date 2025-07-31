import React, { useState } from 'react';
import { Plus, FileText, Folder, Star, Calendar } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useOptimizedNotes } from '@/contexts/OptimizedNotesContext';
import { useFolders } from '@/contexts/FoldersContext';
import { useNavigate } from 'react-router-dom';
import { Note, NoteCategory } from '@/types/note';
import { Folder as FolderType } from '@/types/folder';

type CreateItemType = 'note' | 'folder' | 'favorite' | 'event';

interface CreateItemDialogProps {
  type: CreateItemType;
  children?: React.ReactNode;
  onSuccess?: () => void;
}

const categoryOptions = [
  { value: 'general', label: 'General', color: 'bg-gray-500' },
  { value: 'work', label: 'Work', color: 'bg-blue-500' },
  { value: 'personal', label: 'Personal', color: 'bg-green-500' },
  { value: 'ideas', label: 'Ideas', color: 'bg-yellow-500' },
  { value: 'todo', label: 'Todo', color: 'bg-red-500' },
  { value: 'meeting', label: 'Meeting', color: 'bg-purple-500' },
  { value: 'learning', label: 'Learning', color: 'bg-indigo-500' },
  { value: 'brainstorm', label: 'Brainstorm', color: 'bg-pink-500' },
  { value: 'project', label: 'Project', color: 'bg-orange-500' },
];

const folderColors = [
  '#3b82f6', // blue
  '#10b981', // emerald
  '#f59e0b', // amber
  '#ef4444', // red
  '#8b5cf6', // violet
  '#06b6d4', // cyan
  '#84cc16', // lime
  '#f97316', // orange
  '#ec4899', // pink
  '#6b7280', // gray
];

export const CreateItemDialog: React.FC<CreateItemDialogProps> = ({ type, children, onSuccess }) => {
  const [open, setOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState<any>({});
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');

  const { createNote } = useOptimizedNotes();
  const { createFolder, folders } = useFolders();
  const navigate = useNavigate();

  const getDialogConfig = () => {
    switch (type) {
      case 'note':
        return {
          title: 'Create New Note',
          icon: FileText,
          buttonText: 'Create Note',
          defaultData: {
            title: '',
            content: '',
            category: 'general' as NoteCategory,
            folder_id: null,
            isFavorite: false,
          }
        };
      case 'folder':
        return {
          title: 'Create New Folder',
          icon: Folder,
          buttonText: 'Create Folder',
          defaultData: {
            name: '',
            color: folderColors[0],
            parentId: undefined,
          }
        };
      case 'favorite':
        return {
          title: 'Create Favorite Note',
          icon: Star,
          buttonText: 'Create Favorite',
          defaultData: {
            title: '',
            content: '',
            category: 'general' as NoteCategory,
            folder_id: null,
            isFavorite: true,
          }
        };
      case 'event':
        return {
          title: 'Create Event Note',
          icon: Calendar,
          buttonText: 'Create Event',
          defaultData: {
            title: '',
            content: '',
            category: 'meeting' as NoteCategory,
            folder_id: null,
            isFavorite: false,
            reminder_enabled: true,
          }
        };
      default:
        return {
          title: 'Create Item',
          icon: Plus,
          buttonText: 'Create',
          defaultData: {}
        };
    }
  };

  const config = getDialogConfig();

  const resetForm = () => {
    setFormData(config.defaultData);
    setTags([]);
    setNewTag('');
  };

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (newOpen) {
      resetForm();
    }
  };

  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreating(true);

    try {
      if (type === 'folder') {
        const folderData: Omit<FolderType, 'id' | 'createdAt' | 'updatedAt'> = {
          name: formData.name || 'New Folder',
          color: formData.color || folderColors[0],
          parentId: formData.parentId,
        };
        await createFolder(folderData);
      } else {
        // Create note (for note, favorite, event types)
        const noteData: Omit<Note, 'id' | 'createdAt' | 'updatedAt'> = {
          title: formData.title || 'Untitled Note',
          content: formData.content || '',
          category: formData.category || 'general',
          tags: tags,
          isFavorite: formData.isFavorite || false,
          folder_id: formData.folder_id || null,
          reminder_enabled: formData.reminder_enabled || false,
          reminder_date: formData.reminder_date || null,
          reminder_status: 'none',
          reminder_frequency: 'once',
        };

        const newNote = await createNote(noteData);
        
        // Navigate to the new note if it's a regular note creation
        if (type === 'note' || type === 'favorite') {
          navigate(`/app/editor/${newNote.id}`);
        }
      }

      setOpen(false);
      resetForm();
      onSuccess?.(); // Call success callback if provided
    } catch (error) {
      console.error('Error creating item:', error);
    } finally {
      setIsCreating(false);
    }
  };

  const Icon = config.icon;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {children || (
          <Button size="sm" variant="ghost">
            <Icon className="w-4 h-4 mr-2" />
            {config.buttonText}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Icon className="w-5 h-5" />
            {config.title}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {type === 'folder' ? (
            // Folder form
            <>
              <div className="space-y-2">
                <Label htmlFor="name">Folder Name</Label>
                <Input
                  id="name"
                  placeholder="Enter folder name..."
                  value={formData.name || ''}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Color</Label>
                <div className="flex gap-2 flex-wrap">
                  {folderColors.map((color) => (
                    <button
                      key={color}
                      type="button"
                      className={`w-8 h-8 rounded-lg border-2 transition-all ${
                        formData.color === color ? 'border-foreground scale-110' : 'border-border'
                      }`}
                      style={{ backgroundColor: color }}
                      onClick={() => setFormData({ ...formData, color })}
                    />
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="parent">Parent Folder (Optional)</Label>
                <Select
                  value={formData.parentId || 'none'}
                  onValueChange={(value) => 
                    setFormData({ ...formData, parentId: value === 'none' ? undefined : value })
                  }
                >
                  <SelectTrigger id="parent">
                    <SelectValue placeholder="Select parent folder" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No parent (root level)</SelectItem>
                    {folders.map((folder) => (
                      <SelectItem key={folder.id} value={folder.id}>
                        {folder.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </>
          ) : (
            // Note form (for note, favorite, event types)
            <>
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  placeholder="Enter note title..."
                  value={formData.title || ''}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="content">Content</Label>
                <Textarea
                  id="content"
                  placeholder="Start writing your note..."
                  rows={6}
                  value={formData.content || ''}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select
                    value={formData.category || 'general'}
                    onValueChange={(value) => setFormData({ ...formData, category: value })}
                  >
                    <SelectTrigger id="category">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {categoryOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          <div className="flex items-center gap-2">
                            <div className={`w-3 h-3 rounded-full ${option.color}`} />
                            {option.label}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="folder">Folder (Optional)</Label>
                  <Select
                    value={formData.folder_id || 'none'}
                    onValueChange={(value) => 
                      setFormData({ ...formData, folder_id: value === 'none' ? null : value })
                    }
                  >
                    <SelectTrigger id="folder">
                      <SelectValue placeholder="Select folder" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">No folder</SelectItem>
                      {folders.map((folder) => (
                        <SelectItem key={folder.id} value={folder.id}>
                          {folder.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Tags</Label>
                <div className="flex gap-2 mb-2 flex-wrap">
                  {tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="cursor-pointer" onClick={() => removeTag(tag)}>
                      {tag} ×
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    placeholder="Add a tag..."
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                  />
                  <Button type="button" onClick={addTag} size="sm">
                    Add
                  </Button>
                </div>
              </div>

              {type === 'event' && (
                <div className="space-y-2">
                  <Label htmlFor="reminder_date">Event Date & Time</Label>
                  <Input
                    id="reminder_date"
                    type="datetime-local"
                    value={formData.reminder_date || ''}
                    onChange={(e) => setFormData({ ...formData, reminder_date: e.target.value })}
                  />
                </div>
              )}
            </>
          )}

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isCreating}>
              {isCreating ? 'Creating...' : config.buttonText}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};