"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Checkbox } from "@/components/ui/checkbox";
import Link from "next/link";

interface UsersTableProps {
  onSelectionChange?: (selectedIds: string[]) => void;
  selectedUsers?: string[];
}

export function UsersTable({ onSelectionChange, selectedUsers = [] }: UsersTableProps) {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();

  useEffect(() => {
    async function fetchUsers() {
      try {
        console.log('Starting to fetch users...');
        
        // First check if user is authenticated
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        console.log('Auth user:', user);
        
        if (authError) {
          console.error('Auth error:', authError);
          setError(`Authentication error: ${authError.message}`);
          return;
        }

        if (!user) {
          console.log('No authenticated user found');
          setError('Not authenticated');
          return;
        }

        // Fetch users from users table
        console.log('Fetching users from users table...');
        const { data, error: usersError } = await supabase
          .from('users')
          .select(`
            id,
            email,
            first_name,
            last_name,
            phone,
            role,
            created_at,
            profile_image,
            address,
            user_preferences
          `)
          .order('created_at', { ascending: false });
        
        console.log('Users fetch result:', data);
        
        if (usersError) {
          console.error('Users fetch error:', usersError);
          setError(`Error fetching users: ${usersError.message}`);
          return;
        }
        
        setUsers(data || []);
        console.log('Users set successfully');
      } catch (error: any) {
        console.error('Unexpected error:', error);
        setError(`Error: ${error.message}`);
      } finally {
        setLoading(false);
      }
    }

    fetchUsers();
  }, []);

  const handleSelectUser = (userId: string) => {
    const newSelection = selectedUsers.includes(userId)
      ? selectedUsers.filter(id => id !== userId)
      : [...selectedUsers, userId];
    
    onSelectionChange?.(newSelection);
  };

  if (loading) {
    return <div>Loading users...</div>;
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  if (users.length === 0) {
    return <div>No users found.</div>;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[50px]">
            <Checkbox
              checked={selectedUsers.length === users.length}
              onCheckedChange={(checked) => {
                if (checked) {
                  onSelectionChange?.(users.map(user => user.id));
                } else {
                  onSelectionChange?.([]);
                }
              }}
            />
          </TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Phone</TableHead>
          <TableHead>Role</TableHead>
          <TableHead>Created At</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.map((user) => (
          <TableRow key={user.id}>
            <TableCell>
              <Checkbox
                checked={selectedUsers.includes(user.id)}
                onCheckedChange={() => handleSelectUser(user.id)}
              />
            </TableCell>
            <TableCell>
              <Link 
                href={`/admin/users/${user.id}`}
                className="text-primary hover:underline"
              >
                {`${user.first_name} ${user.last_name}`.trim() || 'N/A'}
              </Link>
            </TableCell>
            <TableCell>{user.email}</TableCell>
            <TableCell>{user.phone || 'N/A'}</TableCell>
            <TableCell>{user.role || 'user'}</TableCell>
            <TableCell>{new Date(user.created_at).toLocaleDateString()}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
} 