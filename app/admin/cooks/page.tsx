"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

const initialCooks = [
  { id: 1, name: "Mama's Kitchen", cuisine: "Indian", rating: 4.5 },
  { id: 2, name: "Spice Haven", cuisine: "Mexican", rating: 4.2 },
  { id: 3, name: "Pasta Paradise", cuisine: "Italian", rating: 4.7 },
]

export default function CookManagement() {
  const [cooks, setCooks] = useState(initialCooks)
  const [newCook, setNewCook] = useState({ name: "", cuisine: "", rating: "" })

  const addCook = () => {
    setCooks([...cooks, { ...newCook, id: cooks.length + 1, rating: Number.parseFloat(newCook.rating) }])
    setNewCook({ name: "", cuisine: "", rating: "" })
  }

  const deleteCook = (id: number) => {
    setCooks(cooks.filter((cook) => cook.id !== id))
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Cook Management</h1>
      <div className="mb-4 flex gap-4">
        <Input
          placeholder="Name"
          value={newCook.name}
          onChange={(e) => setNewCook({ ...newCook, name: e.target.value })}
        />
        <Input
          placeholder="Cuisine"
          value={newCook.cuisine}
          onChange={(e) => setNewCook({ ...newCook, cuisine: e.target.value })}
        />
        <Input
          placeholder="Rating"
          value={newCook.rating}
          onChange={(e) => setNewCook({ ...newCook, rating: e.target.value })}
        />
        <Button onClick={addCook}>Add Cook</Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Cuisine</TableHead>
            <TableHead>Rating</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {cooks.map((cook) => (
            <TableRow key={cook.id}>
              <TableCell>{cook.name}</TableCell>
              <TableCell>{cook.cuisine}</TableCell>
              <TableCell>{cook.rating}</TableCell>
              <TableCell>
                <Button variant="destructive" onClick={() => deleteCook(cook.id)}>
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

