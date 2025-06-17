-- Test cook signup functionality

-- 1. Test if you can insert a cook record
-- Replace 'your-user-id-here' with an actual auth user ID

-- Example test insert (don't run this as-is, replace the ID)
/*
INSERT INTO public.cooks (
  id,
  email,
  first_name,
  last_name,
  phone,
  address,
  cuisineType,
  description,
  region,
  rating
) VALUES (
  'your-user-id-here'::uuid,
  'test@example.com',
  'Test',
  'Cook',
  '1234567890',
  '{"street": "123 Test St", "city": "Test City", "state": "Test State", "pincode": "123456"}'::jsonb,
  'North Indian',
  'I am a passionate cook who loves to prepare delicious North Indian food for everyone.',
  'Test State',
  0.0
);
*/

-- 2. Check if the cooks table structure is correct
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'cooks'
ORDER BY ordinal_position;

-- 3. Check if the storage bucket exists
SELECT * FROM storage.buckets WHERE id = 'cook-images';

-- 4. Check if RLS policies exist on cooks table
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename = 'cooks';

-- 5. Test the set_user_role function (replace with actual user ID)
-- SELECT public.set_user_role('your-user-id-here'::uuid, 'cook');

-- 6. Check if users table has role column
SELECT column_name, data_type, column_default 
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'users' 
AND column_name = 'role';
