<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> 071bc5d (v5)
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
import { toast } from "@/components/ui/use-toast";
<<<<<<< HEAD
import { Cook, MenuItem, CartItem, DayOfWeek, dayMapping } from "@/types";
import { useState, useEffect } from "react";
import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/client";

interface CooksListProps {
  selectedState: string;
}

interface CookWithMenu extends Cook {
  menuItems: MenuItem[];
=======
import { MenuItem, CartItem, DayOfWeek, dayMapping } from "@/types";
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

export interface Cook {
  id: string;
  cook_id: string;
  first_name: string;
  last_name: string;
  profile_image: string;
  price: number;
  rating: number;
  certification: string;
  address: Address;
  menuItems?: MenuItem[];
  totalOrders: number;
}

interface CookWithMenu extends Cook {
  menuItems?: MenuItem[];
}

interface CooksListProps {
  selectedState: string;
>>>>>>> 071bc5d (v5)
}

interface CartOperationResult {
  success: boolean;
  message: string;
}

<<<<<<< HEAD
const getCurrentDayNumber = (): DayOfWeek => {
  const day = new Date().getDay();
  return (day === 0 ? 7 : day) as DayOfWeek;
=======
const getCurrentDayNumber = () => {
  const today = new Date();
  const day = today.getDay() || 7; // Convert Sunday (0) to 7
  return dayMapping[day]; // Returns day name
>>>>>>> 071bc5d (v5)
};

export function CooksList({ selectedState }: CooksListProps) {
  const { cart, addToCart, removeFromCart } = useCart();
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const staticCooks = cooksByState[selectedState] || [];
  const [isLoading, setIsLoading] = useState(true);
<<<<<<< HEAD
  const [error, setError] = useState(null);
  const [cooks, setCooks] = useState([]);

  const fetchCooks = async () => {
    try {
      setIsLoading(true);
    const supabase = createClient();

   

    // Simple query to check all regions first
    const { data: allRegions } = await supabase
      .from("cooks")
      .select("region");
    
    console.log("All available regions:", allRegions);

    // Try both exact and partial matches
    const { data: cooksData, error: cooksError } = await supabase
      .from("cooks")
      .select(`
        id,
=======
  const [error, setError] = useState<string | null>(null);
  const [cooks, setCooks] = useState<Cook[]>([]);
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    const supabase = createClient();

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
    const supabase = createClient();
    try {
      setIsLoading(true);

      // Simple query to check all regions first
      const { data: allRegions } = await supabase
        .from("cooks")
        .select("region");

      console.log("All available regions:", allRegions);

      // Try both exact and partial matches
      const { data: cooksData, error: cooksError } = await supabase
        .from("cooks")
        .select(
          `
        id,
        cook_id,
>>>>>>> 071bc5d (v5)
        first_name,
        last_name,
        address,
        rating,
        certification,
        profile_image
<<<<<<< HEAD
      `)
      .or(`region.eq.${selectedState},region.ilike.%${selectedState}%`);

    console.log("Query params:", selectedState);
    console.log("Found cooks:", cooksData);
    
    if (cooksError) throw cooksError;
    if (!cooksData?.length) {
      setError("No cooks found for this location");
      return;
    }

      // Fetch menu items with debug logging
      const cookIds = cooksData.map((cook) => cook.id);
      console.log("Fetching menu items for cook IDs:", cookIds);

      const { data: menuData, error: menuError } = await supabase
        .from("dabba_menu")
        .select(
          `
          id,
          cook_id,
          item_name,
          description,
          price,
          day_of_week,
          dietary_type
        `
        )
        .in("cook_id", cookIds);

      console.log("Menu data:", menuData);
      console.log("Menu error:", menuError);

      if (menuError) throw menuError;

      // Process and set data
      const mergedCooks = staticCooks.map((staticCook) => {
        const dynamicCook = cooksData?.find((c) => c.id === staticCook.id);
        const cookMenuItems = menuData?.filter(
          (item) => item.cook_id === staticCook.id
        );

        return {
          ...staticCook,
          ...dynamicCook,
          name: dynamicCook
            ? `${dynamicCook.first_name} ${dynamicCook.last_name}`
            : staticCook.name,
          menuItems: cookMenuItems?.length
            ? cookMenuItems.map((item) => ({
                id: item.id,
                name: item.item_name,
                description: item.description,
                price: item.price,
                dayOfWeek: item.day_of_week,
                dietaryType: item.dietary_type,
              }))
            : staticCook.menuItems,
        };
      });

      console.log("Merged cooks:", mergedCooks);
      setCooks(mergedCooks);
    } catch (err) {
      console.error("Error fetching data:", err);
=======
      `
        )
        .or(`region.eq.${selectedState},region.ilike.%${selectedState}%`);

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
        .select("*")
        .in("cook_id", cookIdsArray);

      console.log("Menu data:", menuData);

      if (menuError) throw menuError;

      if (!menuData?.length) {
        console.warn(
          `No menu items found for cook IDs: ${cookIdsArray.join(", ")}`
        );
      }
      const processedCooks = cooksData.map((cook) => ({
        ...cook,
        id: cook.id,
        cook_id: cook.cook_id,
        first_name: cook.first_name,
        last_name: cook.last_name,
        price: menuData
          ?.filter((item) => item.cook_id === cook.cook_id)
          .reduce((total, item) => total + item.price, 0),
        profile_image: cook.profile_image,
        certification: cook.certification,
        totalOrders: 0,
        menuItems:
          menuData?.filter((item) => item.cook_id === cook.cook_id) || [],
      }));

      setCooks(processedCooks);

      console.log("Processed cooks:", processedCooks);
    } catch (error) {
      const err = error as Error;
      console.error(err.message);
>>>>>>> 071bc5d (v5)
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
    cart.forEach((item) => {
      newQuantities[item.id] = item.quantity;
    });
    setQuantities(newQuantities);
  }, [cart]);

  const getCartItemId = (cookId: string) =>
    `${cookId}-${getCurrentDayNumber()}`;

  const handleQuantityChange = (cook: CookWithMenu, change: number) => {
    const itemId = getCartItemId(cook.id);
    const currentQty = quantities[itemId] || 0;
    const newQty = Math.max(0, currentQty + change);

    if (change < 0) {
      handleRemoveFromCart(cook);
      return;
    }

    setQuantities((prev) => ({ ...prev, [itemId]: newQty }));

    const todayMenu = cook.menuItems.filter(
<<<<<<< HEAD
      (item) => item.dayOfWeek === getCurrentDayNumber()
=======
      (item) => item.day_of_week === getCurrentDayNumber()
>>>>>>> 071bc5d (v5)
    );

    const bundledMenu: CartItem = {
      id: itemId,
<<<<<<< HEAD
      cookId: cook.id,
      name: `${cook.name}'s ${dayMapping[getCurrentDayNumber()]} Dabba`,
      description: `${dayMapping[getCurrentDayNumber()]}'s special dabba`,
      price: todayMenu.reduce((total, item) => total + item.price, 0),
      dietaryType: todayMenu[0]?.dietaryType || "veg",
      cuisineType: todayMenu[0]?.cuisineType || "indian",
      mealType: "lunch",
      dayOfWeek: getCurrentDayNumber(),
=======
      cook_id: cook.cook_id,
      item_name: `${cook.first_name}'s ${
        dayMapping[getCurrentDayNumber()]
      } Dabba`,
      description: `${dayMapping[getCurrentDayNumber()]}'s special dabba`,
      price: todayMenu.reduce((total, item) => total + item.price, 0),
      dietary_type: todayMenu[0]?.dietary_type || "veg",
      cuisine_type: todayMenu[0]?.cuisine_type || "indian",
      meal_type: "lunch",
      day_of_week: getCurrentDayNumber(),
>>>>>>> 071bc5d (v5)
      isAvailable: true,
      quantity: newQty,
      menuItems: todayMenu,
    };

    addToCart(bundledMenu);
    setQuantities((prev) => ({ ...prev, [itemId]: newQty }));

    toast({
      title: "Added to cart",
<<<<<<< HEAD
      description: `${cook.name}'s ${
=======
      description: `${cook.first_name}'s ${
>>>>>>> 071bc5d (v5)
        dayMapping[getCurrentDayNumber()]
      } Dabba has been added to your cart.`,
    });
  };
  const handleRemoveFromCart = (cook: CookWithMenu) => {
    try {
      const cartItemId = `${cook.id}-${getCurrentDayNumber()}`;
      removeFromCart(cartItemId);
      toast({
        title: "Removed from cart",
<<<<<<< HEAD
        description: `${cook.name}'s ${
=======
        description: `${cook.first_name}'s ${
>>>>>>> 071bc5d (v5)
          dayMapping[getCurrentDayNumber()]
        } Dabba has been removed from your cart.`,
      });
    } catch (error) {
      console.error("Error removing from cart:", error);
      toast({
        title: "Error",
        description: "Failed to remove item from cart",
        variant: "destructive",
      });
    }
  };

  if (isLoading) return <div>Loading cooks...</div>;
<<<<<<< HEAD
  if (error) return <div>Error loading cooks: {error}</div>;
=======
=======
>>>>>>> origin/main
"use client"

import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import { Star, Plus, Minus, ShoppingCart } from "lucide-react"

import { cooksByState } from "@/lib/data/states"
import { useCart } from "@/components/providers/cart-provider"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { toast } from "@/components/ui/use-toast"

<<<<<<< HEAD
=======

>>>>>>> a6396a4 (Version lOLZ)
interface CooksListProps {
  selectedState: string
}

export function CooksList({ selectedState }: CooksListProps) {
  const cooks = cooksByState[selectedState as keyof typeof cooksByState] || []
  const { cart, addToCart, removeFromCart } = useCart()

  const handleAddToCart = (item: any) => {
    addToCart(item)
    toast({
      title: "Added to cart",
      description: `${item.name} has been added to your cart.`,
    })
  }

  const handleRemoveFromCart = (item: any) => {
    removeFromCart(item.id)
    toast({
      title: "Removed from cart",
      description: `${item.name} has been removed from your cart.`,
    })
  }

  if (cooks.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-muted-foreground">No cooks available in this state yet.</p>
      </div>
    )
  }
<<<<<<< HEAD
>>>>>>> 3be442bcdc62f9e590e91fd40a9f56038d458aa0
=======
>>>>>>> origin/main
=======

  const formatAddress = (address: Address): string => {
    return `${address.street}, ${address.city}, ${address.state} ${address.pincode}`;
  };

  const MenuItems = ({ cook, currentDay }) => {
    console.log("Current day:", currentDay);
    console.log("Menu items:", cook.menuItems);
    console.log("Day of week from item:", cook.menuItems[0]?.day_of_week);

    return (
      <ScrollArea className="h-48">
        <div className="space-y-2 border border-primary p-2 rounded-md">
          {cook.menuItems
            .filter((item) => {
              console.log(`Comparing ${item.day_of_week} with ${currentDay}`);
              return item.day_of_week === currentDay;
            })
            .map((item) => (
              <div key={item.id} className="mb-4 p-2 border-b last:border-0">
                <div className="flex justify-between items-start">
                  <div>
                    <h5 className="font-semibold">{item.item_name}</h5>
                    <p className="text-sm text-gray-600">{item.description}</p>
                  </div>
                  <div className="text-right">
                    <Badge variant="secondary">₹{item.price}</Badge>
                    <Badge variant="outline" className="ml-2">
                      {item.dietary_type}
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </ScrollArea>
    );
  };
>>>>>>> 071bc5d (v5)

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {cooks.map((cook) => (
<<<<<<< HEAD
        <Card key={cook.id} className="flex flex-col">
          <CardHeader>
            <div className="flex items-center gap-4">
<<<<<<< HEAD
<<<<<<< HEAD
              <AspectRatio ratio={1} className="h-20 w-20 flex-none">
                <Image
                  src={cook.profilePicture || "/placeholder-chef.jpg"}
                  alt={cook.name}
                  className="rounded-lg object-cover"
                  fill
                  sizes="80px"
=======
=======
>>>>>>> origin/main
              <AspectRatio ratio={1} className="w-12 flex-none">
                <Image
                  src={cook.profilePicture || "https://source.unsplash.com/random/100x100?chef"}
                  alt={cook.name}
                  className="rounded-full object-cover"
                  fill
                  sizes="48px"
<<<<<<< HEAD
>>>>>>> 3be442bcdc62f9e590e91fd40a9f56038d458aa0
=======
>>>>>>> origin/main
                />
              </AspectRatio>
              <div className="flex-1 space-y-1">
                <CardTitle className="text-lg">
                  <Link href={`/cooks/${cook.id}`} className="hover:underline">
                    {cook.name}
                  </Link>
                </CardTitle>
                <CardDescription>{cook.address}</CardDescription>
              </div>
              <div className="flex items-center gap-1 rounded-full bg-primary/10 px-2 py-1 text-sm">
                <Star className="h-4 w-4 fill-primary text-primary" />
                <span>{cook.rating}</span>
              </div>
            </div>
          </CardHeader>
<<<<<<< HEAD
<<<<<<< HEAD
          <CardContent className="flex-grow p-6">
=======
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
                      {cook.first_name}
                    </Link>
                  </CardTitle>
                  <CardDescription className="text-gray-200">
                    {cook.address
                      ? formatAddress(cook.address)
                      : "Address not available"}
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
>>>>>>> 071bc5d (v5)
            <div className="flex gap-2">
              <Badge variant="secondary">{cook.totalOrders}+ orders</Badge>
              {cook.certification && (
                <Badge variant="outline">{cook.certification}</Badge>
              )}
            </div>
            <Separator className="my-2" />
            <div className="space-y-2">
              <div className="space-y-2 border border-primary p-2 rounded-md">
                {" "}
                {/* Added outline */}
                <h4 className="text-xl font-bold text-primary">Dabba:</h4>
                <ScrollArea className="h-48">
                  <div className="space-y-2 border border-primary p-2 rounded-md">
                    {" "}
                    {/* Added outline */}
                    {cook.menuItems
                      .filter(
<<<<<<< HEAD
                        (item) => item.dayOfWeek === getCurrentDayNumber()
                      )
                      .map((item) => (
                        <div key={item.id} className="text-sm">
                          <div className="flex justify-between">
                            <span>{item.name}</span>
                            <span>₹{item.price}</span>
                          </div>
                          <p className="text-muted-foreground">
                            {item.description}
                          </p>
=======
                        (item) => item.day_of_week === getCurrentDayNumber()
                      )
                      .map((item) => (
                        <div
                          key={item.id}
                          className="mb-4 p-2 border-b last:border-0"
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <h5 className="font-semibold">
                                {item.item_name}
                              </h5>
                              <p className="text-sm text-gray-600">
                                {item.description}
                              </p>
                            </div>
                            <div className="text-right">
                              <Badge variant="secondary">₹{item.price}</Badge>
                              <Badge variant="outline" className="ml-2">
                                {item.dietary_type}
                              </Badge>
                            </div>
                          </div>
>>>>>>> 071bc5d (v5)
                        </div>
                      ))}
                  </div>
                  <ScrollBar orientation="vertical" />
                </ScrollArea>
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
<<<<<<< HEAD
=======
=======
>>>>>>> origin/main
          <CardContent className="flex-1">
            <div className="flex gap-2">
              <Badge variant="secondary">{cook.totalOrders}+ orders</Badge>
              {cook.certification && <Badge variant="outline">{cook.certification}</Badge>}
            </div>
            <Separator className="my-4" />
            <div className="space-y-2">
              <h4 className="font-medium">Today's Menu</h4>
              <ScrollArea className="h-[120px]">
                <div className="space-y-4">
                  {cook.menuItems.map((item) => (
                    <div key={item.id} className="flex items-center justify-between gap-4">
                      <div className="space-y-1">
                        <p className="text-sm font-medium leading-none">{item.name}</p>
                        <p className="text-sm text-muted-foreground">{item.description}</p>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <Badge variant="secondary" className="capitalize">
                          {item.dietaryType}
                        </Badge>
                        <p className="text-sm font-semibold">₹{item.price}</p>
                        <div className="flex items-center gap-2">
                          <Button
                            size="icon"
                            variant="outline"
                            className="h-8 w-8"
                            onClick={() => handleRemoveFromCart(item)}
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <span className="text-sm">
                            {cart.find((cartItem) => cartItem.id === item.id)?.quantity || 0}
                          </span>
                          <Button
                            size="icon"
                            variant="outline"
                            className="h-8 w-8"
                            onClick={() => handleAddToCart(item)}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <ScrollBar orientation="vertical" />
              </ScrollArea>
            </div>
          </CardContent>
          <CardFooter>
            <Button asChild className="w-full">
              <Link href={`/cooks/${cook.id}`}>View Full Menu</Link>
<<<<<<< HEAD
>>>>>>> 3be442bcdc62f9e590e91fd40a9f56038d458aa0
=======
>>>>>>> origin/main
=======
>>>>>>> 071bc5d (v5)
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> 071bc5d (v5)
  );

  function getTotalPrice(cook: CookWithMenu, quantity: number): number {
    return (
      cook.menuItems
<<<<<<< HEAD
        .filter((item) => item.dayOfWeek === getCurrentDayNumber())
=======
        .filter((item) => item.day_of_week === getCurrentDayNumber())
>>>>>>> 071bc5d (v5)
        .reduce((total, item) => total + item.price, 0) * quantity
    );
  }
}
<<<<<<< HEAD
=======
  )
}

>>>>>>> 3be442bcdc62f9e590e91fd40a9f56038d458aa0
=======
  )
}

>>>>>>> origin/main
=======
>>>>>>> 071bc5d (v5)
