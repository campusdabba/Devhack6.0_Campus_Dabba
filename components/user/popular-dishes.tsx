"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

const dishes = [
  {
    id: 1,
    name: "Butter Chicken",
    image: "/placeholder.svg",
    price: "12.99",
    cook: "Mama's Kitchen",
    veg: false,
    popular: true,
  },
  {
    id: 2,
    name: "Paneer Tikka",
    image: "/placeholder.svg",
    price: "10.99",
    cook: "Home Flavors",
    veg: true,
    popular: true,
  },
  {
    id: 3,
    name: "Dal Makhani",
    image: "/placeholder.svg",
    price: "8.99",
    cook: "Campus Bites",
    veg: true,
    popular: true,
  },
]

export function PopularDishes() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">Popular Dishes</h2>
        <Button variant="link">View all</Button>
      </div>
      <div className="grid gap-4">
        {dishes.map((dish, index) => (
          <motion.div
            key={dish.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card>
              <CardContent className="p-0">
                <div className="flex items-center">
                  <div className="relative h-24 w-24">
                    <Image
                      src={dish.image || "/placeholder.svg"}
                      alt={dish.name}
                      fill
                      className="object-cover rounded-l-lg"
                    />
                  </div>
                  <div className="p-4 flex-1">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold">{dish.name}</h3>
                        <p className="text-sm text-muted-foreground">{dish.cook}</p>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold">${dish.price}</div>
                        <Badge variant={dish.veg ? "success" : "default"}>{dish.veg ? "Veg" : "Non-veg"}</Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

