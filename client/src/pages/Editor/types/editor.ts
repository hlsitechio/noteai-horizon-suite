export interface EditorState {
  title: string;
  content: string;
  category: string;
  tags: string[];
  newTag: string;
  isFavorite: boolean;
  isSaving: boolean;
}

export interface EditorUIState {
  isFocusMode: boolean;
  isHeaderCollapsed: boolean;
  isHeaderHidden: boolean;
}

export interface EditorNote {
  id: string;
  title: string;
  content: string;
  category: string;
  tags: string[];
  isFavorite: boolean;
  created_at: string;
  updated_at: string;
  folder_id?: string;
}

export interface EditorActions {
  onSave: () => void;
  onTitleChange: (title: string) => void;
  onContentChange: (content: string) => void;
  onCategoryChange: (category: string) => void;
  onTagAdd: () => void;
  onTagRemove: (tag: string) => void;
  onFavoriteToggle: () => void;
  onFocusModeToggle: () => void;
}

export type CategoryOption = {
  value: string;
  label: string;
  color?: string;
};