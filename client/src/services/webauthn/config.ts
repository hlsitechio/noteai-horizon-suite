// WebAuthn configuration for passkey authentication
export const webAuthnConfig = {
  relyingPartyID: typeof window !== 'undefined' ? window.location.hostname : 'localhost',
  relyingPartyName: 'Lovable App',
  relyingPartyOrigin: typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000',
};