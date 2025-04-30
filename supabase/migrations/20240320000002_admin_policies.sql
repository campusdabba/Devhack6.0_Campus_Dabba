-- Enable RLS on users
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Create a policy to allow admins to view all users
CREATE POLICY "Admins can view all users" ON users
    FOR SELECT
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM admins
            WHERE admins.id = auth.uid()
        )
    );

-- Create a policy to allow admins to update user metadata
CREATE POLICY "Admins can update user metadata" ON users
    FOR UPDATE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM admins
            WHERE admins.id = auth.uid()
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM admins
            WHERE admins.id = auth.uid()
        )
    ); 