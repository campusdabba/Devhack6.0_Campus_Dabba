"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { motion } from "framer-motion"
import { Users, ChefHat, ShoppingCart, DollarSign } from "lucide-react"
import { Button } from "@/components/ui/button"

const initialStats = [
  {
    title: "Total Users",
    value: "2,350",
    icon: Users,
    change: "+12.5%",
    trend: "up",
  },
  {
    title: "Active Cooks",
    value: "148",
    icon: ChefHat,
    change: "+4.3%",
    trend: "up",
  },
  {
    title: "Total Orders",
    value: "12,234",
    icon: ShoppingCart,
    change: "+18.2%",
    trend: "up",
  },
  {
    title: "Revenue",
    value: "$45,231",
    icon: DollarSign,
    change: "+8.9%",
    trend: "up",
  },
]

export function StatsCards() {
  const [stats, setStats] = useState(initialStats)

  const refreshStats = () => {
    // Simulate API call to refresh stats
    const newStats = stats.map((stat) => ({
      ...stat,
      value: (Number.parseInt(stat.value.replace(/,/g, "")) + Math.floor(Math.random() * 100)).toLocaleString(),
      change: `${(Math.random() * 5 + 1).toFixed(1)}%`,
      trend: Math.random() > 0.3 ? "up" : "down",
    }))
    setStats(newStats)
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Dashboard Overview</h2>
        <Button onClick={refreshStats}>Refresh Stats</Button>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <stat.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className={`text-xs ${stat.trend === "up" ? "text-green-500" : "text-red-500"}`}>
                  {stat.change} from last month
                </p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

