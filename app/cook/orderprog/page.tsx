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
    <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100">Order Management</h1>
      
      {/* Filter Buttons */}
      <div className="flex gap-4 mb-6">
        <button 
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded transition-colors ${
            filter === 'all' 
              ? 'bg-blue-500 text-white dark:bg-blue-600' 
              : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
          }`}
        >
          All Orders
        </button>
        <button 
          onClick={() => setFilter('active')}
          className={`px-4 py-2 rounded transition-colors ${
            filter === 'active' 
              ? 'bg-blue-500 text-white dark:bg-blue-600' 
              : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
          }`}
        >
          Active Orders
        </button>
        <button 
          onClick={() => setFilter('completed')}
          className={`px-4 py-2 rounded transition-colors ${
            filter === 'completed' 
              ? 'bg-blue-500 text-white dark:bg-blue-600' 
              : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
          }`}
        >
          Completed Orders
        </button>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {orders
          .filter(order => {
            if (filter === 'active') return order.status !== 'delivered';
            if (filter === 'completed') return order.status === 'delivered';
            return true;
          })
          .length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 dark:text-gray-400">No orders found for the selected filter.</p>
            </div>
          ) : (
            orders
              .filter(order => {
                if (filter === 'active') return order.status !== 'delivered';
                if (filter === 'completed') return order.status === 'delivered';
                return true;
              })
              .map(order => (
                <div key={order.id} className="border border-gray-200 dark:border-gray-700 p-6 rounded-lg shadow-sm bg-white dark:bg-gray-800 transition-colors">
                  <div className="flex justify-between items-start gap-6">
                    <div className="flex-1">
                      {/* Order Header */}
                      <div className="flex items-center gap-3 mb-3">
                        <h3 className="font-semibold text-lg text-gray-900 dark:text-gray-100">
                          Order #{order.id.slice(-8)}
                        </h3>
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                          order.payment_status === 'paid' 
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                            : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                        }`}>
                          Payment: {order.payment_status}
                        </span>
                      </div>
                      
                      {/* Order Time */}
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                        {formatDistance(new Date(order.created_at), new Date(), { addSuffix: true })}
                      </p>
                      
                      {/* Customer Info */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <p className="text-gray-900 dark:text-gray-100">
                            <span className="font-medium">Customer:</span> {order.user.first_name} {order.user.last_name}
                          </p>
                          <p className="text-gray-600 dark:text-gray-300">
                            <span className="font-medium">Email:</span> {order.user.email}
                          </p>
                        </div>
                        <div>
                          <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                            Total: ₹{order.total}
                          </p>
                        </div>
                      </div>
                      
                      {/* Order Items */}
                      <div className="mt-4">
                        <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">Items Ordered:</h4>
                        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                          <ul className="space-y-1">
                            {order.order_items.map((item) => (
                              <li key={item.id} className="flex justify-between items-center text-sm">
                                <span className="text-gray-700 dark:text-gray-300">
                                  {item.dabba_menu.name} × {item.quantity}
                                </span>
                                <span className="font-medium text-gray-900 dark:text-gray-100">
                                  ₹{item.price_at_time}
                                </span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                    
                    {/* Order Status Management */}
                    <div className="flex flex-col gap-3 min-w-[180px]">
                      {/* Status Dropdown */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Update Status:
                        </label>
                        <select 
                          value={order.status}
                          onChange={(e) => updateOrderStatus(order.id, e.target.value as Order['status'])}
                          className="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-colors"
                        >
                          <option value="pending">Pending</option>
                          <option value="preparing">Preparing</option>
                          <option value="ready">Ready</option>
                          <option value="delivered">Delivered</option>
                        </select>
                      </div>
                      
                      {/* Current Status Badge */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Current Status:
                        </label>
                        <span className={`inline-flex items-center px-3 py-2 rounded-lg text-sm font-medium w-full justify-center ${
                          order.status === 'delivered' 
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                          order.status === 'ready' 
                            ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
                          order.status === 'preparing' 
                            ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                            'bg-gray-100 text-gray-800 dark:bg-gray-600 dark:text-gray-200'
                        }`}>
                          {order.status === 'delivered' && '✅ '}
                          {order.status === 'ready' && '🍽️ '}
                          {order.status === 'preparing' && '👨‍🍳 '}
                          {order.status === 'pending' && '⏳ '}
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </span>
                      </div>
                      
                      {/* Quick Action Buttons */}
                      <div className="flex flex-col gap-2 pt-2">
                        {order.status === 'pending' && (
                          <button
                            onClick={() => updateOrderStatus(order.id, 'preparing')}
                            className="px-3 py-2 bg-yellow-500 hover:bg-yellow-600 dark:bg-yellow-600 dark:hover:bg-yellow-700 text-white text-sm rounded-lg transition-colors"
                          >
                            Start Preparing
                          </button>
                        )}
                        {order.status === 'preparing' && (
                          <button
                            onClick={() => updateOrderStatus(order.id, 'ready')}
                            className="px-3 py-2 bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white text-sm rounded-lg transition-colors"
                          >
                            Mark Ready
                          </button>
                        )}
                        {order.status === 'ready' && (
                          <button
                            onClick={() => updateOrderStatus(order.id, 'delivered')}
                            className="px-3 py-2 bg-green-500 hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700 text-white text-sm rounded-lg transition-colors"
                          >
                            Mark Delivered
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
          )}
      </div>
    </div>
  );
}