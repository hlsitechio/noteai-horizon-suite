// Temporary placeholder for missing Feature Flags hook
import { useState } from 'react';

export const useFeatureFlags = () => {
  const [flags, setFlags] = useState({});

  return {
    flags,
    isEnabled: (flag: string) => false,
    refresh: () => {},
  };
};