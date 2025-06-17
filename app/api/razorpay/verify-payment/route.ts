import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import crypto from 'crypto';

export async function POST(request: Request) {
  console.log('Payment verification API called');
  
  try {
    const body = await request.json();
    console.log('Request body received:', Object.keys(body));
    
    const { 
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      user_id,
      cart_items,
      delivery_address,
      payment_method = 'online',
      subtotal,
      tax_amount,
      delivery_fee = 0,
      total_amount
    } = body;

    // Validate required fields
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      console.error('Missing payment details:', { razorpay_order_id, razorpay_payment_id, razorpay_signature });
      return NextResponse.json(
        { error: 'Missing payment details', success: false },
        { status: 400 }
      );
    }

    if (!user_id || !cart_items || cart_items.length === 0) {
      console.error('Missing user or cart data:', { user_id, cart_items_length: cart_items?.length });
      return NextResponse.json(
        { error: 'Missing user or cart data', success: false },
        { status: 400 }
      );
    }

    // Check environment variables
    if (!process.env.RAZORPAY_KEY_SECRET) {
      console.error('RAZORPAY_KEY_SECRET not configured');
      return NextResponse.json(
        { error: 'Payment configuration error', success: false },
        { status: 500 }
      );
    }

    // Verify payment signature
    console.log('Verifying payment signature...');
    const generatedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    if (generatedSignature !== razorpay_signature) {
      console.error('Payment signature verification failed');
      console.error('Generated:', generatedSignature);
      console.error('Received:', razorpay_signature);
      return NextResponse.json(
        { error: 'Payment verification failed', success: false },
        { status: 400 }
      );
    }

    console.log('Payment signature verified successfully');

    const supabase = await createClient();

    // Get cook_id from the first cart item (assuming all items are from same cook)
    const cook_id = cart_items[0]?.cook_id;
    if (!cook_id) {
      return NextResponse.json(
        { error: 'Invalid cart items - missing cook_id' },
        { status: 400 }
      );
    }

    // Create order in database
    console.log('Creating order with data:', {
      user_id,
      cook_id,
      total_amount,
      cart_items_count: cart_items.length
    });

    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        user_id,
        cook_id,
        status: 'pending', // Use valid status from orders.json
        total: total_amount.toString(),
        subtotal: subtotal.toString(),
        tax_amount: tax_amount.toString(),
        delivery_fee: delivery_fee.toString(),
        total_amount: total_amount.toString(),
        delivery_address,
        payment_method: 'online', // Use valid payment method from orders.json
        payment_id: razorpay_payment_id,
        payment_status: 'paid', // Payment verified successfully, so mark as paid
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (orderError) {
      console.error('Error creating order:', orderError);
      return NextResponse.json(
        { error: 'Failed to create order', details: orderError.message },
        { status: 500 }
      );
    }

    console.log('Order created successfully:', order.id);

    // Create order items
    const orderItems = cart_items.map((item: any) => ({
      order_id: order.id,
      menu_item_id: item.id,
      cook_id: item.cook_id,
      quantity: item.quantity,
      price: item.price,
      item_name: item.item_name || item.name,
      total_price: item.price * item.quantity
    }));

    console.log('Creating order items:', orderItems.length, 'items');

    const { error: orderItemsError } = await supabase
      .from('order_items')
      .insert(orderItems);

    if (orderItemsError) {
      console.error('Error creating order items:', orderItemsError);
      // Don't fail the entire request if order items fail, but log it
    } else {
      console.log('Order items created successfully');
    }

    console.log('Payment verification completed successfully', {
      order_id: order.id,
      payment_id: razorpay_payment_id
    });

    return NextResponse.json({
      success: true,
      order_id: order.id,
      payment_id: razorpay_payment_id
    });

  } catch (error: any) {
    console.error('Error verifying payment:', error);
    console.error('Error stack:', error.stack);
    
    return NextResponse.json(
      { 
        error: 'Payment verification failed',
        details: error.message,
        success: false
      },
      { 
        status: 500,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
  }
}
