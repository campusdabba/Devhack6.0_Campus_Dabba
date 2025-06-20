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
        setError(null);
      } catch (err: any) {
        console.error('Error fetching users:', err);
        setError(err.message);
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

  const formatRole = (role: any) => {
    if (Array.isArray(role)) {
      return role.join(', ');
    }
    return role || 'N/A';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
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
          <TableHead>Role</TableHead>
          <TableHead>Phone</TableHead>
          <TableHead>Created</TableHead>
          <TableHead>Actions</TableHead>
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
              {user.first_name && user.last_name 
                ? `${user.first_name} ${user.last_name}` 
                : user.full_name || 'N/A'}
            </TableCell>
            <TableCell>{user.email || 'N/A'}</TableCell>
            <TableCell>
              <span className="capitalize">{formatRole(user.role)}</span>
            </TableCell>
            <TableCell>{user.phone || 'N/A'}</TableCell>
            <TableCell>{formatDate(user.created_at)}</TableCell>
            <TableCell>
              <Link 
                href={`/admin/users/${user.id}`}
                className="text-blue-600 hover:text-blue-800"
              >
                View
              </Link>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
