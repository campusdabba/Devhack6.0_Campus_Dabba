"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

const initialCoupons = [
  { id: 1, code: "SUMMER10", discount: 10, type: "Percentage" },
  { id: 2, code: "FREESHIP", discount: 5, type: "Fixed Amount" },
  { id: 3, code: "WELCOME20", discount: 20, type: "Percentage" },
]

export default function CouponManagement() {
  const [coupons, setCoupons] = useState(initialCoupons)
  const [newCoupon, setNewCoupon] = useState({ code: "", discount: "", type: "" })

  const addCoupon = () => {
    setCoupons([...coupons, { ...newCoupon, id: coupons.length + 1, discount: Number.parseFloat(newCoupon.discount) }])
    setNewCoupon({ code: "", discount: "", type: "" })
  }

  const deleteCoupon = (id: number) => {
    setCoupons(coupons.filter((coupon) => coupon.id !== id))
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Coupon Management</h1>
      <div className="mb-4 flex gap-4">
        <Input
          placeholder="Code"
          value={newCoupon.code}
          onChange={(e) => setNewCoupon({ ...newCoupon, code: e.target.value })}
        />
        <Input
          placeholder="Discount"
          value={newCoupon.discount}
          onChange={(e) => setNewCoupon({ ...newCoupon, discount: e.target.value })}
        />
        <Input
          placeholder="Type"
          value={newCoupon.type}
          onChange={(e) => setNewCoupon({ ...newCoupon, type: e.target.value })}
        />
        <Button onClick={addCoupon}>Add Coupon</Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Code</TableHead>
            <TableHead>Discount</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {coupons.map((coupon) => (
            <TableRow key={coupon.id}>
              <TableCell>{coupon.code}</TableCell>
              <TableCell>{coupon.discount}</TableCell>
              <TableCell>{coupon.type}</TableCell>
              <TableCell>
                <Button variant="destructive" onClick={() => deleteCoupon(coupon.id)}>
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

