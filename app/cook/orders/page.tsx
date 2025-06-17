"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { formatDistance } from "date-fns";
import Link from "next/link";

interface Order {
  id: string;
  status: string;
  total: number;
  payment_status: string;
  payment_method: string;
  payment_id: string;
  created_at: string;
  user: {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
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

export default function CookOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filter, setFilter] = useState<'all' | 'pending' | 'paid'>('all');
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          // First get the cook record for the authenticated user
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
            console.error('Cook record not found for user:', session.user.id);
            setLoading(false);
            return;
          }

          // Now fetch orders using the cook ID
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
              user_id,
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
            .eq('cook_id', cookData.id)
            .order('created_at', { ascending: false });
            
          if (error) {
            console.error('Error fetching orders:', error);
          } else {
            // Try to fetch user details, but fallback to basic info if it fails
            const ordersWithUsers = await Promise.all(
              (data || []).map(async (order) => {
                try {
                  const { data: userData, error: userError } = await supabase
                    .from('users')
                    .select('id, first_name, last_name, email')
                    .eq('id', order.user_id)
                    .single();
                  
                  if (userError) throw userError;
                  
                  return {
                    ...order,
                    user: userData || { 
                      id: order.user_id, 
                      first_name: 'Customer', 
                      last_name: `${order.user_id.slice(-4)}`, 
                      email: `customer-${order.user_id.slice(-4)}@example.com` 
                    },
                    order_items: order.order_items.map(item => ({
                      ...item,
                      dabba_menu: Array.isArray(item.dabba_menu) ? item.dabba_menu[0] : item.dabba_menu
                    }))
                  };
                } catch (error) {
                  // Fallback to basic user info if user fetch fails
                  return {
                    ...order,
                    user: { 
                      id: order.user_id, 
                      first_name: 'Customer', 
                      last_name: `${order.user_id.slice(-4)}`, 
                      email: `customer-${order.user_id.slice(-4)}@example.com` 
                    },
                    order_items: order.order_items.map(item => ({
                      ...item,
                      dabba_menu: Array.isArray(item.dabba_menu) ? item.dabba_menu[0] : item.dabba_menu
                    }))
                  };
                }
              })
            );
            
            setOrders(ordersWithUsers as Order[]);
          }
        } else {
          console.log('No session found');
        }
      } catch (error) {
        console.error('Error in fetchOrders:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();

    // Set up real-time subscription
    const channel = supabase
      .channel('cook_orders')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'orders' },
        payload => {
          fetchOrders();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const filteredOrders = orders.filter(order => {
    if (filter === 'pending') return order.payment_status !== 'paid';
    if (filter === 'paid') return order.payment_status === 'paid';
    return true;
  });

  const totalEarnings = orders
    .filter(order => order.payment_status === 'paid')
    .reduce((sum, order) => sum + order.total, 0);

  const pendingOrders = orders.filter(order => order.payment_status !== 'paid').length;
  const completedOrders = orders.filter(order => order.payment_status === 'paid').length;

  if (loading) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Orders Overview</h1>
        <p>Loading orders...</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Orders Overview</h1>
        <Link 
          href="/cook/orderprog"
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
        >
          Manage Orders
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <h3 className="text-lg font-medium text-gray-900">Total Earnings</h3>
          <p className="text-2xl font-bold text-green-600">₹{totalEarnings}</p>
          <p className="text-sm text-gray-500">{completedOrders} paid orders</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <h3 className="text-lg font-medium text-gray-900">Pending Orders</h3>
          <p className="text-2xl font-bold text-yellow-600">{pendingOrders}</p>
          <p className="text-sm text-gray-500">Awaiting payment</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <h3 className="text-lg font-medium text-gray-900">Total Orders</h3>
          <p className="text-2xl font-bold text-blue-600">{orders.length}</p>
          <p className="text-sm text-gray-500">All time</p>
        </div>
      </div>

      {/* Filter Buttons */}
      <div className="flex gap-4 mb-6">
        <button 
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded ${filter === 'all' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
        >
          All Orders ({orders.length})
        </button>
        <button 
          onClick={() => setFilter('pending')}
          className={`px-4 py-2 rounded ${filter === 'pending' ? 'bg-yellow-500 text-white' : 'bg-gray-200'}`}
        >
          Pending ({pendingOrders})
        </button>
        <button 
          onClick={() => setFilter('paid')}
          className={`px-4 py-2 rounded ${filter === 'paid' ? 'bg-green-500 text-white' : 'bg-gray-200'}`}
        >
          Paid ({completedOrders})
        </button>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {filteredOrders.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">No orders found for the selected filter.</p>
          </div>
        ) : (
          filteredOrders.map(order => (
            <div key={order.id} className="border p-4 rounded-lg shadow-sm bg-white">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-medium">Order #{order.id}</h3>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      order.payment_status === 'paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {order.payment_status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500">
                    {formatDistance(new Date(order.created_at), new Date(), { addSuffix: true })}
                  </p>
                  <p className="mt-2">Customer: {order.user.first_name} {order.user.last_name}</p>
                  <p>Email: {order.user.email}</p>
                  <p className="font-medium">Total: ₹{order.total}</p>
                  
                  <div className="mt-2">
                    <h4 className="font-medium">Items:</h4>
                    <ul className="list-disc list-inside text-sm">
                      {order.order_items.map((item) => (
                        <li key={item.id}>
                          {item.dabba_menu.name} (x{item.quantity}) - ₹{item.price_at_time}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                
                <div className="text-right">
                  <span className={`px-3 py-1 rounded text-sm ${
                    order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                    order.status === 'preparing' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </span>
                  {order.payment_id && (
                    <p className="text-xs text-gray-500 mt-1">
                      Payment ID: {order.payment_id}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
