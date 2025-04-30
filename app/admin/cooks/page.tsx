"use client";

import { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { CooksTable } from "@/components/admin/cooks-table";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";

export default function AdminCooksPage() {
  const [selectedCooks, setSelectedCooks] = useState<string[]>([]);
  const { toast } = useToast();
  const router = useRouter();
  const supabase = createClient();

  const handleDeleteCooks = async () => {
    if (selectedCooks.length === 0) {
      toast({
        title: "No cooks selected",
        description: "Please select at least one cook to delete",
        variant: "destructive",
      });
      return;
    }

    try {
      // Delete from cooks table
      const { error: cooksError } = await supabase
        .from('cooks')
        .delete()
        .in('id', selectedCooks);

      if (cooksError) throw cooksError;

      // Delete from auth.users table
      const { error: authError } = await supabase.auth.admin.deleteUser(
        selectedCooks
      );

      if (authError) throw authError;

      toast({
        title: "Success",
        description: "Selected cooks have been deleted",
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
        <h1 className="text-3xl font-bold">Manage Cooks</h1>
        <Button
          variant="destructive"
          onClick={handleDeleteCooks}
          disabled={selectedCooks.length === 0}
        >
          Delete Selected
        </Button>
      </div>
      <CooksTable
        selectedCooks={selectedCooks}
        onSelectionChange={setSelectedCooks}
      />
    </div>
  );
} 