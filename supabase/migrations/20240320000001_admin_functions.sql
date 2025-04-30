-- Function to verify an admin key
CREATE OR REPLACE FUNCTION verify_admin_key(key_to_verify TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    key_exists BOOLEAN;
    key_expired BOOLEAN;
    key_used BOOLEAN;
BEGIN
    -- Check if key exists, is not expired, and is not used
    SELECT 
        EXISTS (
            SELECT 1 FROM admin_keys 
            WHERE key = key_to_verify
        ),
        EXISTS (
            SELECT 1 FROM admin_keys 
            WHERE key = key_to_verify 
            AND expires_at < NOW()
        ),
        EXISTS (
            SELECT 1 FROM admin_keys 
            WHERE key = key_to_verify 
            AND used = TRUE
        )
    INTO key_exists, key_expired, key_used;

    RETURN key_exists AND NOT key_expired AND NOT key_used;
END;
$$;

-- Function to create a new admin
CREATE OR REPLACE FUNCTION create_admin(
    admin_key TEXT,
    user_id UUID
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    key_valid BOOLEAN;
BEGIN
    -- Verify the admin key
    SELECT verify_admin_key(admin_key) INTO key_valid;
    
    IF NOT key_valid THEN
        RETURN FALSE;
    END IF;
    
    -- Insert into admins table
    INSERT INTO admins (id)
    VALUES (user_id);
    
    -- Mark the admin key as used
    UPDATE admin_keys
    SET used = TRUE,
        used_by = user_id
    WHERE key = admin_key;
    
    RETURN TRUE;
END;
$$;

-- Function to list available admin keys
CREATE OR REPLACE FUNCTION list_available_admin_keys()
RETURNS TABLE (
    key TEXT,
    created_at TIMESTAMP WITH TIME ZONE,
    expires_at TIMESTAMP WITH TIME ZONE
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        ak.key,
        ak.created_at,
        ak.expires_at
    FROM admin_keys ak
    WHERE ak.used = FALSE
    AND ak.expires_at > NOW();
END;
$$; 