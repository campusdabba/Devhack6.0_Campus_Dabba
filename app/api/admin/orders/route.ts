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

    // Fetch orders with related data
    const { data, error } = await supabase
      .from('orders')
      .select(`
        id,
        status,
        total,
        payment_status,
        payment_method,
        payment_id,
        created_at,
        user:users!user_id (
          id,
          first_name,
          last_name,
          email
        ),
        cook:cooks!cook_id (
          id,
          first_name,
          last_name
        ),
        order_items (
          id,
          quantity,
          price_at_time,
          dabba_menu:menu_id (
            id,
            name,
            price
          )
        )
      `)
      .order('created_at', { ascending: false })
    
    if (error) {
      console.error('Error fetching orders:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    
    return NextResponse.json({ orders: data || [] })
  } catch (error) {
    console.error('Error in admin orders API:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
