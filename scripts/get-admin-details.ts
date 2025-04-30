import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config({ path: resolve(__dirname, '../.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function getAdminDetails() {
  const adminId = 'e67ccb18-e73f-4d42-b20a-4f02c40be578';

  try {
    // Get user details from auth.users
    const { data: authUser, error: authError } = await supabase
      .from('users')
      .select('*')
      .eq('id', adminId)
      .single();

    if (authError) {
      console.error('Error fetching auth user:', authError);
      return;
    }

    // Get admin details from admins table
    const { data: adminData, error: adminError } = await supabase
      .from('admins')
      .select('*')
      .eq('id', adminId)
      .single();

    if (adminError) {
      console.error('Error fetching admin data:', adminError);
      return;
    }

    console.log('\n=== Admin User Details ===');
    console.log('\nAuthentication Details:');
    console.log('ID:', authUser.id);
    console.log('Email:', authUser.email);
    console.log('First Name:', authUser.first_name);
    console.log('Last Name:', authUser.last_name);
    console.log('Created At:', authUser.created_at);
    console.log('Updated At:', authUser.updated_at);

    console.log('\nAdmin Access Details:');
    console.log('Admin ID:', adminData.id);
    console.log('User ID:', adminData.user_id);
    console.log('Created At:', adminData.created_at);
    console.log('Updated At:', adminData.updated_at);

    console.log('\nSave these credentials for future access:');
    console.log('Email:', authUser.email);
    console.log('User ID:', authUser.id);
    console.log('Admin ID:', adminData.id);

  } catch (error) {
    console.error('Error:', error);
  }
}

getAdminDetails();