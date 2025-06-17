-- Fix RLS policies for cooks table to allow public browsing
-- This allows anonymous users and students to view all cooks for browsing

-- Add a policy to allow everyone to SELECT/read cook data
CREATE POLICY "Anyone can view cook profiles for browsing" ON cooks
FOR SELECT
USING (true);

-- Alternative: If you want to be more specific, you can allow only when is_available is true
-- CREATE POLICY "Anyone can view available cook profiles" ON cooks
-- FOR SELECT
-- USING (is_available = true);

-- Verify the policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies 
WHERE tablename = 'cooks'
ORDER BY policyname;
