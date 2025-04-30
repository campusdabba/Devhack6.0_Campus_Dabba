"use client";

import { useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { AdminNav } from "@/components/admin/admin-nav";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createClient();

  useEffect(() => {
    const checkAdmin = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          window.location.href = "/auth/login";
          return;
        }

        const { data: isAdmin, error } = await supabase
          .rpc('is_admin', { input_user_id: user.id });

        if (error) {
          console.error('Error checking admin status:', error);
          window.location.href = "/";
          return;
        }

        if (!isAdmin) {
          console.log('User is not an admin');
          window.location.href = "/";
          return;
        }
      } catch (error) {
        console.error('Error in admin check:', error);
        window.location.href = "/";
      }
    };

    checkAdmin();
  }, [supabase]);

  return (
    <div className="min-h-screen bg-background">
      <AdminNav />
      <main className="flex-1 p-6">
        {children}
      </main>
    </div>
  );
} 