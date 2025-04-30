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

interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  phone: string;
  created_at: string;
}

interface Order {
  id: string;
  user_id: string;
  status: string;
  total_amount: number;
  created_at: string;
  items: {
    id: string;
    name: string;
    quantity: number;
    price: number;
  }[];
}

export default function UserProfilePage() {
  const { id } = useParams();
  const [user, setUser] = useState<User | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    async function fetchUserData() {
      try {
        // Fetch user details
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('*')
          .eq('id', id)
          .single();

        if (userError) throw userError;
        setUser(userData);

        // Fetch user's orders with order items
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
          .eq('user_id', id)
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

    fetchUserData();
  }, [id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <div>User not found</div>;
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">User Profile</h1>
        <Button
          variant="outline"
          onClick={() => router.push('/admin/users')}
        >
          Back to Users
        </Button>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>User Information</CardTitle>
            <CardDescription>Basic details about the user</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-500">Name</p>
                <p>{user.first_name} {user.last_name}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Email</p>
                <p>{user.email}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Phone</p>
                <p>{user.phone}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Member Since</p>
                <p>{new Date(user.created_at).toLocaleDateString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Order History</CardTitle>
            <CardDescription>All orders placed by this user</CardDescription>
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
                    <TableCell>₹{order.total_amount}</TableCell>
                    <TableCell>
                      <ul className="list-disc list-inside">
                        {order.items.map((item) => (
                          <li key={item.id}>
                            {item.name} (x{item.quantity}) - ₹{item.price}
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