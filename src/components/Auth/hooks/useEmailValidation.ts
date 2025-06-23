
import { useState } from 'react';
import { supabase } from '../../../integrations/supabase/client';

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
      console.log('Checking if email exists:', emailToCheck);
      
      // Check if user exists in user_profiles table
      const { data: profile, error } = await supabase
        .from('user_profiles')
        .select('email, id')
        .eq('email', emailToCheck)
        .maybeSingle();

      if (error) {
        console.error('Error checking email:', error);
        setEmailExists(false);
        return false;
      }

      const emailAlreadyExists = !!profile;
      console.log('Email check result:', {
        email: emailToCheck,
        exists: emailAlreadyExists,
        profile: profile
      });
      
      setEmailExists(emailAlreadyExists);
      return emailAlreadyExists;
    } catch (error) {
      console.error('Exception while checking email:', error);
      setEmailExists(false);
      return false;
    } finally {
      setIsCheckingEmail(false);
    }
  };

  const resetEmailExists = () => {
    console.log('Resetting email exists state');
    setEmailExists(false);
  };

  return {
    emailExists,
    isCheckingEmail,
    checkEmailExists,
    resetEmailExists
  };
};
