import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    message: 'Payment API is working',
    timestamp: new Date().toISOString(),
    environment: {
      razorpay_key_id: process.env.RAZORPAY_KEY_ID ? 'configured' : 'missing',
      razorpay_key_secret: process.env.RAZORPAY_KEY_SECRET ? 'configured' : 'missing',
      public_razorpay_key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID ? 'configured' : 'missing'
    }
  });
}

export async function POST() {
  return NextResponse.json({
    message: 'POST method working',
    timestamp: new Date().toISOString()
  });
}
