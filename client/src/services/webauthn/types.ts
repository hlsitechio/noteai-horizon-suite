// Types for WebAuthn/Passkey functionality
export interface PasskeyCredential {
  id: string;
  user_id: string;
  friendly_name?: string;
  credential_type: 'public-key';
  credential_id: string;
  device_type: 'single_device' | 'multi_device';
  backup_state: 'not_backed_up' | 'backed_up';
  created_at: string;
  updated_at: string;
  last_used_at?: string;
}

export interface WebAuthnChallenge {
  id: string;
  user_id?: string;
  value: string;
  created_at: string;
}

export interface PasskeyRegistrationOptions {
  challenge: string;
  rp: {
    name: string;
    id: string;
  };
  user: {
    id: Uint8Array;
    name: string;
    displayName: string;
  };
  pubKeyCredParams: Array<{
    alg: number;
    type: string;
  }>;
  authenticatorSelection?: {
    residentKey?: string;
    userVerification?: string;
    authenticatorAttachment?: string;
  };
  excludeCredentials?: Array<{
    id: string;
    type: string;
    transports?: string[];
  }>;
}

export interface PasskeyAuthenticationOptions {
  challenge: string;
  rpId: string;
  allowCredentials?: Array<{
    id: string;
    type: string;
    transports?: string[];
  }>;
}