"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { createClient } from "@/utils/supabase/client";
import { cn } from "@/lib/utils";

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
  const { toast } = useToast();
  const supabase = createClient();

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({
        title: "Error logging out",
        description: error.message,
        variant: "destructive",
      });
      return;
    }
    toast({
      title: "Logged out successfully",
      description: "You have been logged out of your account.",
    });
  };

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
          <Button variant="ghost" size="sm" onClick={handleLogout}>
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </div>
    </nav>
  );
} 