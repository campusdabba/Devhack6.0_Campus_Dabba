"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { formatDistance } from "date-fns";

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

export default function OrderHandlerPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('active');
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
            return;
          }

          if (!cookData) {
            console.error('Cook record not found for user:', session.user.id);
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
            return;
          }
          
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
      } catch (error) {
        console.error('Error in fetchOrders:', error);
      }
    };

    fetchOrders();

    // Set up real-time subscription
    const channel = supabase
      .channel('orders')
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

  const updateOrderStatus = async (orderId: string, newStatus: Order['status']) => {
    const { error } = await supabase
      .from('orders')
      .update({ status: newStatus })
      .eq('id', orderId);

    if (!error) {
      setOrders(orders.map(order => 
        order.id === orderId ? { ...order, status: newStatus } : order
      ));
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Order Management</h1>
      
      <div className="flex gap-4 mb-6">
        <button 
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded ${filter === 'all' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
        >
          All Orders
        </button>
        <button 
          onClick={() => setFilter('active')}
          className={`px-4 py-2 rounded ${filter === 'active' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
        >
          Active Orders
        </button>
        <button 
          onClick={() => setFilter('completed')}
          className={`px-4 py-2 rounded ${filter === 'completed' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
        >
          Completed Orders
        </button>
      </div>

      <div className="space-y-4">
        {orders
          .filter(order => {
            if (filter === 'active') return order.status !== 'delivered';
            if (filter === 'completed') return order.status === 'delivered';
            return true;
          })
          .map(order => (
            <div key={order.id} className="border p-4 rounded-lg shadow-sm">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="font-medium">Order #{order.id}</h3>
                  <p className="text-sm text-gray-500">
                    {formatDistance(new Date(order.created_at), new Date(), { addSuffix: true })}
                  </p>
                  <p className="mt-2">Customer: {order.user.first_name} {order.user.last_name}</p>
                  <p>Email: {order.user.email}</p>
                  <p>Total: ₹{order.total}</p>
                  <div className="mt-2">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      order.payment_status === 'paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      Payment: {order.payment_status}
                    </span>
                  </div>
                  <div className="mt-2">
                    <h4 className="font-medium">Items:</h4>
                    <ul className="list-disc list-inside">
                      {order.order_items.map((item) => (
                        <li key={item.id}>
                          {item.dabba_menu.name} (x{item.quantity}) - ₹{item.price_at_time}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                
                <div className="flex flex-col gap-2">
                  <select 
                    value={order.status}
                    onChange={(e) => updateOrderStatus(order.id, e.target.value as Order['status'])}
                    className="border rounded p-2"
                  >
                    <option value="pending">Pending</option>
                    <option value="preparing">Preparing</option>
                    <option value="ready">Ready</option>
                    <option value="delivered">Delivered</option>
                  </select>
                  
                  <span className={`px-2 py-1 rounded text-sm ${
                    order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                    order.status === 'preparing' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </span>
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}