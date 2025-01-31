"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Clock, ChefHat, Bike, Check } from "lucide-react"

const steps = [
  {
    icon: Clock,
    title: "Order Confirmed",
    description: "Your order has been received",
    status: "completed",
  },
  {
    icon: ChefHat,
    title: "Preparing",
    description: "Cook is preparing your meal",
    status: "current",
  },
  {
    icon: Bike,
    title: "On the Way",
    description: "Your order is being delivered",
    status: "upcoming",
  },
  {
    icon: Check,
    title: "Delivered",
    description: "Enjoy your meal!",
    status: "upcoming",
  },
]

export function OrderProgress() {
  const currentStep = 1
  const progress = (currentStep / (steps.length - 1)) * 100

  return (
    <Card>
      <CardHeader>
        <CardTitle>Current Order Status</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative">
          <Progress value={progress} className="h-2" />
          <div className="mt-8 grid grid-cols-4 gap-4">
            {steps.map((step, index) => {
              const Icon = step.icon
              return (
                <motion.div
                  key={step.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex flex-col items-center text-center"
                >
                  <div
                    className={`mb-2 rounded-full p-2 ${
                      step.status === "completed"
                        ? "bg-primary text-primary-foreground"
                        : step.status === "current"
                          ? "bg-primary/20 text-primary"
                          : "bg-muted text-muted-foreground"
                    }`}
                  >
                    <Icon className="h-6 w-6" />
                  </div>
                  <h4 className="text-sm font-medium">{step.title}</h4>
                  <p className="text-xs text-muted-foreground">{step.description}</p>
                </motion.div>
              )
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

