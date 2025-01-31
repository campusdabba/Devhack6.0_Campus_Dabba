"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

const initialOrders = [
  { id: 1, customer: "John Doe", cook: "Mama's Kitchen", total: 25.99, status: "Pending" },
  { id: 2, customer: "Jane Smith", cook: "Spice Haven", total: 34.5, status: "Delivered" },
  { id: 3, customer: "Bob Johnson", cook: "Pasta Paradise", total: 19.99, status: "In Progress" },
]

export default function OrderManagement() {
  const [orders, setOrders] = useState(initialOrders)

  const updateStatus = (id: number) => {
    setOrders(orders.map((order) => (order.id === id ? { ...order, status: getNextStatus(order.status) } : order)))
  }

  const getNextStatus = (currentStatus: string) => {
    const statuses = ["Pending", "In Progress", "Delivered"]
    const currentIndex = statuses.indexOf(currentStatus)
    return statuses[(currentIndex + 1) % statuses.length]
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Order Management</h1>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Order ID</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Cook</TableHead>
            <TableHead>Total</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order) => (
            <TableRow key={order.id}>
              <TableCell>{order.id}</TableCell>
              <TableCell>{order.customer}</TableCell>
              <TableCell>{order.cook}</TableCell>
              <TableCell>${order.total.toFixed(2)}</TableCell>
              <TableCell>
                <Badge variant={order.status === "Delivered" ? "success" : "warning"}>{order.status}</Badge>
              </TableCell>
              <TableCell>
                <Button onClick={() => updateStatus(order.id)}>Update Status</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

