-- Enhanced security audit table for comprehensive CSP monitoring
CREATE INDEX IF NOT EXISTS idx_security_audit_logs_event_type ON security_audit_logs(event_type);
CREATE INDEX IF NOT EXISTS idx_security_audit_logs_timestamp ON security_audit_logs(timestamp);
CREATE INDEX IF NOT EXISTS idx_security_audit_logs_user_id ON security_audit_logs(user_id);

-- Add column for CSP report URI tracking if not exists
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='security_audit_logs' AND column_name='csp_report_uri') THEN
        ALTER TABLE security_audit_logs 
        ADD COLUMN csp_report_uri text;
    END IF;
END $$;

-- Create a function to clean up old security logs (older than 30 days)
CREATE OR REPLACE FUNCTION cleanup_old_security_logs()
RETURNS void AS $$
BEGIN
    DELETE FROM security_audit_logs 
    WHERE created_at < NOW() - INTERVAL '30 days';
END;
$$ LANGUAGE plpgsql;

-- Create a scheduled job to run cleanup daily (requires pg_cron extension)
-- This will only work if pg_cron is enabled in your Supabase project
DO $$
BEGIN
    -- Try to create the cron job, but don't fail if pg_cron is not available
    BEGIN
        PERFORM cron.schedule('cleanup-security-logs', '0 2 * * *', 'SELECT cleanup_old_security_logs();');
    EXCEPTION WHEN OTHERS THEN
        -- Silently continue if pg_cron is not available
        NULL;
    END;
END $$;