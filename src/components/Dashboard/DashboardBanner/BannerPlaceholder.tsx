import React from 'react';
import { motion } from 'framer-motion';
import { Image, Upload, Sparkles } from 'lucide-react';

const BannerPlaceholder: React.FC = () => {
  const containerVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 }
  };

  const iconVariants = {
    initial: { scale: 0.8, opacity: 0 },
    animate: { scale: 1, opacity: 1 }
  };

  const textVariants = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 }
  };

  return (
    <motion.div
      className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary/5 via-primary/10 to-secondary/5"
      variants={containerVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      <div className="text-center p-8 max-w-md">
        <motion.div
          className="flex justify-center mb-6 space-x-4"
          variants={iconVariants}
        >
          <div className="p-3 bg-primary/10 rounded-full">
            <Image className="w-8 h-8 text-primary" />
          </div>
          <div className="p-3 bg-secondary/10 rounded-full">
            <Upload className="w-8 h-8 text-secondary" />
          </div>
          <div className="p-3 bg-accent/10 rounded-full">
            <Sparkles className="w-8 h-8 text-accent" />
          </div>
        </motion.div>
        
        <motion.div variants={textVariants}>
          <h3 className="text-lg font-semibold text-foreground mb-2">
            Personalize Your Dashboard
          </h3>
          <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
            Upload an image, generate with AI, or choose from our collection to create the perfect banner for your workspace.
          </p>
          <div className="flex flex-wrap justify-center gap-2 text-xs text-muted-foreground">
            <span className="px-2 py-1 bg-background/50 rounded">Upload</span>
            <span className="px-2 py-1 bg-background/50 rounded">AI Generate</span>
            <span className="px-2 py-1 bg-background/50 rounded">Browse</span>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default BannerPlaceholder;