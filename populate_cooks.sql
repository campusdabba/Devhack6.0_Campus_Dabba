-- Populate cooks table with data from cooks.json
-- This script inserts the cook data that exists in cooks.json into the database

INSERT INTO cooks (
  id, 
  email, 
  first_name, 
  last_name, 
  phone, 
  profile_image, 
  description, 
  rating, 
  created_at, 
  address, 
  cuisine_type, 
  is_available,
  total_orders
) VALUES 
(
  '3d5f7b5e-efa9-4866-837f-8aca850b4f8a',
  'Ramesh@gmail.com',
  'Ramesh',
  'Nimbalker',
  '9013231321123',
  'https://ejtjwejiulepzcglswis.supabase.co/storage/v1/object/public/cook-images/3d5f7b5e-efa9-4866-837f-8aca850b4f8a-0.21225196817740155.jpg',
  'I specialise in cooking homemade local food, I love cooking as a hobby . I specialise in cooking homemade local food, I love cooking as a hobby . ',
  3.50,
  '2025-02-01 16:18:42.017417',
  '{"city": "Pune ", "state": "Maharashtra", "street": "Baner Road 2121212", "pincode": "411026"}',
  'maharashtrian',
  true,
  0
),
(
  '317bf6f3-4697-451c-9ee7-a048c1ab2206',
  'Reddyanna@gmail.com',
  'Reddy',
  'Anna',
  '1234567890',
  'https://ejtjwejiulepzcglswis.supabase.co/storage/v1/object/public/cook-images/317bf6f3-4697-451c-9ee7-a048c1ab2206-0.1444192253406662.jpg',
  'I am reddy anna I am reddy annaI am reddy annaI am reddy anna',
  4.90,
  '2025-02-01 10:45:33.623128',
  '{"city": "vijaywada", "state": "Andhra Pradesh", "street": "rd-35,Gundapur , Near MG road , Vijaywada", "pincode": "500019"}',
  'continental',
  true,
  0
),
(
  'b68695e7-1ca3-4064-8cf4-2910aa8e3cda',
  'Drake@gmail.com',
  'Drake',
  'Athe',
  '23141221343',
  'https://ejtjwejiulepzcglswis.supabase.co/storage/v1/object/public/cook-images/b68695e7-1ca3-4064-8cf4-2910aa8e3cda-0.7844962582326769.jpg',
  'I love cooking and am a passionate cook, I specialise in cooking South Indian Food, Especial Benne Dosa and idli Wada ',
  0.00,
  '2025-02-01 19:14:44.61458',
  '{"city": "Dharwad", "state": "Karnataka", "street": "Near sattur , Ittigati road , Dharwad ", "pincode": "500091"}',
  'indian',
  true,
  0
);

-- Verify the insert
SELECT id, email, first_name, last_name, cuisine_type, is_available FROM cooks;
