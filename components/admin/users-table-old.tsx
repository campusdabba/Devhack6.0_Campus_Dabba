"use client";

import { useState, useEffect } from "react";
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
  roleFilter?: string | string[] | null;
}

export function UsersTable({ onSelectionChange, selectedUsers = [], roleFilter }: UsersTableProps) {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchUsers() {
      try {
        console.log('Fetching users with role filter:', roleFilter);
        
        // Build API URL with role filter
        const params = new URLSearchParams();
        if (roleFilter && roleFilter !== 'all') {
          params.append('role', Array.isArray(roleFilter) ? roleFilter[0] : roleFilter);
        }
        
        const response = await fetch(`/api/admin/users?${params.toString()}`);
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Fetched users:', data.users);
        
        // Apply additional filtering for role arrays or multiple roles
        let filteredUsers = data.users || [];
        
        if (roleFilter && roleFilter !== 'all') {
          filteredUsers = filteredUsers.filter((user: any) => {
            if (!user.role) return false;
            
            if (Array.isArray(roleFilter)) {
              // Check if user has any of the specified roles
              if (Array.isArray(user.role)) {
                return roleFilter.some(r => user.role.includes(r));
              } else {
                return roleFilter.includes(user.role);
              }
            } else {
              // Single role filter
              if (Array.isArray(user.role)) {
                return user.role.includes(roleFilter);
              } else {
                return user.role === roleFilter;
              }
            }
          });
        }
        
        console.log('Filtered users:', filteredUsers);
        setUsers(filteredUsers);
      } catch (error: any) {
        console.error('Error fetching users:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }

    fetchUsers();
  }, [roleFilter]);

        // Fetch only from users table
        console.log('Fetching users from users table only...');
        console.log('Role filter:', roleFilter);
        
        let query = supabase
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
          `);

        // Apply role filter if specified
        if (roleFilter) {
          console.log('Applying role filter:', roleFilter);
          if (Array.isArray(roleFilter)) {
            // Handle array of roles (e.g., ['customer', 'student'])
            query = query.in('role', roleFilter);
          } else {
            // Handle single role
            query = query.eq('role', roleFilter);
          }
        } else {
          console.log('No role filter applied - fetching all users');
        }

        const { data, error } = await query.order('created_at', { ascending: false });
        
        console.log('Users fetch result:', data);
        console.log('Users fetch result count:', data?.length);
        console.log('Users fetch error:', error);
        
        if (error) {
          console.error('Users fetch error:', error);
          setError(`Error fetching users: ${error.message}`);
          return;
        }
        
        setUsers(data || []);
        console.log('Users set successfully:', (data || []).length);
      } catch (error: any) {
        console.error('Unexpected error:', error);
        setError(`Error: ${error.message}`);
      } finally {
        setLoading(false);
      }
    }

    fetchUsers();
  }, [roleFilter]);

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