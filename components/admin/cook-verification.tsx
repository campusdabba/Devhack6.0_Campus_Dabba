"use client"

import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { toast } from "@/components/ui/use-toast"

const initialPendingCooks = [
  {
    id: 1,
    name: "Sarah's Kitchen",
    image: "/placeholder.svg",
    address: "123 College St",
    status: "pending",
  },
  {
    id: 2,
    name: "Home Flavors",
    image: "/placeholder.svg",
    address: "456 University Ave",
    status: "pending",
  },
  {
    id: 3,
    name: "Campus Bites",
    image: "/placeholder.svg",
    address: "789 Student Lane",
    status: "pending",
  },
]

export function CookVerification() {
  const [pendingCooks, setPendingCooks] = useState(initialPendingCooks)

  const handleVerify = (id: number) => {
    setPendingCooks((prevCooks) => prevCooks.filter((cook) => cook.id !== id))
    toast({
      title: "Cook Verified",
      description: "The cook has been successfully verified.",
    })
  }

  const handleView = (id: number) => {
    // Simulate opening a detailed view
    toast({
      title: "View Cook Details",
      description: `Viewing details for cook ID: ${id}`,
    })
  }

  return (
    <div className="p-4">
      <h3 className="text-lg font-semibold mb-4">Pending Verifications</h3>
      <ScrollArea className="h-[220px]">
        <div className="space-y-4">
          {pendingCooks.map((cook) => (
            <div key={cook.id} className="flex items-center justify-between p-4 rounded-lg border">
              <div className="flex items-center space-x-4">
                <Avatar>
                  <AvatarImage src={cook.image} />
                  <AvatarFallback>{cook.name[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{cook.name}</p>
                  <p className="text-sm text-muted-foreground">{cook.address}</p>
                </div>
              </div>
              <div className="space-x-2">
                <Button size="sm" variant="outline" onClick={() => handleView(cook.id)}>
                  View
                </Button>
                <Button size="sm" onClick={() => handleVerify(cook.id)}>
                  Verify
                </Button>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}

