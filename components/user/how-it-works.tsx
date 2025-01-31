"use client"

import { motion } from "framer-motion"
import { Search, ChefHat, Truck } from "lucide-react"

const steps = [
  {
    icon: Search,
    title: "Find Your Favorite Dish",
    description: "Browse through a variety of homemade dishes from local cooks.",
  },
  {
    icon: ChefHat,
    title: "Choose Your Cook",
    description: "Select from our network of passionate home cooks in your area.",
  },
  {
    icon: Truck,
    title: "Get It Delivered",
    description: "Enjoy your delicious meal, delivered right to your campus.",
  },
]

export function HowItWorks() {
  return (
    <section className="py-16 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              className="text-center"
            >
              <div className="mb-4 inline-block p-4 bg-primary text-white rounded-full">
                <step.icon size={32} />
              </div>
              <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
              <p className="text-gray-600 dark:text-gray-300">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

