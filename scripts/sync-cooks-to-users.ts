import { createClient } from '@supabase/supabase-js'

// This script syncs all cooks from the cooks table to the users table
// to ensure consistency between the two tables

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function syncCooksToUsers() {
  try {
    console.log('Starting sync of cooks to users table...')
    
    // Fetch all cooks
    const { data: cooks, error: cooksError } = await supabase
      .from('cooks')
      .select('*')
    
    if (cooksError) {
      console.error('Error fetching cooks:', cooksError)
      return
    }
    
    console.log(`Found ${cooks.length} cooks`)
    
    // Check which cooks are already in users table
    const { data: existingUsers, error: usersError } = await supabase
      .from('users')
      .select('id')
      .in('id', cooks.map(cook => cook.cook_id || cook.id))
    
    if (usersError) {
      console.error('Error fetching existing users:', usersError)
      return
    }
    
    const existingUserIds = new Set(existingUsers.map(user => user.id))
    const cooksToSync = cooks.filter(cook => !existingUserIds.has(cook.cook_id || cook.id))
    
    console.log(`Found ${cooksToSync.length} cooks that need to be synced to users table`)
    
    if (cooksToSync.length === 0) {
      console.log('All cooks are already synced to users table')
      return
    }
    
    // Create user entries for cooks
    const usersToInsert = cooksToSync.map(cook => ({
      id: cook.cook_id || cook.id,
      email: cook.email,
      first_name: cook.first_name,
      last_name: cook.last_name,
      phone: cook.phone,
      profile_image: cook.profile_image,
      address: cook.address || (cook.city ? {
        street: '',
        city: cook.city,
        state: cook.state,
        pincode: cook.pincode
      } : null),
      favourites: [],
      user_preferences: {
        theme: 'light',
        notifications: true
      },
      role: 'cook',
      created_at: cook.created_at,
      updated_at: new Date().toISOString()
    }))
    
    // Insert users
    const { error: insertError } = await supabase
      .from('users')
      .insert(usersToInsert)
    
    if (insertError) {
      console.error('Error inserting users:', insertError)
      return
    }
    
    console.log(`Successfully synced ${usersToInsert.length} cooks to users table`)
    
  } catch (error) {
    console.error('Unexpected error:', error)
  }
}

// Run the sync
syncCooksToUsers()
