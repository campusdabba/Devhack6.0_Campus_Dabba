-- Fix cook signup issues based on actual schema

-- 1. Update the cooks table to match your existing schema
-- Don't recreate it, just ensure proper columns exist
ALTER TABLE public.cooks ADD COLUMN IF NOT EXISTS email TEXT;
ALTER TABLE public.cooks ADD COLUMN IF NOT EXISTS first_name TEXT;
ALTER TABLE public.cooks ADD COLUMN IF NOT EXISTS last_name TEXT;
ALTER TABLE public.cooks ADD COLUMN IF NOT EXISTS phone TEXT;
ALTER TABLE public.cooks ADD COLUMN IF NOT EXISTS profile_image TEXT;
ALTER TABLE public.cooks ADD COLUMN IF NOT EXISTS address JSONB;
ALTER TABLE public.cooks ADD COLUMN IF NOT EXISTS cuisineType TEXT;
ALTER TABLE public.cooks ADD COLUMN IF NOT EXISTS description TEXT;
ALTER TABLE public.cooks ADD COLUMN IF NOT EXISTS certification JSONB DEFAULT '[]'::jsonb;
ALTER TABLE public.cooks ADD COLUMN IF NOT EXISTS region TEXT;
ALTER TABLE public.cooks ADD COLUMN IF NOT EXISTS rating DECIMAL(3,2) DEFAULT 0.0;
ALTER TABLE public.cooks ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW();
ALTER TABLE public.cooks ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- 2. Ensure users table exists with role column
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'student';

-- 3. Create or replace the handle_new_user function to properly handle cook registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
  -- Insert into public.users table
  INSERT INTO public.users (id, email, created_at, updated_at, role, first_name, last_name, phone)
  VALUES (
    new.id, 
    new.email, 
    COALESCE(new.created_at, now()), 
    now(),
    COALESCE(new.raw_user_meta_data->>'role', 'student'),
    COALESCE(new.raw_user_meta_data->>'first_name', ''),
    COALESCE(new.raw_user_meta_data->>'last_name', ''),
    COALESCE(new.raw_user_meta_data->>'phone', '')
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    first_name = COALESCE(EXCLUDED.first_name, users.first_name),
    last_name = COALESCE(EXCLUDED.last_name, users.last_name),
    phone = COALESCE(EXCLUDED.phone, users.phone),
    role = COALESCE(EXCLUDED.role, users.role);
  
  RETURN new;
EXCEPTION WHEN OTHERS THEN
  -- Don't fail auth creation if user record creation fails
  RETURN new;
END;
$$;

-- 4. Ensure the trigger exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- 5. Create function to set user role
CREATE OR REPLACE FUNCTION public.set_user_role(user_id UUID, new_role TEXT)
RETURNS VOID
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
  -- Verify the role is valid
  IF new_role NOT IN ('cook', 'student', 'admin') THEN
    RAISE EXCEPTION 'Invalid role: %', new_role;
  END IF;

  -- Update the user's role in auth.users metadata
  UPDATE auth.users
  SET raw_user_meta_data = 
    CASE 
      WHEN raw_user_meta_data IS NULL THEN 
        jsonb_build_object('role', new_role)
      ELSE 
        raw_user_meta_data || jsonb_build_object('role', new_role)
    END
  WHERE id = user_id;

  -- Update the role in public.users table
  UPDATE public.users
  SET role = new_role
  WHERE id = user_id;
END;
$$;

-- 6. Enable RLS policies for cooks table
ALTER TABLE public.cooks ENABLE ROW LEVEL SECURITY;

-- 7. Create RLS policies for cooks
CREATE POLICY "Cooks can view their own data" ON public.cooks
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Cooks can update their own data" ON public.cooks
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Cooks can insert their own data" ON public.cooks
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Anyone can view cooks" ON public.cooks
  FOR SELECT USING (true);



-- 8. Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON public.cooks TO anon, authenticated;
GRANT ALL ON public.users TO anon, authenticated;

-- 9. Create storage bucket for cook images if it doesn't exist
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'cook-images',
  'cook-images',
  true,
  10485760, -- 10MB
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO NOTHING;

-- 10. Create storage policies for cook images
CREATE POLICY "Anyone can view cook images" ON storage.objects
  FOR SELECT USING (bucket_id = 'cook-images');

CREATE POLICY "Authenticated users can upload cook images" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'cook-images' 
    AND auth.role() = 'authenticated'
  );

CREATE POLICY "Users can update their own cook images" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'cook-images' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can delete their own cook images" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'cook-images' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );
