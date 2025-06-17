"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { formatDistance } from "date-fns";

interface Payment {
  id: string;
  order_id: string;
  amount: number;
  payment_method: string;
  payment_status: string;
  razorpay_payment_id?: string;
  created_at: string;
  order: {
    id: string;
    total: number;
    status: string;
    user: {
      first_name: string;
      last_name: string;
      email: string;
    };
  };
}

export default function PaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          // First get the cook record
          const { data: cookData, error: cookError } = await supabase
            .from('cooks')
            .select('id')
            .eq('auth_user_id', session.user.id)
            .single();

          if (cookError) {
            console.error('Error fetching cook data:', cookError);
            setLoading(false);
            return;
          }

          if (!cookData) {
            console.error('Cook record not found');
            setLoading(false);
            return;
          }

          // Fetch payments for orders belonging to this cook
          const { data, error } = await supabase
            .from('orders')
            .select(`
              id,
              total,
              status,
              payment_status,
              payment_method,
              payment_id,
              created_at,
              user:users!user_id (
                first_name,
                last_name,
                email
              )
            `)
            .eq('cook_id', cookData.id)
            .eq('payment_status', 'paid')
            .order('created_at', { ascending: false });

          if (error) {
            console.error('Error fetching payments:', error);
          } else {
            // Transform the data to match our payment interface
            const transformedPayments = (data || []).map(order => ({
              id: `payment_${order.id}`,
              order_id: order.id,
              amount: order.total,
              payment_method: order.payment_method || 'razorpay',
              payment_status: order.payment_status,
              razorpay_payment_id: order.payment_id,
              created_at: order.created_at,
              order: {
                id: order.id,
                total: order.total,
                status: order.status,
                user: Array.isArray(order.user) ? order.user[0] : order.user
              }
            }));
            setPayments(transformedPayments);
          }
        }
      } catch (error) {
        console.error('Error in fetchPayments:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, []);

  if (loading) {
    return (
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">Payment History</h1>
        <p>Loading payments...</p>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Payment History</h1>
      <div className="space-y-4">
        {payments.length === 0 ? (
          <p className="text-gray-500">No payment history found</p>
        ) : (
          payments.map((payment) => (
            <div 
              key={payment.id} 
              className="border p-4 rounded-lg shadow-sm bg-white"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="font-medium">Order #{payment.order_id}</h3>
                  <p className="text-sm text-gray-500">
                    {formatDistance(new Date(payment.created_at), new Date(), { addSuffix: true })}
                  </p>
                  <p className="mt-2">Customer: {payment.order.user.first_name} {payment.order.user.last_name}</p>
                  <p>Email: {payment.order.user.email}</p>
                  <p className="font-medium text-green-600">Amount: ₹{payment.amount}</p>
                  {payment.razorpay_payment_id && (
                    <p className="text-xs text-gray-500">Payment ID: {payment.razorpay_payment_id}</p>
                  )}
                </div>
                <div className="text-right">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    payment.payment_status === 'paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {payment.payment_status}
                  </span>
                  <p className="text-sm text-gray-500 mt-1">via {payment.payment_method}</p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}