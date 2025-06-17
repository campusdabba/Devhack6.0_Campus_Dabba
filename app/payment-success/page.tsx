"use client";

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { CheckCircle2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function PaymentSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [countdown, setCountdown] = useState(5);
  
  const orderId = searchParams.get('order_id');
  const paymentId = searchParams.get('payment_id');

  useEffect(() => {
    // Countdown timer
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          router.push('/orders');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md">
        <CardContent className="pt-6">
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="animate-bounce">
              <CheckCircle2 className="w-16 h-16 text-green-500" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">
              Payment Successful!
            </h1>
            <p className="text-gray-500">
              Thank you for your order. Your payment has been processed successfully.
            </p>
            
            {orderId && (
              <div className="bg-gray-100 p-3 rounded-lg w-full">
                <p className="text-sm text-gray-600">Order ID:</p>
                <p className="font-mono text-sm font-semibold">{orderId}</p>
              </div>
            )}
            
            {paymentId && (
              <div className="bg-gray-100 p-3 rounded-lg w-full">
                <p className="text-sm text-gray-600">Payment ID:</p>
                <p className="font-mono text-sm font-semibold">{paymentId}</p>
              </div>
            )}
            
            <div className="space-y-2">
              <p className="text-sm text-gray-400">
                Redirecting to your orders in {countdown} seconds...
              </p>
              <div className="flex gap-2">
                <Button 
                  onClick={() => router.push('/orders')}
                  size="sm"
                >
                  View Orders
                </Button>
                <Button 
                  onClick={() => router.push('/')}
                  variant="outline"
                  size="sm"
                >
                  Continue Shopping
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 