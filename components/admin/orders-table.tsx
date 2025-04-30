"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Alert, AlertDescription } from "@/components/ui/alert";

export function OrdersTable() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();

  useEffect(() => {
    async function fetchOrders() {
      try {
        const { data, error } = await supabase
          .from('orders')
          .select(`
            id,
            user_id,
            cook_id,
            status,
            total,
            created_at,
            users:user_id (email),
            cooks:cook_id (name)
          `)
          .order('created_at', { ascending: false });
        
        if (error) {
          if (error.code === '42P01') {
            setError('Orders table does not exist. Please create the table in Supabase.');
          } else {
            setError(`Error fetching orders: ${error.message}`);
          }
          return;
        }
        
        setOrders(data || []);
      } catch (error: any) {
        setError(`Error fetching orders: ${error.message}`);
      } finally {
        setLoading(false);
      }
    }

    fetchOrders();
  }, []);

  if (loading) {
    return <div>Loading orders...</div>;
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  if (orders.length === 0) {
    return <div>No orders found.</div>;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Order ID</TableHead>
          <TableHead>User</TableHead>
          <TableHead>Cook</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Total</TableHead>
          <TableHead>Created At</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {orders.map((order) => (
          <TableRow key={order.id}>
            <TableCell>{order.id}</TableCell>
            <TableCell>{order.users?.email || 'Unknown'}</TableCell>
            <TableCell>{order.cooks?.name || 'Unknown'}</TableCell>
            <TableCell>{order.status}</TableCell>
            <TableCell>₹{order.total}</TableCell>
            <TableCell>{new Date(order.created_at).toLocaleDateString()}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
} 