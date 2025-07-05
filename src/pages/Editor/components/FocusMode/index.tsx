import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

interface FocusModeProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  content: string;
  onTitleChange: (title: string) => void;
  onContentChange: (content: string) => void;
  onSave: () => void;
  isSaving: boolean;
  isMobile: boolean;
}

const FocusMode: React.FC<FocusModeProps> = ({
  isOpen,
  onClose,
  title,
  content,
  onTitleChange,
  onContentChange,
  onSave,
  isSaving,
  isMobile
}) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black flex flex-col"
      >
        {/* Header */}
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="flex items-center justify-between p-4 bg-black/50 backdrop-blur-sm"
        >
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onClose}
            className="text-white hover:bg-white/10"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Exit Focus
          </Button>
          
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onSave}
            disabled={isSaving || !title.trim()}
            className="text-white hover:bg-white/10"
          >
            <Save className="w-4 h-4 mr-2" />
            {isSaving ? 'Saving...' : 'Save'}
          </Button>
        </motion.div>

        {/* Content Area */}
        <div className="flex-1 flex flex-col px-6 py-8 max-w-4xl mx-auto w-full">
          {/* Title */}
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mb-8"
          >
            <Input
              type="text"
              value={title}
              onChange={(e) => onTitleChange(e.target.value)}
              placeholder="Your brilliant title..."
              className={`
                w-full bg-transparent border-none outline-none 
                text-white placeholder-white/50 font-bold shadow-none
                focus-visible:ring-0 px-0
                ${isMobile ? 'text-xl' : 'text-3xl'}
              `}
            />
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="flex-1"
          >
            <Textarea
              value={content}
              onChange={(e) => onContentChange(e.target.value)}
              placeholder="Focus on your writing... Let your thoughts flow freely."
              className={`
                w-full h-full bg-transparent border-none outline-none 
                text-white placeholder-white/40 leading-relaxed resize-none
                shadow-none focus-visible:ring-0 px-0
                ${isMobile ? 'text-base' : 'text-lg'}
              `}
            />
          </motion.div>

          {/* Focus Mode Stats */}
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="flex items-center justify-center gap-6 py-4 text-white/60 text-sm"
          >
            <span>Words: {content.split(/\s+/).filter(word => word.length > 0).length}</span>
            <span>Characters: {content.length}</span>
            <span>Lines: {content.split('\n').length}</span>
          </motion.div>
        </div>

        {/* Breathing animation background */}
        <div className="absolute inset-0 pointer-events-none">
          <motion.div
            animate={{
              background: [
                'radial-gradient(circle at 20% 50%, rgba(120, 119, 198, 0.1) 0%, transparent 50%)',
                'radial-gradient(circle at 80% 50%, rgba(255, 119, 198, 0.1) 0%, transparent 50%)',
                'radial-gradient(circle at 40% 50%, rgba(120, 119, 198, 0.1) 0%, transparent 50%)',
              ]
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "linear"
            }}
            className="absolute inset-0"
          />
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default FocusMode;