"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { UserNav } from "@/components/layout/User-nav";
import { useAuth } from "@/components/providers/auth-provider";

const adminNavItems = [
  {
    title: "Dashboard",
    href: "/admin/dashboard",
  },
  {
    title: "Users",
    href: "/admin/users",
  },
  {
    title: "Cooks",
    href: "/admin/cooks",
  },
  {
    title: "Orders",
    href: "/admin/orders",
  },
  {
    title: "Payments",
    href: "/admin/payments",
  },
  {
    title: "Settings",
    href: "/admin/settings",
  },
];

export function AdminNav() {
  const pathname = usePathname();
  const { user, isAdmin, userRole, refreshCounter } = useAuth();

  // Debug log
  console.log('AdminNav render:', { 
    user: user?.id, 
    isAdmin, 
    userRole, 
    refreshCounter 
  });

  return (
    <div className="mr-4 flex items-center justify-between w-full">
      <div className="flex items-center">
        <Link href="/admin/dashboard" className="mr-6 flex items-center space-x-2">
          <Image
            src="https://ejtjwejiulepzcglswis.supabase.co/storage/v1/object/public/webpage-images//logo.png"
            alt="CampusDabba Admin"
            width={60}
            height={60}
            className="mr-4 rounded-lg"
          />
          <span className="font-semibold text-foreground">Admin Panel</span>
        </Link>
        <nav className="flex items-center space-x-6 text-sm font-medium">
          {adminNavItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "transition-colors hover:text-foreground/80",
                pathname === item.href
                  ? "text-foreground"
                  : "text-foreground/60"
              )}
            >
              {item.title}
            </Link>
          ))}
        </nav>
      </div>
      <div className="flex items-center space-x-4">
        <Button variant="outline" size="sm" asChild>
          <Link href="/">
            Back to Site
          </Link>
        </Button>
        {user && <UserNav />}
      </div>
    </div>
  );
} 