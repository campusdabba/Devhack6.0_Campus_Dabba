"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { ShoppingCart, LogIn } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useCart } from "@/components/providers/cart-provider";
import { useAuth } from "@/components/providers/auth-provider";
import { useToast } from "@/components/ui/use-toast";
import {Input_search2} from "@/components/ui/search-bar";
import { UserNav } from "@/components/layout/User-nav";

const navItems = [
  { title: "Profile", href: "/cook/profile" },
  { title: "MyDabba", href: "/cook/menu" },
  { title: "Orders", href: "/cook/orders" },
  { title: "Payments", href: "/cook/payments" },
  { title: "Settings", href: "/cook/settings" },
];

export function CookNav() {
  const pathname = usePathname();
  const router = useRouter();
  const { toast } = useToast();
  const { cart, getCartTotal } = useCart();
  const { user } = useAuth();
  
  const cartItemCount = cart.reduce((total: number, item: any) => total + item.quantity, 0);
  const cartTotal = getCartTotal();

  return (
    <div className="mr-4 flex items-center justify-between w-full">
      <div className="flex items-center">
        <Link
          href="/cook/dashboard"
          className="mr-6 flex items-center space-x-2"
        >
          <Image
            src="https://ejtjwejiulepzcglswis.supabase.co/storage/v1/object/public/webpage-images//logo.png"
            alt="CampusDabba Logo"
            width={60}
            height={60}
            className="mr-4 rounded-lg"
          />
        </Link>
        <nav className="flex items-center space-x-6 text-sm font-medium">
          {navItems.map((item) => (
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
        {!["/cook/search", "/cook/login", "/cook/register"].includes(
          pathname
        ) && (
          <Link href="/chatbot">
            <Input_search2 />
          </Link>
        )}
      </div>
      <div className="flex items-center space-x-4">
        <Button variant="outline" size="sm" asChild>
          <Link href="/cook/orderprog" className="flex items-center gap-2">
            <ShoppingCart className="h-4 w-4" />
            <span>Manage Orders</span>
          </Link>
        </Button>
        {user ? (
          <UserNav />
        ) : (
          <Button variant="ghost" size="sm" asChild>
            <Link href="/cook/login">
              <LogIn className="h-4 w-4 mr-2" />
              Login
            </Link>
          </Button>
        )}
      </div>
    </div>
  );
}
