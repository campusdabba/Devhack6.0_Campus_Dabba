import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    // Get current user
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if user is admin using RPC
    const { data: isAdmin, error: adminError } = await supabase
      .rpc('is_admin', { input_user_id: user.id })
    
    if (adminError) {
      console.error('Error checking admin status:', adminError)
      return NextResponse.json({ error: 'Error verifying admin status' }, { status: 403 })
    }
    
    if (!isAdmin) {
      return NextResponse.json({ error: 'Forbidden: Admin access required' }, { status: 403 })
    }

    // Get query parameters
    const { searchParams } = new URL(request.url)
    const role = searchParams.get('role')
    const exclude = searchParams.get('exclude')

    // Fetch users using regular client (RLS will allow admin access)
    let query = supabase.from('users').select('*')
    
    if (exclude === 'cook') {
      // Exclude users with cook role
      query = query.not('role', 'eq', 'cook')
        .not('role', 'cs', '{cook}')
    } else if (role && role !== 'all') {
      // Handle role filtering
      query = query.or(`role.eq.${role},role.cs.{${role}}`)
    }
    
    const { data, error } = await query.order('created_at', { ascending: false })
    
    if (error) {
      console.error('Error fetching users:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    
    return NextResponse.json({ users: data || [] })
  } catch (error) {
    console.error('Error in admin users API:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
