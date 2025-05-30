import { NextResponse } from 'next/server';
import Razorpay from 'razorpay';

// Verify environment variables
const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID;
const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET;

if (!RAZORPAY_KEY_ID || !RAZORPAY_KEY_SECRET) {
  console.error('Missing Razorpay credentials:', {
    keyId: RAZORPAY_KEY_ID ? 'present' : 'missing',
    keySecret: RAZORPAY_KEY_SECRET ? 'present' : 'missing'
  });
  throw new Error('Razorpay credentials are not configured');
}

const razorpay = new Razorpay({
  key_id: RAZORPAY_KEY_ID,
  key_secret: RAZORPAY_KEY_SECRET,
});

export async function POST(request: Request) {
  try {
    const { amount } = await request.json();

    if (!amount || amount <= 0) {
      return NextResponse.json(
        { error: 'Invalid amount' },
        { status: 400 }
      );
    }

    const options = {
      amount: Math.round(amount * 100), // amount in smallest currency unit (paise for INR)
      currency: 'INR',
      receipt: `receipt_${Date.now()}`,
    };

    console.log('Creating Razorpay order with options:', options);

    const order = await razorpay.orders.create(options);
    console.log('Razorpay order created:', order);

    return NextResponse.json(order);
  } catch (error: any) {
    console.error('Error creating Razorpay order:', {
      error: error.message,
      stack: error.stack
    });
    
    return NextResponse.json(
      { 
        error: 'Error creating order',
        details: error.message 
      },
      { status: 500 }
    );
  }
} 