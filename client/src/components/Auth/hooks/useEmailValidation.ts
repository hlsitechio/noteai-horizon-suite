
import { useState } from 'react';
import { supabase } from '../../../integrations/supabase/client';
import { logger } from '../../../utils/logger';

export const useEmailValidation = () => {
  const [emailExists, setEmailExists] = useState(false);
  const [isCheckingEmail, setIsCheckingEmail] = useState(false);

  const checkEmailExists = async (emailToCheck: string) => {
    if (!emailToCheck || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailToCheck)) {
      setEmailExists(false);
      return false;
    }

    setIsCheckingEmail(true);
    try {
      logger.auth.debug('Checking if email exists:', emailToCheck);
      
      // Check if user exists in user_profiles table
      const { data: profile, error } = await supabase
        .from('user_profiles')
        .select('email, id')
        .eq('email', emailToCheck)
        .single();

      if (error) {
        logger.auth.error('Error checking email:', error);
        setEmailExists(false);
        return false;
      }

      const emailAlreadyExists = !!profile;
      logger.auth.debug('Email check result:', {
        email: emailToCheck,
        exists: emailAlreadyExists,
        profile: profile
      });
      
      setEmailExists(emailAlreadyExists);
      return emailAlreadyExists;
    } catch (error) {
      logger.auth.error('Exception while checking email:', error);
      setEmailExists(false);
      return false;
    } finally {
      setIsCheckingEmail(false);
    }
  };

  const resetEmailExists = () => {
    logger.auth.debug('Resetting email exists state');
    setEmailExists(false);
  };

  return {
    emailExists,
    isCheckingEmail,
    checkEmailExists,
    resetEmailExists
  };
};
