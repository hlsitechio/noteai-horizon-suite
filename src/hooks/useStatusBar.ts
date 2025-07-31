import { useState, useEffect } from 'react';

interface StatusBarState {
  message: string;
  isEnabled: boolean;
  scrollSpeed: number; // 1-10 scale (1 = slow, 10 = fast)
}

const DEFAULT_MESSAGE = "Important reminder: Check your notifications for updates";

export const useStatusBar = () => {
  const [statusBar, setStatusBar] = useState<StatusBarState>({
    message: DEFAULT_MESSAGE,
    isEnabled: true,
    scrollSpeed: 5, // Medium speed by default
  });

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('statusBar');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setStatusBar(parsed);
      } catch (error) {
        console.error('Failed to parse statusBar from localStorage:', error);
      }
    }
  }, []);

  // Save to localStorage when state changes
  useEffect(() => {
    localStorage.setItem('statusBar', JSON.stringify(statusBar));
  }, [statusBar]);

  const updateMessage = (message: string) => {
    setStatusBar(prev => ({ ...prev, message }));
  };

  const toggleEnabled = () => {
    setStatusBar(prev => ({ ...prev, isEnabled: !prev.isEnabled }));
  };

  const setEnabled = (isEnabled: boolean) => {
    setStatusBar(prev => ({ ...prev, isEnabled }));
  };

  const updateScrollSpeed = (scrollSpeed: number) => {
    setStatusBar(prev => ({ ...prev, scrollSpeed }));
  };

  return {
    message: statusBar.message,
    isEnabled: statusBar.isEnabled,
    scrollSpeed: statusBar.scrollSpeed,
    updateMessage,
    toggleEnabled,
    setEnabled,
    updateScrollSpeed,
  };
};