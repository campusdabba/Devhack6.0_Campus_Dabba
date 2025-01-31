"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { Card, CardContent, CardFooter } from "components/ui/card"; // Corrected import
import { Button } from "components/ui/button"; // Corrected import

interface Dish {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
}

export function FeaturedDishes() {
  const [dishes, setDishes] = useState<Dish[]>([]);

  useEffect(() => {
    // In a real application, this would be an API call
    setDishes([
      {
        id: 1,
        name: "Mama's Special Biryani",
        description: "A flavorful rice dish with tender chicken and aromatic spices",
        price: 12.99,
        image: "/images/biryani.jpg",
      },
      {
        id: 2,
        name: "Veggie Delight Pizza",
        description: "Crispy crust topped with fresh vegetables and melted cheese",
        price: 10.99,
        image: "/images/pizza.jpg",
      },
      {
        id: 3,
        name: "Homestyle Chicken Curry",
        description: "Rich and creamy curry with tender chicken pieces",
        price: 11.99,
        image: "/images/curry.jpg",
      },
    ]);
  }, []);

  return (
    <section className="py-16 bg-gray-50 dark:bg-gray-800">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-8">Featured Dishes</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {dishes.map((dish, index) => (
            <motion.div
              key={dish.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card>
                <CardContent className="p-0">
                  <Image
                    src={dish.image || "/placeholder.svg"}
                    alt={dish.name}
                    width={400}
                    height={300}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="text-xl font-semibold mb-2">{dish.name}</h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-2">{dish.description}</p>
                    <p className="text-lg font-bold">${dish.price.toFixed(2)}</p>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full">Add to Cart</Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
