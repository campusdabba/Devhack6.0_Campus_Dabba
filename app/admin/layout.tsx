"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { AdminNav } from "@/components/admin/admin-nav";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const checkAdmin = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/auth/login");
        return;
      }

      const { data: isAdmin, error } = await supabase
        .rpc('is_admin', { user_id: user.id });

      if (error || !isAdmin) {
        router.push("/");
        return;
      }
    };

    checkAdmin();
  }, [router, supabase]);

  return (
    <div className="min-h-screen bg-background">
      <AdminNav />
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
} 