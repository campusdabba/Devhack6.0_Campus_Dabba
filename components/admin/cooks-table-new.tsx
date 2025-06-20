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

interface CooksTableProps {
  onSelectionChange?: (selectedIds: string[]) => void;
  selectedCooks?: string[];
}

export function CooksTable({ onSelectionChange, selectedCooks = [] }: CooksTableProps) {
  const [cooks, setCooks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCooks() {
      try {
        console.log('Fetching cooks via API...');
        
        const response = await fetch('/api/admin/cooks');
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Fetched cooks:', data.cooks);
        
        setCooks(data.cooks || []);
        setError(null);
      } catch (err: any) {
        console.error('Error fetching cooks:', err);
        setError(err.message);
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
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
          <TableHead>Specialties</TableHead>
          <TableHead>Created</TableHead>
          <TableHead>Actions</TableHead>
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
              {cook.first_name && cook.last_name 
                ? `${cook.first_name} ${cook.last_name}` 
                : cook.full_name || 'N/A'}
            </TableCell>
            <TableCell>{cook.email || 'N/A'}</TableCell>
            <TableCell>{cook.phone || 'N/A'}</TableCell>
            <TableCell>
              <span className={`px-2 py-1 rounded text-xs font-semibold ${
                cook.is_verified 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-yellow-100 text-yellow-800'
              }`}>
                {cook.is_verified ? 'Verified' : 'Pending'}
              </span>
            </TableCell>
            <TableCell>
              {cook.specialties ? (
                Array.isArray(cook.specialties) 
                  ? cook.specialties.join(', ')
                  : cook.specialties
              ) : 'N/A'}
            </TableCell>
            <TableCell>{formatDate(cook.created_at)}</TableCell>
            <TableCell>
              <Link 
                href={`/admin/cooks/${cook.id}`}
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
