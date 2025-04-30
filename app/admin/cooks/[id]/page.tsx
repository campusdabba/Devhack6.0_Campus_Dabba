"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
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

interface Cook {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  phone: string;
  status: string;
  created_at: string;
}

interface Order {
  id: string;
  status: string;
  total: number;
  created_at: string;
  order_items: {
    id: string;
    quantity: number;
    price_at_time: number;
    menu: {
      id: string;
      name: string;
      price: number;
    };
  }[];
}

export default function CookProfilePage() {
  const { id } = useParams();
  const [cook, setCook] = useState<Cook | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    async function fetchCookData() {
      try {
        // Fetch cook details
        const { data: cookData, error: cookError } = await supabase
          .from('cooks')
          .select('*')
          .eq('id', id)
          .single();

        if (cookError) throw cookError;
        setCook(cookData);

        // Fetch cook's orders
        const { data: ordersData, error: ordersError } = await supabase
          .from('orders')
          .select(`
            id,
            status,
            total_amount,
            created_at,
            order_items (
              id,
              quantity,
              price,
              menu_id
            )
          `)
          .eq('cook_id', id)
          .order('created_at', { ascending: false });

        if (ordersError) throw ordersError;
        setOrders(ordersData || []);
      } catch (error: any) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    }

    fetchCookData();
  }, [id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!cook) {
    return <div>Cook not found</div>;
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Cook Profile</h1>
        <Button
          variant="outline"
          onClick={() => router.push('/admin/cooks')}
        >
          Back to Cooks
        </Button>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Cook Information</CardTitle>
            <CardDescription>Basic details about the cook</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-500">Name</p>
                <p>{cook.first_name} {cook.last_name}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Email</p>
                <p>{cook.email}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Phone</p>
                <p>{cook.phone}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Status</p>
                <p className="capitalize">{cook.status}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Member Since</p>
                <p>{new Date(cook.created_at).toLocaleDateString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Order History</CardTitle>
            <CardDescription>All orders handled by this cook</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Items</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell>{order.id}</TableCell>
                    <TableCell>{new Date(order.created_at).toLocaleDateString()}</TableCell>
                    <TableCell>{order.status}</TableCell>
                    <TableCell>₹{order.total}</TableCell>
                    <TableCell>
                      <ul className="list-disc list-inside">
                        {order.order_items.map((item) => (
                          <li key={item.id}>
                            {item.menu.name} (x{item.quantity}) - ₹{item.price_at_time}
                          </li>
                        ))}
                      </ul>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {orders.length === 0 && (
              <p className="text-center text-gray-500 py-4">No orders found</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 