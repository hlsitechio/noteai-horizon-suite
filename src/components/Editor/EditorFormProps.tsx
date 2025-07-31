
export interface EditorFormState {
  title: string;
  content: string;
  category: string;
  tags: string[];
  newTag: string;
  isFavorite: boolean;
  isSaving: boolean;
}

export interface EditorFormHandlers {
  onTitleChange: (title: string) => void;
  onContentChange: (content: string) => void;
  onCategoryChange: (category: string) => void;
  onNewTagChange: (tag: string) => void;
  onAddTag: () => void;
  onRemoveTag: (tag: string) => void;
  onFavoriteToggle: () => void;
  onSave: () => void;
  onSuggestionApply: (original: string, suggestion: string) => void;
}
