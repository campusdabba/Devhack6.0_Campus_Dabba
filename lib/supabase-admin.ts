import { createClient } from '@supabase/supabase-js'

// Service role client for admin operations (bypasses RLS)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl) {
  throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL environment variable')
}

if (!supabaseServiceKey) {
  console.warn('Missing SUPABASE_SERVICE_ROLE_KEY - admin operations will be limited')
}

export const supabaseAdmin = supabaseServiceKey ? createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
}) : null

// Helper function to check if current user is admin
export async function isCurrentUserAdmin(userId: string) {
  if (!supabaseAdmin) {
    console.error('Service role key not configured - cannot check admin status')
    return false
  }

  try {
    // First try using the RPC function
    const { data, error } = await supabaseAdmin.rpc('is_admin', { 
      input_user_id: userId 
    })
    
    if (error) {
      console.error('Error calling is_admin RPC:', error)
      // Fallback to direct query
      const { data: userData, error: userError } = await supabaseAdmin
        .from('users')
        .select('role')
        .eq('id', userId)
        .single()
      
      if (userError) {
        console.error('Error checking admin status:', userError)
        return false
      }
      
      // Handle both string and array roles
      const role = userData?.role
      if (Array.isArray(role)) {
        return role.includes('admin')
      }
      return role === 'admin'
    }
    
    return Boolean(data)
  } catch (error) {
    console.error('Error checking admin status:', error)
    return false
  }
}

// Admin functions using service client
export const adminQueries = {
  // Get all users
  async getAllUsers() {
    if (!supabaseAdmin) {
      return { data: null, error: { message: 'Service role key not configured' } }
    }
    
    const { data, error } = await supabaseAdmin
      .from('users')
      .select('*')
      .order('created_at', { ascending: false })
    
    return { data, error }
  },
  
  // Get users by role
  async getUsersByRole(role: string) {
    if (!supabaseAdmin) {
      return { data: null, error: { message: 'Service role key not configured' } }
    }
    
    const { data, error } = await supabaseAdmin
      .from('users')
      .select('*')
      .or(`role.eq.${role},role.cs.{${role}}`)
      .order('created_at', { ascending: false })
    
    return { data, error }
  },
  
  // Get users excluding a specific role
  async getUsersExcludingRole(role: string) {
    if (!supabaseAdmin) {
      return { data: null, error: { message: 'Service role key not configured' } }
    }
    
    const { data, error } = await supabaseAdmin
      .from('users')
      .select('*')
      .not('role', 'eq', role)
      .not('role', 'cs', `{${role}}`)
      .order('created_at', { ascending: false })
    
    return { data, error }
  },
  
  // Get all cooks
  async getAllCooks() {
    if (!supabaseAdmin) {
      return { data: null, error: { message: 'Service role key not configured' } }
    }
    
    const { data, error } = await supabaseAdmin
      .from('cooks')
      .select('*')
      .order('created_at', { ascending: false })
    
    return { data, error }
  },
  
  // Get user counts
  async getUserCounts() {
    if (!supabaseAdmin) {
      return { users: 0, cooks: 0, orders: 0, payments: 0 }
    }
    
    const [usersResult, allCooks, orders, payments] = await Promise.all([
      // Count users excluding cooks
      supabaseAdmin.from('users').select('*', { count: 'exact', head: true })
        .not('role', 'eq', 'cook')
        .not('role', 'cs', '{cook}'),
      supabaseAdmin.from('cooks').select('*', { count: 'exact', head: true }),
      supabaseAdmin.from('orders').select('*', { count: 'exact', head: true }),
      supabaseAdmin.from('payments').select('*', { count: 'exact', head: true })
    ])
    
    return {
      users: usersResult.count || 0,
      cooks: allCooks.count || 0,
      orders: orders.count || 0,
      payments: payments.count || 0
    }
  },
  
  // Update user
  async updateUser(userId: string, updates: any) {
    if (!supabaseAdmin) {
      return { data: null, error: { message: 'Service role key not configured' } }
    }
    
    const { data, error } = await supabaseAdmin
      .from('users')
      .update(updates)
      .eq('id', userId)
      .select()
      .single()
    
    return { data, error }
  },
  
  // Delete user
  async deleteUser(userId: string) {
    if (!supabaseAdmin) {
      return { error: { message: 'Service role key not configured' } }
    }
    
    const { error } = await supabaseAdmin
      .from('users')
      .delete()
      .eq('id', userId)
    
    return { error }
  }
}
