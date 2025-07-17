-- Create WebAuthn schema and tables for passkey authentication (fixed version)
CREATE SCHEMA IF NOT EXISTS webauthn;

-- Drop existing schema if it exists to start fresh
DROP SCHEMA IF EXISTS webauthn CASCADE;
CREATE SCHEMA webauthn;

-- Create custom types for WebAuthn
CREATE TYPE webauthn.credential_type AS ENUM ('public-key');
CREATE TYPE webauthn.user_verification_status AS ENUM ('unverified', 'verified');
CREATE TYPE webauthn.device_type AS ENUM ('single_device', 'multi_device');
CREATE TYPE webauthn.backup_state AS ENUM ('not_backed_up', 'backed_up');

-- Create credentials table to store passkey data
CREATE TABLE webauthn.credentials (
  id                       uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id                  uuid NOT NULL,
  friendly_name            text,
  credential_type          webauthn.credential_type NOT NULL,
  credential_id            varchar NOT NULL UNIQUE,
  public_key               bytea NOT NULL,
  aaguid                   varchar DEFAULT '00000000-0000-0000-0000-000000000000'::varchar NOT NULL,
  sign_count               integer NOT NULL,
  transports               text[] NOT NULL,
  user_verification_status webauthn.user_verification_status NOT NULL,
  device_type              webauthn.device_type NOT NULL,
  backup_state             webauthn.backup_state NOT NULL,
  created_at               timestamptz DEFAULT now() NOT NULL,
  updated_at               timestamptz DEFAULT now() NOT NULL,
  last_used_at             timestamptz,
  CONSTRAINT credentials_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users (id) ON DELETE CASCADE
);

-- Create challenges table for WebAuthn challenges
CREATE TABLE webauthn.challenges (
  id         uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id    uuid NULL,
  value      text NOT NULL UNIQUE,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT challenges_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users (id) ON DELETE CASCADE
);

-- Enable RLS
ALTER TABLE webauthn.credentials ENABLE ROW LEVEL SECURITY;
ALTER TABLE webauthn.challenges ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for credentials
CREATE POLICY "Users can manage their own credentials" 
ON webauthn.credentials 
FOR ALL 
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Create RLS policies for challenges
CREATE POLICY "Users can manage their own challenges" 
ON webauthn.challenges 
FOR ALL 
USING (auth.uid() = user_id OR user_id IS NULL)
WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

-- Create function to update updated_at column
CREATE OR REPLACE FUNCTION webauthn.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for auto-updating updated_at
CREATE TRIGGER update_credentials_updated_at
BEFORE UPDATE ON webauthn.credentials
FOR EACH ROW
EXECUTE FUNCTION webauthn.update_updated_at_column();