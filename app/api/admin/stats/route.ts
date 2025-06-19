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

    // Fetch stats using regular client (RLS will allow admin access)
    const [usersResult, cooksResult, ordersResult, paymentsResult] = await Promise.all([
      supabase.from('users').select('*', { count: 'exact', head: true }),
      supabase.from('cooks').select('*', { count: 'exact', head: true }),
      supabase.from('orders').select('*', { count: 'exact', head: true }),
      supabase.from('payments').select('*', { count: 'exact', head: true })
    ])
    
    const stats = {
      users: usersResult.count || 0,
      cooks: cooksResult.count || 0,
      orders: ordersResult.count || 0,
      payments: paymentsResult.count || 0
    }
    
    return NextResponse.json(stats)
  } catch (error) {
    console.error('Error in admin stats API:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
