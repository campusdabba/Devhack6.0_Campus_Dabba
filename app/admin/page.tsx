import { StatsCards } from "@/components/admin/stats-cards"
import { RecentOrders } from "@/components/admin/recent-orders"
import { CookVerification } from "@/components/admin/cook-verification"

export default function AdminDashboard() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
      <div className="space-y-8">
        <StatsCards />
        <div className="grid gap-8 md:grid-cols-2">
          <RecentOrders />
          <CookVerification />
        </div>
      </div>
    </div>
  )
}

