import { useState, useEffect, useCallback } from 'react';
import { consoleCapture, ConsoleMessage } from '@/utils/consoleCapture';

export const useConsoleCapture = () => {
  const [messages, setMessages] = useState<ConsoleMessage[]>([]);
  const [stats, setStats] = useState({
    total: 0,
    errors: 0,
    warnings: 0,
    logs: 0,
    info: 0,
    debug: 0,
    trace: 0
  });

  const refreshMessages = useCallback(() => {
    const allMessages = consoleCapture.getAllMessages();
    setMessages(allMessages);
    setStats(consoleCapture.getMessageStats());
  }, []);

  useEffect(() => {
    // Initial load
    refreshMessages();

    // Set up periodic refresh to catch new messages
    const interval = setInterval(refreshMessages, 1000);

    return () => clearInterval(interval);
  }, [refreshMessages]);

  const getErrorsAndWarnings = useCallback(() => {
    return consoleCapture.getErrorsAndWarnings();
  }, []);

  const getRecentMessages = useCallback((minutes: number = 5) => {
    return consoleCapture.getMessagesFromLastMinutes(minutes);
  }, []);

  const exportAllMessages = useCallback(() => {
    return consoleCapture.exportMessages();
  }, []);

  const clearAllMessages = useCallback(() => {
    consoleCapture.clearMessages();
    refreshMessages();
  }, [refreshMessages]);

  return {
    messages,
    stats,
    getErrorsAndWarnings,
    getRecentMessages,
    exportAllMessages,
    clearAllMessages,
    refreshMessages
  };
};