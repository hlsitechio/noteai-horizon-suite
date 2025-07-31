
import React from 'react';
import { Button } from '@/components/ui/button';

interface FormatButtonProps {
  id: string;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  isActive: boolean;
  onClick: (id: string, event: React.MouseEvent) => void;
  variant?: 'text' | 'block';
}

const FormatButton: React.FC<FormatButtonProps> = ({
  id,
  icon: Icon,
  title,
  isActive,
  onClick,
  variant = 'text'
}) => {
  const getVariantStyles = () => {
    if (variant === 'text') {
      return isActive 
        ? 'bg-blue-600 text-white shadow-md hover:bg-blue-700' 
        : 'hover:bg-blue-100 dark:hover:bg-slate-600';
    } else {
      return isActive 
        ? 'bg-purple-600 text-white shadow-md hover:bg-purple-700' 
        : 'hover:bg-purple-100 dark:hover:bg-slate-600';
    }
  };

  return (
    <Button
      variant={isActive ? "default" : "ghost"}
      size="sm"
      title={title}
      onClick={(e) => onClick(id, e)}
      className={`h-8 w-8 p-0 ${getVariantStyles()}`}
    >
      <Icon className="w-4 h-4" />
    </Button>
  );
};

export default FormatButton;
