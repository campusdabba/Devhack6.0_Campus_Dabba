import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Error: Missing Supabase credentials in environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testAdminKey() {
  try {
    console.log('Testing admin key verification...');
    console.log('Using Supabase URL:', supabaseUrl);
    
    // First, let's check if the key exists in the admin_keys table
    const { data: keyData, error: keyError } = await supabase
      .from('admin_keys')
      .select('*')
      .eq('key', 'admin_key_2024_long_expiry')
      .single();
    
    console.log('Key lookup result:', { keyData, keyError });

    // Now test the verify_admin_key function
    const { data: verifyResult, error: verifyError } = await supabase
      .rpc('verify_admin_key', { key_to_verify: 'admin_key_2024_long_expiry' });
    
    console.log('Verification result:', { verifyResult, verifyError });

    if (keyError || verifyError) {
      console.error('Error testing admin key:', keyError || verifyError);
      return;
    }
    
    console.log('Admin key verification complete');
  } catch (err) {
    console.error('Unexpected error:', err);
  }
}

testAdminKey(); 