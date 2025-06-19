-- Fix RLS po---- Fix RLS policies for admin access to users table
-- This script removes problematic policies and creates a safe admin access policy

-- First, let's drop any existing problematic policies
DROP POLICY IF EXISTS "Admins can view all users" ON public.users;
DROP POLICY IF EXISTS "Admins can update all users" ON public.users;
DROP POLICY IF EXISTS "Admins can delete all users" ON public.users;
DROP POLICY IF EXISTS "Users can view their own profile" ON public.users;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.users;
DROP POLICY IF EXISTS "Users can view their own profile or admins can view all" ON public.users;
DROP POLICY IF EXISTS "Users can update their own profile or admins can update all" ON public.users;
DROP POLICY IF EXISTS "Admins can insert users" ON public.users;
DROP POLICY IF EXISTS "Admins can delete users" ON public.users;

-- Now drop existing functions (CASCADE will remove dependent policies)
DROP FUNCTION IF EXISTS public.is_admin(UUID) CASCADE;
DROP FUNCTION IF EXISTS public.has_admin_role(UUID) CASCADE;

-- Create a safe function to check admin status
-- This function will use SECURITY DEFINER to bypass RLS
-- Use input_user_id as parameter name to match RPC expectations
CREATE FUNCTION public.is_admin(input_user_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.users 
    WHERE id = input_user_id 
    AND role = 'admin'
  );
END;
$$; access to users table
-- This script removes problematic policies and creates a safe admin access policy

-- First, let's drop any existing problematic policies
DROP POLICY IF EXISTS "Admins can view all users" ON public.users;
DROP POLICY IF EXISTS "Admins can update all users" ON public.users;
DROP POLICY IF EXISTS "Admins can delete all users" ON public.users;
DROP POLICY IF EXISTS "Users can view their own profile" ON public.users;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.users;

-- Drop existing function if it exists
DROP FUNCTION IF EXISTS public.is_admin(UUID);

-- Create a safe function to check admin status
-- This function will use SECURITY DEFINER to bypass RLS
-- Use input_user_id as parameter name to match RPC expectations
CREATE FUNCTION public.is_admin(input_user_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.users 
    WHERE id = input_user_id 
    AND role = 'admin'
  );
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION public.is_admin(UUID) TO authenticated;

-- Now create safe RLS policies using the function
CREATE POLICY "Users can view their own profile or admins can view all" ON public.users
FOR SELECT
TO authenticated
USING (
  auth.uid() = id OR public.is_admin(auth.uid())
);

CREATE POLICY "Users can update their own profile or admins can update all" ON public.users
FOR UPDATE
TO authenticated
USING (
  auth.uid() = id OR public.is_admin(auth.uid())
);

CREATE POLICY "Admins can insert users" ON public.users
FOR INSERT
TO authenticated
WITH CHECK (
  public.is_admin(auth.uid())
);

CREATE POLICY "Admins can delete users" ON public.users
FOR DELETE
TO authenticated
USING (
  public.is_admin(auth.uid())
);

-- Ensure RLS is enabled
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Also create a similar function for checking if user has admin role in an array
CREATE FUNCTION public.has_admin_role(input_user_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.users 
    WHERE id = input_user_id 
    AND (
      role = 'admin' OR 
      (role::text LIKE '%admin%') OR
      (role::jsonb ? 'admin')
    )
  );
END;
$$;

GRANT EXECUTE ON FUNCTION public.has_admin_role(UUID) TO authenticated;
