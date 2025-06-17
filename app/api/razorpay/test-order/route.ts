import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function POST(request: Request) {
  console.log('Test order creation API called');
  
  try {
    const body = await request.json();
    console.log('Test request body:', body);
    
    const { 
      user_id,
      cart_items,
      delivery_address,
      payment_method = 'online',
      subtotal,
      tax_amount,
      delivery_fee = 0,
      total_amount
    } = body;

    // Basic validation
    if (!user_id || !cart_items || cart_items.length === 0) {
      return NextResponse.json(
        { error: 'Missing user or cart data', success: false },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Get cook_id from the first cart item
    const cook_id = cart_items[0]?.cook_id;
    if (!cook_id) {
      return NextResponse.json(
        { error: 'Invalid cart items - missing cook_id', success: false },
        { status: 400 }
      );
    }

    console.log('Creating test order...');

    // Create order in database
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        user_id,
        cook_id,
        status: 'confirmed',
        total: total_amount.toString(),
        subtotal: subtotal.toString(),
        tax_amount: tax_amount.toString(),
        delivery_fee: delivery_fee.toString(),
        total_amount: total_amount.toString(),
        delivery_address,
        payment_method: 'online', // Use valid payment method instead of 'test'
        payment_id: 'test_payment_' + Date.now(),
        payment_status: 'paid', // Use valid payment status: 'pending', 'paid', 'failed', 'refunded'
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (orderError) {
      console.error('Error creating test order:', orderError);
      return NextResponse.json(
        { error: 'Failed to create order', details: orderError.message, success: false },
        { status: 500 }
      );
    }

    console.log('Test order created successfully:', order.id);

    return NextResponse.json({
      success: true,
      order_id: order.id,
      payment_id: 'test_payment_' + Date.now(),
      message: 'Test order created successfully'
    });

  } catch (error: any) {
    console.error('Error in test order creation:', error);
    return NextResponse.json(
      { 
        error: 'Test order creation failed',
        details: error.message,
        success: false
      },
      { status: 500 }
    );
  }
}
