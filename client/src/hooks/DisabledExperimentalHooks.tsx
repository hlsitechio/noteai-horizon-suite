// Disabled experimental hooks - placeholders
export const useRAGChat = () => ({
  messages: [],
  isLoading: false,
  sendMessage: () => Promise.resolve('Feature disabled'),
  clearChat: () => {},
});

export const useSpeechToText = () => ({
  isListening: false,
  transcript: '',
  startListening: () => {},
  stopListening: () => {},
  isSupported: false,
});

export const useNotesWithTracing = () => ({
  notes: [],
  isLoading: false,
  addNote: () => Promise.resolve(null),
  updateNote: () => Promise.resolve(null),
  deleteNote: () => Promise.resolve(false),
});

export const useOptimizedNotesQuery = () => ({
  notes: [],
  isLoading: false,
  refetch: () => Promise.resolve(),
  addNote: () => {},
  updateNote: () => {},
  removeNote: () => {},
});

export const useOnboarding = () => ({
  currentStep: 0,
  isCompleted: false,
  nextStep: () => {},
  previousStep: () => {},
  completeOnboarding: () => {},
});