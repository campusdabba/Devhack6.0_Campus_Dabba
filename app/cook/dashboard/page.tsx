"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/client";
import { formatDistance } from "date-fns";
import { Clock, MapPin, Users, UtensilsCrossed, IndianRupee, Star } from "lucide-react";

interface CookStats {
  totalEarnings: number;
  activeOrders: number;
  totalCustomers: number;
  averageRating: number;
}

interface Order {
  id: string;
  status: string;
  total: number;
  payment_status: string;
  created_at: string;
  user: {
    first_name: string;
    last_name: string;
  };
  order_items: {
    quantity: number;
    price_at_time: number;
    dabba_menu: {
      name: string;
      price: number;
    };
  }[];
}

interface MenuItem {
  id: string;
  name: string;
  price: number;
  description: string;
  is_available: boolean;
  category: string;
}

interface Review {
  id: string;
  rating: number;
  comment: string;
  created_at: string;
  user: {
    first_name: string;
    last_name: string;
  };
}

export default function CookDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [stats, setStats] = useState<CookStats>({
    totalEarnings: 0,
    activeOrders: 0,
    totalCustomers: 0,
    averageRating: 0
  });
  const [loading, setLoading] = useState(true);
  const [cookData, setCookData] = useState<any>(null);
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);

  useEffect(() => {
    fetchCookData();
    fetchRecentOrders();
    fetchMenuItems();
    fetchReviews();
  }, []);

  const fetchCookData = async () => {
    try {
      const supabase = createClient();
      const { data: { user }, error: authError } = await supabase.auth.getUser();

      if (authError || !user) {
        console.error("Auth error:", authError);
        return;
      }

      // First get the cook record using auth_user_id (not cook_id)
      const { data: cook, error: cookError } = await supabase
        .from("cooks")
        .select("*")
        .eq("auth_user_id", user.id)  // Fixed: should be auth_user_id
        .single();

      if (cookError) {
        console.error("Cook error:", cookError);
        return;
      }

      setCookData(cook);

      // Fetch stats data using the cook's ID from the cooks table
      await Promise.all([
        fetchTotalEarnings(cook.id),  // Use cook.id, not user.id
        fetchActiveOrders(cook.id),
        fetchTotalCustomers(cook.id),
        fetchAverageRating(cook.id)
      ]);

    } catch (error) {
      console.error("Error fetching cook data:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTotalEarnings = async (cookId: string) => {
    try {
      const supabase = createClient();
      // Fetch from orders table instead of payments table
      const { data: orders, error } = await supabase
        .from("orders")
        .select("total")
        .eq("cook_id", cookId)
        .eq("payment_status", "paid");  // Only count paid orders

      if (!error && orders) {
        const total = orders.reduce((sum, order) => sum + (order.total || 0), 0);
        setStats(prev => ({ ...prev, totalEarnings: total }));
      } else {
        console.error("Error fetching earnings:", error);
      }
    } catch (error) {
      console.error("Error fetching earnings:", error);
    }
  };

  const fetchActiveOrders = async (cookId: string) => {
    try {
      const supabase = createClient();
      const { data: orders, error } = await supabase
        .from("orders")
        .select("id")
        .eq("cook_id", cookId)
        .in("status", ["pending", "confirmed", "preparing", "ready"]);

      if (!error && orders) {
        setStats(prev => ({ ...prev, activeOrders: orders.length }));
      }
    } catch (error) {
      console.error("Error fetching active orders:", error);
    }
  };

  const fetchTotalCustomers = async (cookId: string) => {
    try {
      const supabase = createClient();
      const { data: orders, error } = await supabase
        .from("orders")
        .select("user_id")
        .eq("cook_id", cookId);

      if (!error && orders) {
        const uniqueCustomers = new Set(orders.map(order => order.user_id));
        setStats(prev => ({ ...prev, totalCustomers: uniqueCustomers.size }));
      }
    } catch (error) {
      console.error("Error fetching customers:", error);
    }
  };

  const fetchAverageRating = async (cookId: string) => {
    try {
      const supabase = createClient();
      // Assuming there's a reviews table with ratings
      const { data: reviews, error } = await supabase
        .from("reviews")
        .select("rating")
        .eq("cook_id", cookId);

      if (!error && reviews && reviews.length > 0) {
        const avgRating = reviews.reduce((sum, review) => sum + (review.rating || 0), 0) / reviews.length;
        setStats(prev => ({ ...prev, averageRating: Number(avgRating.toFixed(1)) }));
      } else {
        // Use cook's rating from cooks table as fallback
        if (cookData?.rating) {
          setStats(prev => ({ ...prev, averageRating: cookData.rating }));
        }
      }
    } catch (error) {
      console.error("Error fetching rating:", error);
    }
  };

  const fetchRecentOrders = async () => {
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: cook } = await supabase
        .from("cooks")
        .select("id")
        .eq("auth_user_id", user.id)
        .single();

      if (!cook) return;

      const { data: orders, error } = await supabase
        .from("orders")
        .select(`
          id,
          status,
          total,
          payment_status,
          created_at,
          user_id,
          order_items (
            quantity,
            price_at_time,
            dabba_menu:menu_id (
              name,
              price
            )
          )
        `)
        .eq("cook_id", cook.id)
        .order("created_at", { ascending: false })
        .limit(10);

      if (!error && orders) {
        // Fetch user details for each order
        const ordersWithUsers = await Promise.all(
          orders.map(async (order) => {
            const { data: userData } = await supabase
              .from("users")
              .select("first_name, last_name")
              .eq("id", order.user_id)
              .single();

            return {
              ...order,
              user: userData || { first_name: "Customer", last_name: `${order.user_id.slice(-4)}` }
            };
          })
        );
        setRecentOrders(ordersWithUsers as any);
      }
    } catch (error) {
      console.error("Error fetching recent orders:", error);
    }
  };

  const fetchMenuItems = async () => {
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: cook } = await supabase
        .from("cooks")
        .select("id")
        .eq("auth_user_id", user.id)
        .single();

      if (!cook) return;

      const { data: menu, error } = await supabase
        .from("dabba_menu")
        .select("*")
        .eq("cook_id", cook.id)
        .order("name");

      if (!error && menu) {
        setMenuItems(menu);
      }
    } catch (error) {
      console.error("Error fetching menu items:", error);
    }
  };

  const fetchReviews = async () => {
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: cook } = await supabase
        .from("cooks")
        .select("id")
        .eq("auth_user_id", user.id)
        .single();

      if (!cook) return;

      const { data: reviewsData, error } = await supabase
        .from("reviews")
        .select(`
          id,
          rating,
          comment,
          created_at,
          user_id
        `)
        .eq("cook_id", cook.id)
        .order("created_at", { ascending: false })
        .limit(20);

      if (!error && reviewsData) {
        // Fetch user details for each review
        const reviewsWithUsers = await Promise.all(
          reviewsData.map(async (review) => {
            const { data: userData } = await supabase
              .from("users")
              .select("first_name, last_name")
              .eq("id", review.user_id)
              .single();

            return {
              ...review,
              user: userData || { first_name: "Anonymous", last_name: "User" }
            };
          })
        );
        setReviews(reviewsWithUsers as Review[]);
      }
    } catch (error) {
      console.error("Error fetching reviews:", error);
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      <div className="container mx-auto py-6 space-y-6">
        {/* Header Section */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Cook Dashboard</h1>
            <p className="text-muted-foreground">Manage your kitchen and orders</p>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <IndianRupee className="h-8 w-8 text-primary" />
                <div>
                  <p className="text-sm font-medium">Total Earnings</p>
                  <h3 className="text-2xl font-bold">
                    {loading ? "Loading..." : `₹${stats.totalEarnings.toLocaleString()}`}
                  </h3>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <UtensilsCrossed className="h-8 w-8 text-primary" />
                <div>
                  <p className="text-sm font-medium">Active Orders</p>
                  <h3 className="text-2xl font-bold">
                    {loading ? "Loading..." : stats.activeOrders}
                  </h3>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <Users className="h-8 w-8 text-primary" />
                <div>
                  <p className="text-sm font-medium">Total Customers</p>
                  <h3 className="text-2xl font-bold">
                    {loading ? "Loading..." : stats.totalCustomers}
                  </h3>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <Star className="h-8 w-8 text-primary" />
                <div>
                  <p className="text-sm font-medium">Average Rating</p>
                  <h3 className="text-2xl font-bold">
                    {loading ? "Loading..." : `${stats.averageRating}/5`}
                  </h3>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Card className="flex-1">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <CardHeader>
              <TabsList>
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="orders">Orders</TabsTrigger>
                <TabsTrigger value="menu">Menu</TabsTrigger>
                <TabsTrigger value="reviews">Reviews</TabsTrigger>
              </TabsList>
            </CardHeader>
            <CardContent>
              <TabsContent value="overview">
                <div className="grid gap-4 md:grid-cols-2">
                  <Card>
                    <CardHeader>
                      <CardTitle>Kitchen Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        <span>
                          {loading 
                            ? "Loading address..." 
                            : cookData?.address 
                              ? `${cookData.address.street || ''}, ${cookData.address.city || ''}, ${cookData.address.state || ''} ${cookData.address.pincode || ''}`.trim()
                              : "Address not set"
                          }
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        <span>Operating Hours: 11 AM - 8 PM</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <UtensilsCrossed className="h-4 w-4" />
                        <span>
                          Cuisine: {loading 
                            ? "Loading..." 
                            : cookData?.cuisine_type || cookData?.cuisineType || "Not specified"
                          }
                        </span>
                      </div>
                      <Badge variant={cookData?.is_available ? "default" : "secondary"}>
                        {loading 
                          ? "Loading..." 
                          : cookData?.is_available || cookData?.isAvailable 
                            ? "Available" 
                            : "Unavailable"
                        }
                      </Badge>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle>Today's Menu Status</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ScrollArea className="h-[200px]">
                        {/* Menu items list */}
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span>Veg Thali</span>
                            <Badge>Active</Badge>
                          </div>
                          <div className="flex justify-between items-center">
                            <span>Dal Rice</span>
                            <Badge variant="outline">Sold Out</Badge>
                          </div>
                          {/* Add more menu items */}
                        </div>
                      </ScrollArea>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="orders">
                <ScrollArea className="h-[400px]">
                  <div className="space-y-4">
                    {loading ? (
                      <div className="text-center py-8">Loading orders...</div>
                    ) : recentOrders.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">
                        No recent orders found
                      </div>
                    ) : (
                      recentOrders.map((order) => (
                        <Card key={order.id} className="p-4">
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <h3 className="font-semibold">
                                Order #{order.id.slice(-8)}
                              </h3>
                              <p className="text-sm text-muted-foreground">
                                {order.user.first_name} {order.user.last_name}
                              </p>
                            </div>
                            <div className="text-right">
                              <Badge
                                variant={
                                  order.status === "delivered" ? "default" :
                                  order.status === "cancelled" ? "destructive" :
                                  order.status === "preparing" ? "secondary" : "outline"
                                }
                              >
                                {order.status}
                              </Badge>
                              <p className="text-sm font-medium mt-1">₹{order.total}</p>
                            </div>
                          </div>
                          <div className="space-y-2">
                            {order.order_items?.map((item, idx) => (
                              <div key={idx} className="flex justify-between text-sm">
                                <span>
                                  {item.quantity}x {item.dabba_menu?.name || 'Unknown Item'}
                                </span>
                                <span>₹{item.price_at_time || item.dabba_menu?.price || 0}</span>
                              </div>
                            ))}
                          </div>
                          <div className="flex justify-between items-center mt-3 pt-3 border-t">
                            <span className="text-sm text-muted-foreground">
                              {formatDistance(new Date(order.created_at), new Date(), { addSuffix: true })}
                            </span>
                            <Badge variant={order.payment_status === "paid" ? "default" : "secondary"}>
                              {order.payment_status}
                            </Badge>
                          </div>
                        </Card>
                      ))
                    )}
                  </div>
                </ScrollArea>
              </TabsContent>

              <TabsContent value="menu">
                <ScrollArea className="h-[400px]">
                  <div className="space-y-4">
                    {loading ? (
                      <div className="text-center py-8">Loading menu...</div>
                    ) : menuItems.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">
                        No menu items found
                        <div className="mt-2">
                          <Button variant="outline" asChild>
                            <Link href="/cook/menu">Add Menu Items</Link>
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="grid gap-4 md:grid-cols-2">
                        {menuItems.map((item) => (
                          <Card key={item.id} className="p-4">
                            <div className="flex justify-between items-start mb-2">
                              <h3 className="font-semibold">{item.name}</h3>
                              <Badge variant={item.is_available ? "default" : "secondary"}>
                                {item.is_available ? "Available" : "Unavailable"}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mb-2">
                              {item.description}
                            </p>
                            <div className="flex justify-between items-center">
                              <span className="font-medium">₹{item.price}</span>
                              <Badge variant="outline">{item.category}</Badge>
                            </div>
                          </Card>
                        ))}
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </TabsContent>

              <TabsContent value="reviews">
                <ScrollArea className="h-[400px]">
                  <div className="space-y-4">
                    {loading ? (
                      <div className="text-center py-8">Loading reviews...</div>
                    ) : reviews.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">
                        No reviews yet
                      </div>
                    ) : (
                      reviews.map((review) => (
                        <Card key={review.id} className="p-4">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h4 className="font-semibold">
                                {review.user.first_name} {review.user.last_name}
                              </h4>
                              <div className="flex items-center gap-1 mt-1">
                                {Array.from({ length: 5 }, (_, i) => (
                                  <Star
                                    key={i}
                                    className={`h-4 w-4 ${
                                      i < review.rating
                                        ? "fill-yellow-400 text-yellow-400"
                                        : "text-gray-300"
                                    }`}
                                  />
                                ))}
                                <span className="ml-2 text-sm text-muted-foreground">
                                  {review.rating}/5
                                </span>
                              </div>
                            </div>
                            <span className="text-sm text-muted-foreground">
                              {formatDistance(new Date(review.created_at), new Date(), { addSuffix: true })}
                            </span>
                          </div>
                          {review.comment && (
                            <p className="text-sm mt-2">{review.comment}</p>
                          )}
                        </Card>
                      ))
                    )}
                  </div>
                </ScrollArea>
              </TabsContent>
            </CardContent>
          </Tabs>
        </Card>
      </div>
    </div>
  );
}