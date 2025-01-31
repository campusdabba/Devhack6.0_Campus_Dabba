"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"

const categories = [
  {
    name: "Breakfast",
    image: "/placeholder.svg",
    count: "50+ dishes",
  },
  {
    name: "Lunch",
    image: "/placeholder.svg",
    count: "100+ dishes",
  },
  {
    name: "Dinner",
    image: "/placeholder.svg",
    count: "80+ dishes",
  },
  {
    name: "Snacks",
    image: "/placeholder.svg",
    count: "30+ dishes",
  },
]

export function CategorySection() {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold tracking-tight">Categories</h2>
      <div className="grid grid-cols-2 gap-4">
        {categories.map((category, index) => (
          <motion.div
            key={category.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="overflow-hidden cursor-pointer transition-transform hover:scale-105">
              <CardContent className="p-0">
                <div className="relative h-32">
                  <Image src={category.image || "/placeholder.svg"} alt={category.name} fill className="object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-0 p-4 text-white">
                    <h3 className="font-semibold">{category.name}</h3>
                    <p className="text-sm opacity-90">{category.count}</p>
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

