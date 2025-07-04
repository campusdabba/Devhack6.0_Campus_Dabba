"use client";

import { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { UsersTable } from "@/components/admin/users-table";
import { CooksTable } from "@/components/admin/cooks-table";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProtectedRoute } from "@/components/auth/protected-route";

export default function AdminUsersPage() {
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [selectedCooks, setSelectedCooks] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState("all");
  const { toast } = useToast();
  const router = useRouter();
  const supabase = createClient();

  const handleDeleteUsers = async () => {
    if (selectedUsers.length === 0) {
      toast({
        title: "No users selected",
        description: "Please select at least one user to delete",
        variant: "destructive",
      });
      return;
    }

    try {
      // Delete from users table
      const { error: usersError } = await supabase
        .from('users')
        .delete()
        .in('id', selectedUsers);

      if (usersError) throw usersError;

      // Delete from auth.users table using the admin client
      const { error: authError } = await supabase.auth.admin.deleteUser(
        selectedUsers[0] // Currently only supports deleting one user at a time
      );

      if (authError) throw authError;

      toast({
        title: "Success",
        description: "Selected users have been deleted",
      });

      // Refresh the page
      router.refresh();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <ProtectedRoute requireAdmin>
      <div className="container mx-auto py-10">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">Manage Users</h1>
            <p className="text-muted-foreground">View and manage all users in the system</p>
          </div>
          <Button
            variant="destructive"
            onClick={handleDeleteUsers}
            disabled={selectedUsers.length === 0}
          >
            Delete Selected ({selectedUsers.length})
          </Button>
        </div>

        <Card>
        <CardHeader>
          <CardTitle>Users</CardTitle>
          <CardDescription>
            Registered users including students, customers, and admins (cooks managed separately)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="all">All Users</TabsTrigger>
              <TabsTrigger value="customers">Customers</TabsTrigger>
              <TabsTrigger value="students">Students</TabsTrigger>
              <TabsTrigger value="admins">Admins</TabsTrigger>
            </TabsList>
            
            <TabsContent value="all" className="mt-6">
              <UsersTable
                selectedUsers={selectedUsers}
                onSelectionChange={setSelectedUsers}
                roleFilter="exclude-cook"
              />
            </TabsContent>
            
            <TabsContent value="customers" className="mt-6">
              <UsersTable
                selectedUsers={selectedUsers}
                onSelectionChange={setSelectedUsers}
                roleFilter="customer"
              />
            </TabsContent>
            
            <TabsContent value="students" className="mt-6">
              <UsersTable
                selectedUsers={selectedUsers}
                onSelectionChange={setSelectedUsers}
                roleFilter="student"
              />
            </TabsContent>
            
            <TabsContent value="admins" className="mt-6">
              <UsersTable
                selectedUsers={selectedUsers}
                onSelectionChange={setSelectedUsers}
                roleFilter="admin"
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
    </ProtectedRoute>
  );
} 