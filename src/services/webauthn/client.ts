// Client-side WebAuthn/Passkey functions
import { startRegistration, startAuthentication } from '@simplewebauthn/browser';
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/utils/logger';

// Helper function to make API requests
async function sendRequest(url: string, data?: any) {
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: data ? JSON.stringify(data) : undefined,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Request failed');
  }

  return response.json();
}

/**
 * Register a new passkey for the current user
 */
export async function createPasskey(): Promise<any> {
  try {
    // Get the current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      throw new Error('User not authenticated');
    }

    logger.auth.info('Starting passkey registration for user:', user.id);

    // Step 1: Get registration options from server
    const options = await sendRequest('/api/passkeys/register/start');
    
    // Step 2: Create passkey using WebAuthn API
    const credential = await startRegistration(options);
    
    // Step 3: Send credential to server for verification and storage
    const newPasskey = await sendRequest('/api/passkeys/register/finish', credential);
    
    logger.auth.info('Passkey registration successful');
    return newPasskey;
  } catch (error) {
    logger.auth.error('Passkey registration failed:', error);
    throw error;
  }
}

/**
 * Authenticate using a passkey
 */
export async function authenticateWithPasskey(): Promise<{ verified: boolean }> {
  try {
    logger.auth.info('Starting passkey authentication');

    // Step 1: Get authentication options from server
    const options = await sendRequest('/api/passkeys/authenticate/start');
    
    // Step 2: Get assertion using WebAuthn API
    const assertion = await startAuthentication(options);
    
    // Step 3: Send assertion to server for verification
    const result = await sendRequest('/api/passkeys/authenticate/finish', assertion);
    
    logger.auth.info('Passkey authentication successful');
    return result;
  } catch (error) {
    logger.auth.error('Passkey authentication failed:', error);
    throw error;
  }
}

/**
 * Check if passkeys are supported by the browser
 */
export function isPasskeySupported(): boolean {
  return (
    typeof window !== 'undefined' &&
    window.PublicKeyCredential &&
    typeof window.PublicKeyCredential === 'function'
  );
}

/**
 * Get user's existing passkeys
 */
export async function getUserPasskeys(): Promise<any[]> {
  try {
    // Use RPC call since webauthn schema isn't in generated types
    const { data: credentials, error } = await supabase.rpc('get_user_passkeys');

    if (error) {
      throw error;
    }

    return credentials || [];
  } catch (error) {
    logger.auth.error('Failed to fetch user passkeys:', error);
    throw error;
  }
}

/**
 * Delete a passkey
 */
export async function deletePasskey(credentialId: string): Promise<void> {
  try {
    // Use RPC call since webauthn schema isn't in generated types
    const { error } = await supabase.rpc('delete_user_passkey', { 
      credential_id: credentialId 
    });

    if (error) {
      throw error;
    }

    logger.auth.info('Passkey deleted successfully');
  } catch (error) {
    logger.auth.error('Failed to delete passkey:', error);
    throw error;
  }
}