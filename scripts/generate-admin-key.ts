import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Error: Missing Supabase credentials in environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function generateAdminKey() {
  try {
    console.log('Generating new admin key...');
    console.log('Using Supabase URL:', supabaseUrl);
    
    // Generate a random key
    const key = `admin_key_${Math.random().toString(36).substring(2, 15)}`;
    
    // Set expiration to 30 days from now
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30);

    const { data, error } = await supabase
      .from('admin_keys')
      .insert({
        key,
        expires_at: expiresAt.toISOString(),
        used: false
      })
      .select()
      .single();

    if (error) {
      console.error('Error generating admin key:', error);
      return;
    }
    
    console.log('New admin key generated successfully!');
    console.log('Key:', key);
    console.log('Expires at:', expiresAt.toLocaleDateString());
  } catch (err) {
    console.error('Unexpected error:', err);
  }
}

generateAdminKey();