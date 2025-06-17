"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { useToast } from "@/components/ui/use-toast";
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
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

interface Order {
  id: string;
  status: string;
  total: number;
  payment_status: string;
  payment_method: string;
  payment_id: string;
  created_at: string;
  cook: {
    id: string;
    first_name: string;
    last_name: string;
  };
  order_items: {
    id: string;
    quantity: number;
    price_at_time: number;
    dabba_menu: {
      id: string;
      name: string;
      price: number;
    };
  }[];
}

export default function UserOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    async function fetchOrders() {
      try {
        // Get current user
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError) throw userError;
        if (!user) throw new Error("User not authenticated");

        // Fetch user's orders
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
            cook:cook_id (
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
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setOrders(data || []);
      } catch (error: any) {
        console.error('Error fetching orders:', error);
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    }

    fetchOrders();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">My Orders</h1>
        <Button onClick={() => router.push('/order')}>
          Place New Order
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Order History</CardTitle>
          <CardDescription>View your past and current orders</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Cook</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Payment</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell>{order.id}</TableCell>
                  <TableCell>
                    {order.cook.first_name} {order.cook.last_name}
                  </TableCell>
                  <TableCell>
                    <ul className="list-disc list-inside">
                      {order.order_items.map((item) => (
                        <li key={item.id}>
                          {item.dabba_menu.name} (x{item.quantity}) - ₹{item.price_at_time}
                        </li>
                      ))}
                    </ul>
                  </TableCell>
                  <TableCell>₹{order.total}</TableCell>
                  <TableCell className="capitalize">{order.status}</TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className={`capitalize ${order.payment_status === 'paid' ? 'text-green-600' : 'text-yellow-600'}`}>
                        {order.payment_status}
                      </span>
                      <span className="text-sm text-gray-500">
                        {order.payment_method}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>{new Date(order.created_at).toLocaleDateString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {orders.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500">No orders found</p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => router.push('/order')}
              >
                Place Your First Order
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

