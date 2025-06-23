
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LayoutGrid, Maximize2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import RichTextEditor from './RichTextEditor';
import CollapsibleAssistant from './CollapsibleAssistant';
import EditorMetadata from './EditorMetadata';
import { NoteCategory } from '../../types/note';

interface EditorLayoutProps {
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
  collapseAssistantRef?: React.MutableRefObject<(() => void) | undefined>;
  expandAssistantRef?: React.MutableRefObject<(() => void) | undefined>;
  showCollapseAllButton?: boolean;
  onCollapseAllBars?: () => void;
  isAllBarsCollapsed?: boolean;
  isAssistantCollapsed?: boolean;
}

const EditorLayout: React.FC<EditorLayoutProps> = ({
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
  collapseAssistantRef,
  expandAssistantRef,
  isAssistantCollapsed = false,
}) => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isDistrationFree, setIsDistractionFree] = useState(false);

  // Update refs to control assistant collapse state
  React.useEffect(() => {
    if (collapseAssistantRef) {
      collapseAssistantRef.current = () => setIsSidebarCollapsed(true);
    }
    if (expandAssistantRef) {
      expandAssistantRef.current = () => setIsSidebarCollapsed(false);
    }
  }, [collapseAssistantRef, expandAssistantRef]);

  const toggleDistractionFree = () => {
    setIsDistractionFree(!isDistrationFree);
    if (!isDistrationFree) {
      setIsSidebarCollapsed(true);
    } else {
      setIsSidebarCollapsed(false);
    }
  };

  return (
    <div className="relative">
      {/* Floating Layout Control */}
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          className="fixed bottom-6 right-6 z-50"
        >
          <Button
            onClick={toggleDistractionFree}
            className={`glass shadow-lg ${
              isDistrationFree 
                ? 'bg-gradient-to-br from-purple-600 via-blue-600 to-purple-700 hover:from-purple-700 hover:via-blue-700 hover:to-purple-800' 
                : 'bg-white/10 hover:bg-white/20 dark:bg-gray-800/20 dark:hover:bg-gray-700/30'
            } text-white border-0 backdrop-blur-md transition-all duration-300 relative overflow-hidden group`}
            size="lg"
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              animate={{
                x: [-100, 200],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
            {isDistrationFree ? (
              <>
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  whileTap={{ scale: 0.95 }}
                  className="relative z-10"
                >
                  <LayoutGrid className="w-5 h-5 mr-2 drop-shadow-sm" />
                </motion.div>
                <span className="relative z-10">Show All Panels</span>
              </>
            ) : (
              <>
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  whileTap={{ scale: 0.95 }}
                  className="relative z-10"
                >
                  <Maximize2 className="w-5 h-5 mr-2 drop-shadow-sm" />
                </motion.div>
                <span className="relative z-10">Distraction Free</span>
              </>
            )}
          </Button>
        </motion.div>
      </AnimatePresence>

      <div className={`grid gap-6 h-full transition-all duration-500 ease-in-out ${
        isSidebarCollapsed || isDistrationFree
          ? 'grid-cols-1 lg:grid-cols-[1fr_4rem]' 
          : 'grid-cols-1 lg:grid-cols-4'
      }`}>
        {/* Main Editor Column */}
        <div className={isSidebarCollapsed || isDistrationFree ? 'lg:col-span-1' : 'lg:col-span-3'}>
          <Card className={`flex-1 h-full glass shadow-large transition-all duration-300 ${
            isDistrationFree ? 'border-transparent shadow-none' : ''
          }`}>
            <CardContent className="p-8 h-full">
              <div className="space-y-6 h-full flex flex-col">
                <AnimatePresence>
                  {!isDistrationFree && (
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
        </div>

        {/* Collapsible AI Sidebar */}
        <AnimatePresence>
          {(!isDistrationFree || !isSidebarCollapsed) && (
            <motion.div 
              className="lg:col-span-1"
              initial={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 100 }}
              transition={{ duration: 0.3 }}
            >
              <CollapsibleAssistant
                content={content}
                onSuggestionApply={onSuggestionApply}
                onCollapseChange={setIsSidebarCollapsed}
                isCollapsed={isAssistantCollapsed || isSidebarCollapsed}
                onCollapseToggle={setIsSidebarCollapsed}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default EditorLayout;
