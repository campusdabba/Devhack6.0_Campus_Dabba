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
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_active BOOLEAN DEFAULT TRUE
);

-- Create RLS policies for admin_keys
ALTER TABLE admin_keys ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admin keys are viewable by admins" ON admin_keys
    FOR SELECT
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM admins
            WHERE admins.id = auth.uid()
        )
    );

CREATE POLICY "Admin keys can be marked as used by admins" ON admin_keys
    FOR UPDATE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM admins
            WHERE admins.id = auth.uid()
        )
    );

-- Create RLS policies for admins
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view all admins" ON admins
    FOR SELECT
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM admins
            WHERE admins.id = auth.uid()
        )
    );

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
    
    -- Insert the new key
    INSERT INTO admin_keys (key)
    VALUES (new_key);
    
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