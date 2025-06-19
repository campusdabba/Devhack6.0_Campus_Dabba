-- RLS Policy to allow admins to view all users
-- This policy should be added to the users table

-- First, let's create a policy for admins to SELECT all users
CREATE POLICY "Admins can view all users" ON public.users
FOR SELECT
TO authenticated
USING (
  -- Check if the current user is an admin
  EXISTS (
    SELECT 1 FROM public.users 
    WHERE id = auth.uid() 
    AND role = 'admin'
  )
);

-- Also allow admins to update any user (optional)
CREATE POLICY "Admins can update all users" ON public.users
FOR UPDATE
TO authenticated
USING (
  -- Check if the current user is an admin
  EXISTS (
    SELECT 1 FROM public.users 
    WHERE id = auth.uid() 
    AND role = 'admin'
  )
);

-- Allow admins to delete any user (optional)
CREATE POLICY "Admins can delete all users" ON public.users
FOR DELETE
TO authenticated
USING (
  -- Check if the current user is an admin
  EXISTS (
    SELECT 1 FROM public.users 
    WHERE id = auth.uid() 
    AND role = 'admin'
  )
);
