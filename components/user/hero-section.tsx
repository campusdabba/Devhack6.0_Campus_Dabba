"use client";

import { motion } from "framer-motion";
import { Button } from "components/ui/button"; // Corrected import
import Link from "next/link";

export function HeroSection() {
  return (
    <section className="bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 text-white py-20">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <h1 className="text-4xl md:text-6xl font-bold mb-4">Homemade Goodness, Delivered</h1>
          <p className="text-xl md:text-2xl mb-8">Delicious, home-cooked meals from local cooks to your campus</p>
          <Link href="/search">
            <Button size="lg" className="bg-white text-purple-600 hover:bg-gray-100">
              Find Your Next Meal
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
