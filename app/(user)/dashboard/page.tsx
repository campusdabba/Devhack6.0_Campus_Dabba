"use client"

import { motion } from "framer-motion"
import { CategorySection } from "@/components/user/category-section"
import { FeaturedCooks } from "@/components/user/featured-cooks"
import { OrderProgress } from "@/components/user/order-progress"
import { PopularDishes } from "@/components/user/popular-dishes"
import { WelcomeHero } from "@/components/user/welcome-hero"
import { NearbyMap } from "@/components/user/nearby-map"

export default function UserDashboard() {
  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <WelcomeHero />
      </motion.div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
        <OrderProgress />
      </motion.div>

      <div className="grid gap-8 md:grid-cols-2">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
          <CategorySection />
        </motion.div>
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
          <PopularDishes />
        </motion.div>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
        <FeaturedCooks />
      </motion.div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
        <NearbyMap />
      </motion.div>
    </div>
  )
}

