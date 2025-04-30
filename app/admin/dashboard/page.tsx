"use client";

import { DashboardOverview } from "@/components/admin/dashboard-overview";
import { UsersTable } from "@/components/admin/users-table";
import { CooksTable } from "@/components/admin/cooks-table";
import { OrdersTable } from "@/components/admin/orders-table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function AdminDashboard() {
  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      
      <DashboardOverview />
      
      <Tabs defaultValue="users" className="mt-8">
        <TabsList>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="cooks">Cooks</TabsTrigger>
          <TabsTrigger value="orders">Orders</TabsTrigger>
        </TabsList>
        
        <TabsContent value="users">
          <UsersTable />
        </TabsContent>
        
        <TabsContent value="cooks">
          <CooksTable />
        </TabsContent>
        
        <TabsContent value="orders">
          <OrdersTable />
        </TabsContent>
      </Tabs>
    </div>
  );
} 