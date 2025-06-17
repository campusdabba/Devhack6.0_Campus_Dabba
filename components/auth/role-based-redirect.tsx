"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth-role';

interface RoleBasedRedirectProps {
  children: React.ReactNode;
  fallbackPath?: string;
}

export function RoleBasedRedirect({ children, fallbackPath = "/browse" }: RoleBasedRedirectProps) {
  const { user, role, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user && role) {
      switch (role) {
        case 'cook':
          router.push('/cook/dashboard');
          break;
        case 'admin':
          router.push('/admin/dashboard');
          break;
        case 'student':
          // Students stay on the current page or go to browse
          break;
        default:
          // Unknown role, redirect to browse
          router.push(fallbackPath);
      }
    }
  }, [user, role, loading, router, fallbackPath]);

  // Show loading state or content based on whether we're redirecting
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // If user is logged in and is a cook/admin, don't render children (they're being redirected)
  if (user && (role === 'cook' || role === 'admin')) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Render children for students or non-logged-in users
  return <>{children}</>;
}
