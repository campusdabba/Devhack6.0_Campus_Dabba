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

    // Fetch cooks using regular client (should work if cooks table has proper RLS)
    const { data, error } = await supabase
      .from('cooks')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) {
      console.error('Error fetching cooks:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    
    return NextResponse.json({ cooks: data || [] })
  } catch (error) {
    console.error('Error in admin cooks API:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
