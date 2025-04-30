"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function DashboardOverview() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalCooks: 0,
    totalOrders: 0,
    totalPayments: 0
  });
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState<string[]>([]);
  const supabase = createClient();

  useEffect(() => {
    async function fetchStats() {
      try {
        // Fetch total users
        const { count: usersCount, error: usersError } = await supabase
          .from('users')
          .select('*', { count: 'exact', head: true });

        if (usersError) {
          setErrors(prev => [...prev, `Error fetching users: ${usersError.message}`]);
        }

        // Fetch total cooks
        const { count: cooksCount, error: cooksError } = await supabase
          .from('cooks')
          .select('*', { count: 'exact', head: true });

        if (cooksError) {
          setErrors(prev => [...prev, `Error fetching cooks: ${cooksError.message}`]);
        }

        // Fetch total orders
        const { count: ordersCount, error: ordersError } = await supabase
          .from('orders')
          .select('*', { count: 'exact', head: true });

        if (ordersError) {
          setErrors(prev => [...prev, `Error fetching orders: ${ordersError.message}`]);
        }

        // Fetch total payments
        const { count: paymentsCount, error: paymentsError } = await supabase
          .from('payments')
          .select('*', { count: 'exact', head: true });

        if (paymentsError) {
          setErrors(prev => [...prev, `Error fetching payments: ${paymentsError.message}`]);
        }

        setStats({
          totalUsers: usersCount || 0,
          totalCooks: cooksCount || 0,
          totalOrders: ordersCount || 0,
          totalPayments: paymentsCount || 0
        });
      } catch (error: any) {
        setErrors(prev => [...prev, `Error: ${error.message}`]);
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, []);

  if (loading) {
    return <div>Loading statistics...</div>;
  }

  return (
    <div>
      {errors.length > 0 && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded">
          {errors.map((error, index) => (
            <div key={index}>{error}</div>
          ))}
        </div>
      )}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsers}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Cooks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalCooks}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalOrders}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Payments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalPayments}</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 