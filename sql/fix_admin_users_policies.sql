-- First, drop the problematic policy that causes infinite recursion
DROP POLICY IF EXISTS "Admins can view all users" ON public.users;

-- Option 1: Create a function-based policy (Recommended)
-- This avoids infinite recursion by using a function that checks admin status

CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  -- Check if the current user has admin role in auth.users metadata
  -- or use a different approach to avoid recursion
  RETURN (
    SELECT COALESCE(
      (auth.jwt() ->> 'role')::text = 'admin',
      false
    )
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create admin policy using the function
CREATE POLICY "Admins can view all users" ON public.users
FOR SELECT
TO authenticated
USING (is_admin());

-- Option 2: Alternative - Use a simpler approach with service role
-- If the function approach doesn't work, we can create a policy that allows
-- specific admin user IDs (you'll need to replace with actual admin user IDs)

-- Uncomment and modify the following if you prefer to hardcode admin user IDs:
/*
CREATE POLICY "Specific admins can view all users" ON public.users
FOR SELECT
TO authenticated
USING (
  auth.uid() IN (
    '469df764-d80e-4ceb-b59a-ad22b9f64f25'::uuid,  -- Replace with actual admin user IDs
    '5ca5d76b-9556-4871-8e3e-f944ea279fb5'::uuid,
    'e67ccb18-e73f-4d42-b20a-4f02c40be578'::uuid
  )
);
*/

-- Option 3: Create a separate admin_users table (Most robust solution)
-- This completely avoids the recursion issue
/*
CREATE TABLE IF NOT EXISTS public.admin_users (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert existing admin users
INSERT INTO public.admin_users (user_id) 
SELECT id FROM public.users WHERE role = 'admin'
ON CONFLICT (user_id) DO NOTHING;

-- Enable RLS on admin_users table
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- Create policy for admin_users table
CREATE POLICY "Admins can manage admin_users" ON public.admin_users
FOR ALL
TO authenticated
USING (user_id = auth.uid());

-- Update the users policy to use the admin_users table
DROP POLICY IF EXISTS "Admins can view all users" ON public.users;
CREATE POLICY "Admins can view all users" ON public.users
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.admin_users 
    WHERE user_id = auth.uid()
  )
);
*/
