"use client";

import { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { UsersTable } from "@/components/admin/users-table";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";

export default function AdminUsersPage() {
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
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
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Manage Users</h1>
        <Button
          variant="destructive"
          onClick={handleDeleteUsers}
          disabled={selectedUsers.length === 0}
        >
          Delete Selected
        </Button>
      </div>
      <UsersTable
        selectedUsers={selectedUsers}
        onSelectionChange={setSelectedUsers}
      />
    </div>
  );
} 