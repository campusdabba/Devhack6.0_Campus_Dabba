"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/use-toast"

const initialOrders = [
  {
    id: "ORD001",
    customer: "John Doe",
    cook: "Mama's Kitchen",
    amount: "$24.00",
    status: "delivered",
  },
  {
    id: "ORD002",
    customer: "Jane Smith",
    cook: "Spice Haven",
    amount: "$32.50",
    status: "preparing",
  },
  {
    id: "ORD003",
    customer: "Mike Johnson",
    cook: "Home Delights",
    amount: "$18.75",
    status: "pending",
  },
  {
    id: "ORD004",
    customer: "Sarah Williams",
    cook: "Culinary Express",
    amount: "$45.20",
    status: "delivered",
  },
]

const statusColors = {
  delivered: "bg-green-500",
  preparing: "bg-yellow-500",
  pending: "bg-blue-500",
}

export function RecentOrders() {
  const [orders, setOrders] = useState(initialOrders)

  const handleStatusChange = (id: string) => {
    setOrders((prevOrders) =>
      prevOrders.map((order) => (order.id === id ? { ...order, status: getNextStatus(order.status) } : order)),
    )
    toast({
      title: "Order Status Updated",
      description: `Order ${id} status has been updated.`,
    })
  }

  const getNextStatus = (currentStatus: string) => {
    const statusOrder = ["pending", "preparing", "delivered"]
    const currentIndex = statusOrder.indexOf(currentStatus)
    return statusOrder[(currentIndex + 1) % statusOrder.length]
  }

  return (
    <div className="p-4">
      <h3 className="text-lg font-semibold mb-4">Recent Orders</h3>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Cook</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell>{order.id}</TableCell>
                <TableCell>{order.customer}</TableCell>
                <TableCell>{order.cook}</TableCell>
                <TableCell>{order.amount}</TableCell>
                <TableCell>
                  <Badge variant="secondary">{order.status}</Badge>
                </TableCell>
                <TableCell>
                  <Button size="sm" onClick={() => handleStatusChange(order.id)}>
                    Update Status
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

