
export interface EditorUIState {
  isFocusMode: boolean;
  isHeaderCollapsed: boolean;
  isHeaderHidden: boolean;
}

export interface EditorUIHandlers {
  onFocusModeToggle: () => void;
  onHeaderCollapseToggle: () => void;
  onCollapseAllBars: () => void;
  onFocusModeClose: () => void;
}

export interface EditorRefs {
  collapseAssistantRef: React.MutableRefObject<(() => void) | undefined>;
  expandAssistantRef: React.MutableRefObject<(() => void) | undefined>;
}
