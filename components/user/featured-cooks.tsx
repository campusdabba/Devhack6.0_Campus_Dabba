"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Star, Clock } from "lucide-react"

const cooks = [
  {
    id: 1,
    name: "Mama's Kitchen",
    image: "/placeholder.svg",
    rating: 4.8,
    reviews: 120,
    cuisine: "North Indian",
    deliveryTime: "30-40",
    featured: true,
  },
  {
    id: 2,
    name: "Home Flavors",
    image: "/placeholder.svg",
    rating: 4.6,
    reviews: 85,
    cuisine: "South Indian",
    deliveryTime: "25-35",
    featured: true,
  },
  {
    id: 3,
    name: "Campus Bites",
    image: "/placeholder.svg",
    rating: 4.7,
    reviews: 95,
    cuisine: "Multi Cuisine",
    deliveryTime: "35-45",
    featured: true,
  },
]

export function FeaturedCooks() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">Featured Cooks</h2>
        <Button variant="link">View all</Button>
      </div>
      <div className="grid gap-6 md:grid-cols-3">
        {cooks.map((cook, index) => (
          <motion.div
            key={cook.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="overflow-hidden">
              <CardContent className="p-0">
                <div className="relative h-48">
                  <Image src={cook.image || "/placeholder.svg"} alt={cook.name} fill className="object-cover" />
                  {cook.featured && <Badge className="absolute top-2 right-2">Featured</Badge>}
                </div>
                <div className="p-4 space-y-2">
                  <h3 className="font-semibold text-lg">{cook.name}</h3>
                  <p className="text-sm text-muted-foreground">{cook.cuisine}</p>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-yellow-400" />
                      <span className="ml-1 text-sm">
                        {cook.rating} ({cook.reviews})
                      </span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="ml-1 text-sm">{cook.deliveryTime} mins</span>
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

