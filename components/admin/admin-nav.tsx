"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { UserNav } from "@/components/layout/User-nav";

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

  return (
    <nav className="border-b">
      <div className="flex h-16 items-center px-4">
        <div className="flex items-center space-x-4">
          {adminNavItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary",
                pathname === item.href
                  ? "text-primary"
                  : "text-muted-foreground"
              )}
            >
              {item.title}
            </Link>
          ))}
        </div>
        <div className="ml-auto flex items-center space-x-4">
          <UserNav />
        </div>
      </div>
    </nav>
  );
} 