"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Home, Users, ChefHat, ShoppingCart, CreditCard, BarChart, Tag, Settings } from "lucide-react"

const menuItems = [
  { icon: Home, label: "Dashboard", href: "/admin" },
  { icon: Users, label: "User Management", href: "/admin/users" },
  { icon: ChefHat, label: "Cook Management", href: "/admin/cooks" },
  { icon: ShoppingCart, label: "Orders", href: "/admin/orders" },
  { icon: CreditCard, label: "Payments", href: "/admin/payments" },
  { icon: BarChart, label: "Reports", href: "/admin/reports" },
  { icon: Tag, label: "Coupons", href: "/admin/coupons" },
  { icon: Settings, label: "Settings", href: "/admin/settings" },
]

export default function AdminSidebar() {
  const pathname = usePathname()

  return (
    <div className="w-64 h-full bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-center h-16 border-b border-gray-200 dark:border-gray-700">
        <span className="text-2xl font-bold text-gray-800 dark:text-white">CampusDabba</span>
      </div>
      <nav className="mt-5">
        <ul>
          {menuItems.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className={cn(
                  "flex items-center px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700",
                  pathname === item.href && "bg-gray-100 dark:bg-gray-700 text-primary",
                )}
              >
                <item.icon className="w-5 h-5 mr-3" />
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  )
}

