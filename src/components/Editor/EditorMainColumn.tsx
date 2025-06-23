
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import RichTextEditor from './RichTextEditor';
import EditorMetadata from './EditorMetadata';
import { NoteCategory } from '../../types/note';

interface EditorMainColumnProps {
  title: string;
  content: string;
  category: string;
  tags: string[];
  newTag: string;
  categories: NoteCategory[];
  onTitleChange: (title: string) => void;
  onContentChange: (content: string) => void;
  onCategoryChange: (category: string) => void;
  onNewTagChange: (tag: string) => void;
  onAddTag: () => void;
  onRemoveTag: (tag: string) => void;
  onSuggestionApply: (original: string, suggestion: string) => void;
  onSave?: () => void;
  canSave?: boolean;
  isSaving?: boolean;
  isDistractionFree: boolean;
}

const EditorMainColumn: React.FC<EditorMainColumnProps> = ({
  title,
  content,
  category,
  tags,
  newTag,
  categories,
  onTitleChange,
  onContentChange,
  onCategoryChange,
  onNewTagChange,
  onAddTag,
  onRemoveTag,
  onSuggestionApply,
  onSave,
  canSave = true,
  isSaving = false,
  isDistractionFree,
}) => {
  return (
    <Card className={`flex-1 h-full glass shadow-large transition-all duration-300 ${
      isDistractionFree ? 'border-transparent shadow-none' : ''
    }`}>
      <CardContent className="p-8 h-full">
        <div className="space-y-6 h-full flex flex-col">
          <AnimatePresence>
            {!isDistractionFree && (
              <motion.div
                initial={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                <EditorMetadata
                  title={title}
                  category={category}
                  tags={tags}
                  newTag={newTag}
                  categories={categories}
                  onTitleChange={onTitleChange}
                  onCategoryChange={onCategoryChange}
                  onNewTagChange={onNewTagChange}
                  onAddTag={onAddTag}
                  onRemoveTag={onRemoveTag}
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Rich Text Editor */}
          <div className="flex-1">
            <RichTextEditor
              value={content}
              onChange={onContentChange}
              onSave={onSave}
              canSave={canSave}
              isSaving={isSaving}
              placeholder="Start writing your masterpiece... The world's most advanced AI is here to help you craft something extraordinary."
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EditorMainColumn;
