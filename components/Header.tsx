import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { ShoppingCart, User, Search, MapPin, Users } from "lucide-react"
import { Button } from "./ui/button"
import { Input } from "./ui/input"

const Header: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [address, setAddress] = useState("Current Location")

  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold text-primary">
          CampusDabba
        </Link>
        <div className="hidden md:flex items-center space-x-4">
          <div className="relative">
            <Input type="text" placeholder="Search for dishes or cooks" className="pl-10 pr-4 py-2 w-64" />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
          <div className="flex items-center space-x-2">
            <MapPin className="text-primary" />
            <span className="text-sm">{address}</span>
          </div>
          <Link href="/community" className="flex items-center space-x-2">
            <Users className="text-primary" />
            <span className="text-sm">Community</span>
          </Link>
          <Link href="/cart" className="relative">
            <ShoppingCart className="text-primary" />
            <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
              3
            </span>
          </Link>
          {isLoggedIn ? (
            <Link href="/account" className="flex items-center space-x-2">
              <User className="text-primary" />
              <span className="text-sm">Account</span>
            </Link>
          ) : (
            <Button variant="outline" onClick={() => setIsLoggedIn(true)}>
              Sign In
            </Button>
          )}
        </div>
      </div>
    </header>
  )
}

export default Header

