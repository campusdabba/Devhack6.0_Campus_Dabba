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

interface CooksTableProps {
  onSelectionChange?: (selectedIds: string[]) => void;
  selectedCooks?: string[];
}

export function CooksTable({ onSelectionChange, selectedCooks = [] }: CooksTableProps) {
  const [cooks, setCooks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();

  useEffect(() => {
    async function fetchCooks() {
      try {
        console.log('Starting to fetch cooks...');
        
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

        // Try to fetch cooks directly - RLS will handle the permission check
        console.log('Fetching cooks from database...');
        const { data, error: cooksError } = await supabase
          .from('cooks')
          .select('*')
          .order('created_at', { ascending: false });
        
        console.log('Cooks fetch result:', data);
        
        if (cooksError) {
          if (cooksError.code === '42501') { // Permission denied
            console.log('User is not an admin');
            setError('Not authorized to view cooks');
          } else {
            console.error('Cooks fetch error:', cooksError);
            setError(`Error fetching cooks: ${cooksError.message}`);
          }
          return;
        }
        
        setCooks(data || []);
        console.log('Cooks set successfully');
      } catch (error: any) {
        console.error('Unexpected error:', error);
        setError(`Error: ${error.message}`);
      } finally {
        setLoading(false);
      }
    }

    fetchCooks();
  }, []);

  const handleSelectCook = (cookId: string) => {
    const newSelection = selectedCooks.includes(cookId)
      ? selectedCooks.filter(id => id !== cookId)
      : [...selectedCooks, cookId];
    
    onSelectionChange?.(newSelection);
  };

  if (loading) {
    return <div>Loading cooks...</div>;
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  if (cooks.length === 0) {
    return <div>No cooks found.</div>;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[50px]">
            <Checkbox
              checked={selectedCooks.length === cooks.length}
              onCheckedChange={(checked) => {
                if (checked) {
                  onSelectionChange?.(cooks.map(cook => cook.id));
                } else {
                  onSelectionChange?.([]);
                }
              }}
            />
          </TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Phone</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Created At</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {cooks.map((cook) => (
          <TableRow key={cook.id}>
            <TableCell>
              <Checkbox
                checked={selectedCooks.includes(cook.id)}
                onCheckedChange={() => handleSelectCook(cook.id)}
              />
            </TableCell>
            <TableCell>
              <Link 
                href={`/admin/cooks/${cook.id}`}
                className="text-primary hover:underline"
              >
                {cook.first_name} {cook.last_name}
              </Link>
            </TableCell>
            <TableCell>{cook.email}</TableCell>
            <TableCell>{cook.phone}</TableCell>
            <TableCell>{cook.status || 'pending'}</TableCell>
            <TableCell>{new Date(cook.created_at).toLocaleDateString()}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
} 