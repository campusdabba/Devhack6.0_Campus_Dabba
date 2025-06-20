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
    let mounted = true;
    let initialLoadComplete = false;

    const fetchOrders = async (forceRefresh = false) => {
      // Only fetch if mounted, and either it's initial load or force refresh
      if (!mounted || (!initialLoadComplete && !forceRefresh && document.hidden)) return;
      
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user && mounted) {
          // First get the cook record for the authenticated user
          const { data: cookData, error: cookError } = await supabase
            .from('cooks')
            .select('id')
            .eq('auth_user_id', session.user.id)
            .single();

          if (cookError) {
            console.error('Error fetching cook data:', cookError);
            if (mounted) setLoading(false);
            return;
          }

          if (!cookData) {
            console.error('Cook record not found for user:', session.user.id);
            if (mounted) setLoading(false);
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
          } else if (mounted) {
            // Try to fetch user details, but fallback to basic info if it fails
            const ordersWithUsers = await Promise.all(
              (data || []).map(async (order) => {
                if (!mounted) return null;
                
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
            
            const validOrders = ordersWithUsers.filter(order => order !== null);
            if (mounted) {
              setOrders(validOrders as Order[]);
              initialLoadComplete = true;
            }
          }
        } else if (mounted) {
          console.log('No session found');
          initialLoadComplete = true;
        }
      } catch (error) {
        console.error('Error in fetchOrders:', error);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    // Initial fetch
    fetchOrders();

    // Set up real-time subscription but be very conservative about when to refetch
    const channel = supabase
      .channel('cook_orders')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'orders' },
        payload => {
          // Only refetch if component is mounted, page is visible, and initial load is complete
          if (mounted && !document.hidden && initialLoadComplete) {
            // Debounce the refetch to prevent rapid successive calls
            setTimeout(() => {
              if (mounted && !document.hidden) {
                fetchOrders(true);
              }
            }, 1000);
          }
        }
      )
      .subscribe();

    // Listen for page visibility changes to prevent fetching when page is hidden
    const handleVisibilityChange = () => {
      // Don't do anything on visibility change to prevent window switching refreshes
      // The real-time subscription will handle updates when the page becomes visible
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Cleanup function
    return () => {
      mounted = false;
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      supabase.removeChannel(channel);
    };
  }, []); // Empty dependency array to prevent any re-runs

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
        <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100">Orders Overview</h1>
        <p className="text-gray-600 dark:text-gray-400">Loading orders...</p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Orders Overview</h1>
        <Link 
          href="/cook/orderprog"
          className="bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          Manage Orders
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Total Earnings</h3>
          <p className="text-2xl font-bold text-green-600 dark:text-green-400">₹{totalEarnings}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">{completedOrders} paid orders</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Pending Orders</h3>
          <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{pendingOrders}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">Awaiting payment</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Total Orders</h3>
          <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{orders.length}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">All time</p>
        </div>
      </div>

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
          All Orders ({orders.length})
        </button>
        <button 
          onClick={() => setFilter('pending')}
          className={`px-4 py-2 rounded transition-colors ${
            filter === 'pending' 
              ? 'bg-yellow-500 text-white dark:bg-yellow-600' 
              : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
          }`}
        >
          Pending ({pendingOrders})
        </button>
        <button 
          onClick={() => setFilter('paid')}
          className={`px-4 py-2 rounded transition-colors ${
            filter === 'paid' 
              ? 'bg-green-500 text-white dark:bg-green-600' 
              : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
          }`}
        >
          Paid ({completedOrders})
        </button>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {filteredOrders.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500 dark:text-gray-400">No orders found for the selected filter.</p>
          </div>
        ) : (
          filteredOrders.map(order => (
            <div key={order.id} className="border border-gray-200 dark:border-gray-700 p-4 rounded-lg shadow-sm bg-white dark:bg-gray-800 transition-colors">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-medium text-gray-900 dark:text-gray-100">Order #{order.id}</h3>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      order.payment_status === 'paid' 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                        : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                    }`}>
                      {order.payment_status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {formatDistance(new Date(order.created_at), new Date(), { addSuffix: true })}
                  </p>
                  <p className="mt-2 text-gray-900 dark:text-gray-100">Customer: {order.user.first_name} {order.user.last_name}</p>
                  <p className="text-gray-600 dark:text-gray-300">Email: {order.user.email}</p>
                  <p className="font-medium text-gray-900 dark:text-gray-100">Total: ₹{order.total}</p>
                  
                  <div className="mt-2">
                    <h4 className="font-medium text-gray-900 dark:text-gray-100">Items:</h4>
                    <ul className="list-disc list-inside text-sm text-gray-600 dark:text-gray-300">
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
                    order.status === 'delivered' 
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                    order.status === 'preparing' 
                      ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                      'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                  }`}>
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </span>
                  {order.payment_id && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
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
