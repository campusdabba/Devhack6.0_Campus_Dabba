"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Payment {
  id: string;
  order_id: string;
  amount: number;
  status: string;
  payment_method: string;
  created_at: string;
  user: {
    first_name: string;
    last_name: string;
    email: string;
  };
}

export default function AdminPaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    async function fetchPayments() {
      try {
        const { data, error } = await supabase
          .from('payments')
          .select(`
            *,
            user:users (
              first_name,
              last_name,
              email
            )
          `)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setPayments(data || []);
      } catch (error) {
        console.error('Error fetching payments:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchPayments();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Payment History</h1>

      <Card>
        <CardHeader>
          <CardTitle>All Payments</CardTitle>
          <CardDescription>View and manage payment records</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Payment ID</TableHead>
                <TableHead>Order ID</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Method</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payments.map((payment) => (
                <TableRow key={payment.id}>
                  <TableCell>{payment.id}</TableCell>
                  <TableCell>{payment.order_id}</TableCell>
                  <TableCell>
                    {payment.user.first_name} {payment.user.last_name}
                    <br />
                    <span className="text-sm text-gray-500">{payment.user.email}</span>
                  </TableCell>
                  <TableCell>₹{payment.amount}</TableCell>
                  <TableCell className="capitalize">{payment.payment_method}</TableCell>
                  <TableCell className="capitalize">{payment.status}</TableCell>
                  <TableCell>{new Date(payment.created_at).toLocaleDateString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {payments.length === 0 && (
            <p className="text-center text-gray-500 py-4">No payments found</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 