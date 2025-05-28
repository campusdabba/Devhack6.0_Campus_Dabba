"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { Star, Plus, Minus, ShoppingCart } from "lucide-react";

import { cooksByState } from "@/lib/data/states";
import { useCart } from "@/components/providers/cart-provider";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { MenuItem, CartItem, DayOfWeek, dayMapping, Cook } from "./types";
import { useState, useEffect } from "react";
import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/client";
import { Session } from "@supabase/supabase-js";

interface Address {
  city: string;
  state: string;
  street: string;
  pincode: string;
}

interface ExtendedCook extends Omit<Cook, 'address'> {
  cook_id: string;
  first_name: string;
  last_name: string;
  profile_image: string;
  total_orders: number;
  certification?: string;
  menuItems: MenuItem[];
  address: string;
  created_at: string;
  totalOrders: number;
}

interface CooksListProps {
  selectedState: string;
}

interface CartOperationResult {
  success: boolean;
  message: string;
}

const getCurrentDayNumber = (): DayOfWeek => {
  const today = new Date();
  const dayNumber = today.getDay() || 7; // Convert Sunday (0) to 7
  return dayNumber.toString() as DayOfWeek;
};

const getDayName = (day: DayOfWeek): string => {
  return dayMapping[day] || "Unknown";
};

// Add a helper function to normalize day values for comparison
const normalizeDayOfWeek = (day: string | number | undefined): string => {
  if (!day) return "";
  
  // If it's already a number string (1-7), return as is
  if (typeof day === "string" && /^[1-7]$/.test(day)) {
    return day;
  }
  
  // Convert number to string
  if (typeof day === "number") {
    return day.toString();
  }
  
  // Handle day names (Monday, Tuesday, etc.)
  const dayNameMap: Record<string, string> = {
    "monday": "1",
    "tuesday": "2", 
    "wednesday": "3",
    "thursday": "4",
    "friday": "5",
    "saturday": "6",
    "sunday": "7"
  };
  
  const lowercaseDay = day.toString().toLowerCase();
  return dayNameMap[lowercaseDay] || day.toString();
};

export function CooksList({ selectedState }: CooksListProps) {
  const { cart, addToCart, removeFromCart } = useCart();
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cooks, setCooks] = useState<Cook[]>([]);
  const [session, setSession] = useState<Session | null>(null);
  const supabase = createClient();

  // Debug: Log the current day number
  console.log("Current day number:", getCurrentDayNumber());

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchCooks = async () => {
    try {
      setIsLoading(true);
      setCooks([]);

      // Simple query to check all regions first
      const { data: allRegions } = await supabase
        .from("cooks")
        .select("region");

      console.log("All available regions:", allRegions);

      let cooksQuery = supabase
        .from("cooks")
        .select(`
          id,
          cook_id,
          first_name,
          last_name,
          address,
          rating,
          certification,
          profile_image,
          email,
          phone,
          description,
          isAvailable,
          region,
          totalorders,
          weeklySchedule,
          cuisineType,
          latitude,
          longitude
        `);

      // Try both exact and partial matches
      if (selectedState !== "All States") {
        cooksQuery = cooksQuery.or(`region.eq.${selectedState},region.ilike.%${selectedState}%`);
      }

      const { data: cooksData, error: cooksError } = await cooksQuery;

      console.log("Query params:", selectedState);
      console.log("Found cooks:", cooksData);

      if (cooksError) {
        console.error("Supabase error:", cooksError);
        setError("Error fetching cooks");
        return;
      }

      if (!cooksData || cooksData.length === 0) {
        console.log("No cooks found in data:", cooksData);
        setError("No cooks found for this location");
        return;
      }

      // Fetch menu items with debug logging
      const cookIds = cooksData.map((cook) => cook.cook_id);
      const cookIdsArray = Array.isArray(cookIds) ? cookIds : [cookIds];

      if (!cookIdsArray.length) {
        console.error("No cook IDs to query");
        return;
      }

      console.log("Fetching menu items for cook IDs:", cookIdsArray);

      const { data: menuData, error: menuError } = await supabase
        .from("dabba_menu")
        .select(`
          id,
          cook_id,
          item_name,
          description,
          price,
          meal_type,
          dietary_type,
          day_of_week,
          created_at
        `)
        .in("cook_id", cookIdsArray);

      console.log("Raw menu data:", menuData);
      
      // Add debug logging for day_of_week values
      if (menuData && menuData.length > 0) {
        console.log("Sample day_of_week values:", menuData.map(item => item.day_of_week));
        console.log("Current day for comparison:", getCurrentDayNumber());
      }

      if (menuError) {
        console.error("Menu fetch error:", menuError);
        throw menuError;
      }

      if (!menuData?.length) {
        console.warn(
          `No menu items found for cook IDs: ${cookIdsArray.join(", ")}`
        );
      }

      const processedCooks = cooksData.map((cook) => {
        const cookMenuItems = menuData?.filter((item) => item.cook_id === cook.cook_id) || [];
        console.log(`Menu items for cook ${cook.cook_id}:`, cookMenuItems);

        // Use normalized day values when filtering
        const currentDay = getCurrentDayNumber();
        const todayMenu = cookMenuItems.filter(item => 
          normalizeDayOfWeek(item.day_of_week) === normalizeDayOfWeek(currentDay)
        );
        
        console.log(`Today's menu for ${cook.first_name}:`, todayMenu);
        const totalPrice = todayMenu.reduce((total, item) => total + parseFloat(item.price), 0);

        return {
        ...cook,
        id: cook.id,
        cook_id: cook.cook_id,
        first_name: cook.first_name,
        last_name: cook.last_name,
          price: totalPrice,
        profile_image: cook.profile_image,
        certification: cook.certification,
          totalorders: cook.totalorders || 0,
          menuItems: cookMenuItems.map(item => ({
            id: item.id,
            cook_id: item.cook_id,
            item_name: item.item_name,
            description: item.description,
            price: parseFloat(item.price),
            day_of_week: item.day_of_week as DayOfWeek,
            dietary_type: item.dietary_type,
            meal_type: item.meal_type,
            created_at: item.created_at,
            // Add a normalized day for easier comparison
            normalizedDay: normalizeDayOfWeek(item.day_of_week)
          }))
        };
      });

      console.log("Final processed cooks with menu items:", processedCooks);
      setCooks(processedCooks);
    } catch (error) {
      const err = error as Error;
      console.error(err.message);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCooks();
  }, [selectedState]);

  useEffect(() => {
    const newQuantities: Record<string, number> = {};
    cart.forEach((item: CartItem) => {
      newQuantities[item.id] = item.quantity;
    });
    setQuantities(newQuantities);
  }, [cart]);

  if (isLoading) {
    return <div>Loading cooks...</div>;
  }

  if (error) {
    return (
      <div className="text-red-500">
        <p>Error: {error}</p>
        <button 
          onClick={() => fetchCooks()} 
          className="mt-2 px-4 py-2 bg-blue-500 text-white rounded"
        >
          Retry
        </button>
      </div>
    );
  }

  if (cooks.length === 0) {
    return <div>No cooks found for {selectedState}</div>;
  }

  const getCartItemId = (cookId: string) =>
    `${cookId}-${getCurrentDayNumber()}`;

  const handleQuantityChange = (cook: Cook, change: number) => {
    const itemId = getCartItemId(cook.id);
    const currentQty = quantities[itemId] || 0;
    const newQty = Math.max(0, currentQty + change);

    if (change < 0) {
      handleRemoveFromCart(cook);
      return;
    }

    setQuantities((prev) => ({ ...prev, [itemId]: newQty }));

    const todayMenu = cook.menuItems.filter(
      (item: MenuItem) => item.day_of_week === getCurrentDayNumber()
    );

    const bundledMenu: CartItem = {
      id: itemId,
      cook_id: cook.cook_id,
      item_name: `${cook.first_name} ${cook.last_name}'s ${getDayName(getCurrentDayNumber())} Dabba`,
      description: `${getDayName(getCurrentDayNumber())}'s special dabba`,
      price: todayMenu.reduce((total: number, item: MenuItem) => total + item.price, 0),
      dietary_type: todayMenu[0]?.dietary_type || "veg",
      meal_type: "lunch",
      day_of_week: getCurrentDayNumber(),
      quantity: newQty
    };

    addToCart(bundledMenu);
    setQuantities((prev) => ({ ...prev, [itemId]: newQty }));

    toast(`${cook.first_name} ${cook.last_name}'s ${getDayName(getCurrentDayNumber())} Dabba has been added to your cart.`);
  };

  const handleRemoveFromCart = (cook: Cook) => {
    try {
      const cartItemId = `${cook.id}-${getCurrentDayNumber()}`;
      removeFromCart(cartItemId);
      toast(`${cook.first_name} ${cook.last_name}'s ${getDayName(getCurrentDayNumber())} Dabba has been removed from your cart.`);
    } catch (error) {
      console.error("Error removing from cart:", error);
      toast("Failed to remove item from cart");
    }
  };

  const formatAddress = (address: Address): string => {
    if (!address) return "Address not available";
    const parts = [];
    if (address.street) parts.push(address.street);
    if (address.city) parts.push(address.city);
    if (address.state) parts.push(address.state);
    if (address.pincode) parts.push(address.pincode);
    return parts.join(", ") || "Address not available";
  };

  const MenuItems = ({ cook }: { cook: Cook }) => {
    const currentDay = getCurrentDayNumber();
    console.log(`MenuItems component - currentDay: ${currentDay}`);
    console.log(`Cook ${cook.first_name}'s menu items:`, cook.menuItems);
    
    // Use the normalized day for filtering
    const todayItems = cook.menuItems.filter(item => {
      // Add debug for each item
      const normalizedItemDay = normalizeDayOfWeek(item.day_of_week);
      const normalizedCurrentDay = normalizeDayOfWeek(currentDay);
      console.log(`Item: ${item.item_name}, day: ${item.day_of_week}, normalized: ${normalizedItemDay}, matches: ${normalizedItemDay === normalizedCurrentDay}`);
      
      return normalizedItemDay === normalizedCurrentDay;
    });
    
    console.log(`Today's items for ${cook.first_name}:`, todayItems);
    
    if (todayItems.length === 0) {
      return <p className="text-sm text-muted-foreground">No items available today</p>;
    }

    return (
      <div className="space-y-2">
        {todayItems.map(item => (
          <div key={item.id} className="flex justify-between items-center">
                  <div>
              <span className="text-sm font-medium">{item.item_name}</span>
              <p className="text-xs text-muted-foreground">{item.description}</p>
                  </div>
                  <div className="text-right">
                    <Badge variant="secondary">₹{item.price}</Badge>
              <Badge variant="outline" className="ml-2">{item.dietary_type}</Badge>
                </div>
              </div>
            ))}
        </div>
    );
  };

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {cooks.map((cook) => (
        <Card key={cook.cook_id} className="flex flex-col">
          <CardHeader className="relative min-h-[200px] flex flex-col justify-end p-6 text-white">
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage: `url(${
                  cook.profile_image || "/placeholder-chef.jpg"
                })`,
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/20" />
            <div className="relative z-10">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-lg">
                    <Link
                      href={`/cooks/${cook.id}`}
                      className="hover:underline"
                    >
                      {cook.first_name} {cook.last_name}
                    </Link>
                  </CardTitle>
                  <CardDescription className="text-gray-200">
                    {formatAddress(cook.address)}
                  </CardDescription>
                </div>
                <div className="flex items-center gap-1 rounded-full bg-white/20 backdrop-blur px-2 py-1 text-sm">
                  <Star className="h-4 w-4 fill-white text-white" />
                  <span>{cook.rating}</span>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-2 px-6 pb-1">
            <div className="flex gap-2">
              <Badge variant="secondary">{cook.totalorders}+ orders</Badge>
              {cook.certification && (
                <Badge variant="outline">{Object.keys(cook.certification)[0]}</Badge>
              )}
            </div>
            <Separator className="my-2" />
            <div className="space-y-2">
              <div className="space-y-2 border border-primary p-2 rounded-md">
                <h4 className="text-xl font-bold text-primary">Today's Dabba:</h4>
                <MenuItems cook={cook} />
              </div>
              <div className="flex justify-between items-center">
                <p className="font-semibold">
                  Total: ₹
                  {getTotalPrice(cook, quantities[getCartItemId(cook.id)] || 0)}
                </p>
                <div className="flex items-center gap-2">
                  {quantities[getCartItemId(cook.id)] ? (
                    <>
                      <Button
                        size="icon"
                        variant="outline"
                        onClick={() => handleRemoveFromCart(cook)}
                      >
                        -
                      </Button>
                      <span className="w-8 text-center">
                        {quantities[getCartItemId(cook.id)]}
                      </span>
                      <Button
                        size="icon"
                        variant="outline"
                        onClick={() => handleQuantityChange(cook, 1)}
                      >
                        +
                      </Button>
                    </>
                  ) : (
                    <Button onClick={() => handleQuantityChange(cook, 1)}>
                      Add Today's Dabba
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="mt-2">
            <Button asChild className="w-full">
              <Link href={`/cooks/${cook.id}`}>View Details</Link>
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );

  // Update getTotalPrice to use normalized day comparison
  function getTotalPrice(cook: Cook, quantity: number): number {
    return (
      cook.menuItems
        .filter((item: MenuItem) => 
          normalizeDayOfWeek(item.day_of_week) === normalizeDayOfWeek(getCurrentDayNumber())
        )
        .reduce((total: number, item: MenuItem) => total + item.price, 0) * quantity
    );
  }
}