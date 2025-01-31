"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

const initialPayments = [
  { id: 1, orderId: "ORD001", amount: 25.99, method: "Credit Card", status: "Completed" },
  { id: 2, orderId: "ORD002", amount: 34.5, method: "PayPal", status: "Pending" },
  { id: 3, orderId: "ORD003", amount: 19.99, method: "Debit Card", status: "Completed" },
]

export default function PaymentManagement() {
  const [payments] = useState(initialPayments)

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Payment Management</h1>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Payment ID</TableHead>
            <TableHead>Order ID</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Method</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {payments.map((payment) => (
            <TableRow key={payment.id}>
              <TableCell>{payment.id}</TableCell>
              <TableCell>{payment.orderId}</TableCell>
              <TableCell>${payment.amount.toFixed(2)}</TableCell>
              <TableCell>{payment.method}</TableCell>
              <TableCell>
                <Badge variant={payment.status === "Completed" ? "success" : "warning"}>{payment.status}</Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

