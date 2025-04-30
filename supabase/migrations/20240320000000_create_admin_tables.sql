-- Drop existing policies first
DROP POLICY IF EXISTS "Admin keys are viewable by admins" ON admin_keys CASCADE;
DROP POLICY IF EXISTS "Admin keys can be marked as used by admins" ON admin_keys CASCADE;
DROP POLICY IF EXISTS "Admins can view all admins" ON admins CASCADE;

-- Drop existing function with CASCADE
DROP FUNCTION IF EXISTS is_admin(UUID) CASCADE;

-- Drop existing tables if they exist
DROP TABLE IF EXISTS admin_keys CASCADE;
DROP TABLE IF EXISTS admins CASCADE;

-- Create admin_keys table
CREATE TABLE IF NOT EXISTS admin_keys (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    key TEXT NOT NULL UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    used BOOLEAN DEFAULT FALSE,
    used_by UUID REFERENCES auth.users(id),
    expires_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '7 days')
);

-- Create admins table
CREATE TABLE IF NOT EXISTS admins (
    id UUID PRIMARY KEY REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_active BOOLEAN DEFAULT TRUE
);

-- Create is_admin function first
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

-- Create RLS policies for admin_keys
ALTER TABLE admin_keys ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admin keys are viewable by admins" ON admin_keys
    FOR SELECT
    TO authenticated
    USING (is_admin(auth.uid()));

CREATE POLICY "Admin keys can be marked as used by admins" ON admin_keys
    FOR UPDATE
    TO authenticated
    USING (is_admin(auth.uid()));

-- Create RLS policies for admins
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view all admins" ON admins
    FOR SELECT
    TO authenticated
    USING (is_admin(auth.uid()));

-- Function to generate a random admin key
CREATE OR REPLACE FUNCTION generate_admin_key()
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    new_key TEXT;
BEGIN
    -- Generate a 32-character random string
    new_key := encode(gen_random_bytes(16), 'hex');
    
    -- Insert the new key with 30 days expiration
    INSERT INTO admin_keys (key, expires_at)
    VALUES (new_key, NOW() + INTERVAL '30 days');
    
    RETURN new_key;
END;
$$;

-- Generate some initial admin keys
DO $$
BEGIN
    -- Generate 5 admin keys
    FOR i IN 1..5 LOOP
        PERFORM generate_admin_key();
    END LOOP;
END $$; 