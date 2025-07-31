// Updated client with direct edge function calls instead of RPC
import { startRegistration, startAuthentication } from '@simplewebauthn/browser';
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/utils/logger';

// Helper function to make API requests
async function sendRequest(url: string, data?: any) {
  const { data: { session } } = await supabase.auth.getSession();
  const authHeader = session?.access_token ? `Bearer ${session.access_token}` : '';

  const response = await fetch(url, {
    method: data ? 'POST' : 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': authHeader,
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
    const options = await sendRequest('/functions/v1/passkey-register');
    
    // Step 2: Create passkey using WebAuthn API
    const credential = await startRegistration(options);
    
    // Step 3: Send credential to server for verification and storage
    const newPasskey = await sendRequest('/functions/v1/passkey-register', credential);
    
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
    const options = await sendRequest('/functions/v1/passkey-authenticate');
    
    // Step 2: Get assertion using WebAuthn API
    const assertion = await startAuthentication(options);
    
    // Step 3: Send assertion to server for verification
    const result = await sendRequest('/functions/v1/passkey-authenticate', assertion);
    
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
 * Get user's existing passkeys using edge function
 */
export async function getUserPasskeys(): Promise<any[]> {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    const authHeader = session?.access_token ? `Bearer ${session.access_token}` : '';

    const response = await fetch('/functions/v1/passkey-manage', {
      headers: {
        'Authorization': authHeader,
      },
    });
    if (!response.ok) {
      throw new Error('Failed to fetch passkeys');
    }
    const credentials = await response.json();
    return credentials || [];
  } catch (error) {
    logger.auth.error('Failed to fetch user passkeys:', error);
    throw error;
  }
}

/**
 * Delete a passkey using edge function
 */
export async function deletePasskey(credentialId: string): Promise<void> {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    const authHeader = session?.access_token ? `Bearer ${session.access_token}` : '';

    const response = await fetch('/functions/v1/passkey-manage', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authHeader,
      },
      body: JSON.stringify({ credentialId }),
    });

    if (!response.ok) {
      throw new Error('Failed to delete passkey');
    }

    logger.auth.info('Passkey deleted successfully');
  } catch (error) {
    logger.auth.error('Failed to delete passkey:', error);
    throw error;
  }
}