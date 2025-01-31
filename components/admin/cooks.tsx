"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"

const pendingCooks = [
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
                <Button size="sm" variant="outline">
                  View
                </Button>
                <Button size="sm">Verify</Button>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}

