
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { buttonVariants } from './EditorHeaderTypes';

interface EditorHeaderButtonProps {
  onClick: () => void;
  disabled?: boolean;
  className?: string;
  children: React.ReactNode;
}

const EditorHeaderButton: React.FC<EditorHeaderButtonProps> = ({
  onClick,
  disabled = false,
  className = "",
  children
}) => {
  return (
    <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
      <Button
        onClick={onClick}
        disabled={disabled}
        className={className}
      >
        {children}
      </Button>
    </motion.div>
  );
};

export default EditorHeaderButton;
