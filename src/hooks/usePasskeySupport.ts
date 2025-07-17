import { useEffect, useState } from 'react';
import { isPasskeySupported } from '@/services/webauthn/client';

export const usePasskeySupport = () => {
  const [isSupported, setIsSupported] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkSupport = async () => {
      try {
        const supported = isPasskeySupported();
        setIsSupported(supported);
      } catch (error) {
        console.error('Error checking passkey support:', error);
        setIsSupported(false);
      } finally {
        setIsChecking(false);
      }
    };

    checkSupport();
  }, []);

  return { isSupported, isChecking };
};