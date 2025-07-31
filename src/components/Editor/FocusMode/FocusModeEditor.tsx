import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';

interface FocusModeEditorProps {
  title: string;
  content: string;
  onTitleChange: (title: string) => void;
  onContentChange: (content: string) => void;
  isMobile: boolean;
  isZenMode: boolean;
  isDistractionFree: boolean;
  isBackgroundHidden: boolean;
}

const FocusModeEditor: React.FC<FocusModeEditorProps> = ({
  title,
  content,
  onTitleChange,
  onContentChange,
  isMobile,
  isZenMode,
  isDistractionFree,
  isBackgroundHidden,
}) => {
  const renderEditor = () => (
    <>
      {/* Title Input */}
      <div className={`${
        isMobile 
          ? 'pt-12 px-4' 
          : isZenMode 
            ? 'pt-24 px-12' 
            : isDistractionFree 
              ? 'pt-12 px-12' 
              : 'pt-20 px-12'
      }`}>
        <motion.input
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          type="text"
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
          placeholder={isMobile ? "Your title..." : "Enter your title..."}
          className={`w-full bg-transparent border-none outline-none text-white placeholder-white/50 mb-8 leading-tight ${
            isMobile ? 'text-2xl font-bold' : 'text-4xl font-bold'
          }`}
          autoFocus={!isMobile}
        />
      </div>

      {/* Editor Content */}
      <div className={`${
        isMobile 
          ? 'h-[calc(100%-140px)] px-4 pb-4' 
          : isZenMode 
            ? 'h-[calc(100%-140px)] px-12 pb-12' 
            : 'h-[calc(100%-140px)] px-12 pb-6'
      }`}>
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="h-full"
        >
          <textarea
            value={content}
            onChange={(e) => onContentChange(e.target.value)}
            placeholder={isMobile 
              ? "Start writing..." 
              : "Focus on your writing... Let your thoughts flow without any distractions."
            }
            className={`w-full h-full bg-transparent border-none outline-none resize-none text-white placeholder-white/40 leading-relaxed ${
              isMobile ? 'text-base' : 'text-lg'
            } font-normal`}
            style={{
              lineHeight: '1.8',
              fontFamily: 'Inter, system-ui, sans-serif',
            }}
          />
        </motion.div>
      </div>
    </>
  );

  if (isBackgroundHidden) {
    return (
      <div className="h-full bg-black overflow-hidden">
        {renderEditor()}
      </div>
    );
  }

  return (
    <Card className={`h-full glass shadow-2xl overflow-hidden transition-all duration-500 ${
      isMobile 
        ? 'rounded-lg border-none' 
        : isZenMode 
          ? 'rounded-none border-none' 
          : 'rounded-3xl'
    }`}>
      <CardContent className={`${
        isMobile 
          ? 'h-[calc(100%-120px)] px-4 pb-4' 
          : isZenMode 
            ? 'h-[calc(100%-140px)] px-12 pb-12' 
            : 'h-[calc(100%-140px)] px-12 pb-6'
      }`}>
        {renderEditor()}
      </CardContent>
    </Card>
  );
};

export default FocusModeEditor;