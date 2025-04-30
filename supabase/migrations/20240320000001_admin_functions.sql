-- Function to verify an admin key
CREATE OR REPLACE FUNCTION verify_admin_key(key_to_verify TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM admin_keys 
        WHERE key = key_to_verify
        AND NOT used
        AND expires_at > NOW()
    );
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

-- Drop existing function first
DROP FUNCTION IF EXISTS is_admin(UUID);

-- Function to check if a user is an admin
CREATE OR REPLACE FUNCTION is_admin(input_user_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM admins
        WHERE admins.id = input_user_id
    );
END;
$$;

-- Generate a new admin key
SELECT generate_admin_key() as new_admin_key; 