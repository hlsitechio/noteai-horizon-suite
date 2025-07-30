
import { Variants } from 'framer-motion';

export interface EditorHeaderProps {
  isNewNote: boolean;
  isFavorite: boolean;
  isSaving: boolean;
  canSave: boolean;
  isCollapsed?: boolean;
  isHeaderCollapsed?: boolean;
  onFavoriteToggle: () => void;
  onFocusModeToggle: () => void;
  onHeaderCollapseToggle?: () => void;
  onSave: () => void;
  onCollapseAllBars?: () => void;
}

export const headerVariants: Variants = {
  expanded: {
    height: "auto",
    padding: "1.5rem",
    transition: {
      type: "spring" as const,
      stiffness: 400,
      damping: 30,
      duration: 0.3
    }
  },
  collapsed: {
    height: "auto",
    padding: "1rem",
    transition: {
      type: "spring" as const,
      stiffness: 400,
      damping: 30,
      duration: 0.3
    }
  },
  focus: {
    height: "auto",
    padding: "0.75rem",
    transition: {
      type: "spring" as const,
      stiffness: 400,
      damping: 30,
      duration: 0.3
    }
  }
};

export const contentVariants: Variants = {
  expanded: {
    opacity: 1,
    y: 0,
    transition: {
      delay: 0.1,
      duration: 0.2
    }
  },
  collapsed: {
    opacity: 0,
    y: -10,
    transition: {
      duration: 0.15
    }
  }
};

export const buttonVariants: Variants = {
  hover: {
    scale: 1.05,
    transition: {
      type: "spring" as const,
      stiffness: 400,
      damping: 25
    }
  },
  tap: {
    scale: 0.95
  }
};
