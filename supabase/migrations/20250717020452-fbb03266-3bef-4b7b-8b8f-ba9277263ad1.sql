-- Create database functions for WebAuthn operations

-- Function to get user's passkeys
CREATE OR REPLACE FUNCTION get_user_passkeys()
RETURNS TABLE (
  id uuid,
  friendly_name text,
  credential_type webauthn.credential_type,
  device_type webauthn.device_type,
  backup_state webauthn.backup_state,
  created_at timestamptz,
  updated_at timestamptz,
  last_used_at timestamptz
)
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT 
    id,
    friendly_name,
    credential_type,
    device_type,
    backup_state,
    created_at,
    updated_at,
    last_used_at
  FROM webauthn.credentials
  WHERE user_id = auth.uid()
  ORDER BY created_at DESC;
$$;

-- Function to delete a user's passkey
CREATE OR REPLACE FUNCTION delete_user_passkey(credential_id text)
RETURNS void
LANGUAGE sql
SECURITY DEFINER
AS $$
  DELETE FROM webauthn.credentials
  WHERE credential_id = delete_user_passkey.credential_id
  AND user_id = auth.uid();
$$;