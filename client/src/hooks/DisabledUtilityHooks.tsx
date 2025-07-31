// Disabled storage and task hooks - placeholders
export const useStorageInitialization = () => ({
  isInitialized: false,
  isLoading: false,
  initializeStorage: () => Promise.resolve(),
});

export const useTasks = () => ({
  tasks: [],
  isLoading: false,
  createTask: () => Promise.resolve(null),
  updateTask: () => Promise.resolve(null),
  deleteTask: () => Promise.resolve(false),
});

export const useServerSideRendering = () => ({
  isSSR: false,
  isHydrated: true,
});

export const useVideoProcessor = () => ({
  processVideo: () => Promise.resolve(null),
  isProcessing: false,
});

export const useWebRTC = () => ({
  isConnected: false,
  connect: () => Promise.resolve(),
  disconnect: () => {},
});