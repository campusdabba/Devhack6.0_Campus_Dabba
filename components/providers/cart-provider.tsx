"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
<<<<<<< HEAD
<<<<<<< HEAD
import { CartContextType, CartItem, MenuItem } from '@/types'


=======
<<<<<<< HEAD
=======
>>>>>>> origin/main
import type { MenuItem } from "@/types"

interface CartItem extends MenuItem {
  quantity: number
}

interface CartContextType {
  cart: CartItem[]
  addToCart: (item: MenuItem) => void
  removeFromCart: (itemId: string) => void
  clearCart: () => void
  getCartTotal: () => number
}
=======
import { CartContextType, CartItem, MenuItem } from '@/types'


>>>>>>> a6396a4 (Version lOLZ)
<<<<<<< HEAD
>>>>>>> 3be442bcdc62f9e590e91fd40a9f56038d458aa0
=======
>>>>>>> origin/main

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([])

  useEffect(() => {
    const savedCart = localStorage.getItem("cart")
    if (savedCart) {
      setCart(JSON.parse(savedCart))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart))
  }, [cart])

  const addToCart = (item: MenuItem) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((cartItem) => cartItem.id === item.id)
      if (existingItem) {
        return prevCart.map((cartItem) =>
          cartItem.id === item.id ? { ...cartItem, quantity: cartItem.quantity + 1 } : cartItem,
        )
      }
      return [...prevCart, { ...item, quantity: 1 }]
    })
  }

  const removeFromCart = (itemId: string) => {
    setCart((prevCart) =>
      prevCart.reduce((acc, item) => {
        if (item.id === itemId) {
          if (item.quantity > 1) {
            acc.push({ ...item, quantity: item.quantity - 1 })
          }
        } else {
          acc.push(item)
        }
        return acc
      }, [] as CartItem[]),
    )
  }

  const clearCart = () => {
    setCart([])
  }

<<<<<<< HEAD
=======
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> 3be442bcdc62f9e590e91fd40a9f56038d458aa0
=======
>>>>>>> origin/main
  const updateQuantity = (id: string, quantity: number) => {
    setCart(prev => prev.map(i => 
      i.id === id ? {...i, quantity} : i
    ))
  }

<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> a6396a4 (Version lOLZ)
>>>>>>> 3be442bcdc62f9e590e91fd40a9f56038d458aa0
=======
>>>>>>> a6396a4 (Version lOLZ)
>>>>>>> origin/main
  const getCartTotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0)
  }

  return (
<<<<<<< HEAD
<<<<<<< HEAD
    <CartContext.Provider value={{ cart, addToCart, removeFromCart,updateQuantity, clearCart, getCartTotal }}>
=======
<<<<<<< HEAD
=======
>>>>>>> origin/main
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart, getCartTotal }}>
=======
    <CartContext.Provider value={{ cart, addToCart, removeFromCart,updateQuantity, clearCart, getCartTotal }}>
>>>>>>> a6396a4 (Version lOLZ)
<<<<<<< HEAD
>>>>>>> 3be442bcdc62f9e590e91fd40a9f56038d458aa0
=======
>>>>>>> origin/main
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}

