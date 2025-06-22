"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { AdminNav } from "@/components/admin/admin-nav";
import { useAuth } from "@/components/providers/auth-provider";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isAdmin, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Wait for auth to be loaded
    if (loading) return;
    
    // Redirect if not logged in or not admin
    if (!user || !isAdmin) {
      router.push("/auth/login");
      return;
    }
  }, [user, isAdmin, loading, router]);

  // Show loading while auth is being determined
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Don't render anything if not admin (will redirect)
  if (!user || !isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <AdminNav />
      <main className="flex-1 p-6">
        {children}
      </main>
    </div>
  );
}