"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/client";
import { Clock, MapPin, Users, UtensilsCrossed, IndianRupee, Star } from "lucide-react";

interface CookStats {
  totalEarnings: number;
  activeOrders: number;
  totalCustomers: number;
  averageRating: number;
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

  useEffect(() => {
    fetchCookData();
  }, []);

  const fetchCookData = async () => {
    try {
      const supabase = createClient();
      const { data: { user }, error: authError } = await supabase.auth.getUser();

      if (authError || !user) {
        console.error("Auth error:", authError);
        return;
      }

      // Fetch cook data
      const { data: cook, error: cookError } = await supabase
        .from("cooks")
        .select("*")
        .eq("cook_id", user.id)
        .single();

      if (cookError) {
        console.error("Cook error:", cookError);
        return;
      }

      setCookData(cook);

      // Fetch stats data
      await Promise.all([
        fetchTotalEarnings(user.id),
        fetchActiveOrders(user.id),
        fetchTotalCustomers(user.id),
        fetchAverageRating(user.id)
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
      const { data: payments, error } = await supabase
        .from("payments")
        .select("amount")
        .eq("cook_id", cookId)
        .eq("status", "completed");

      if (!error && payments) {
        const total = payments.reduce((sum, payment) => sum + (payment.amount || 0), 0);
        setStats(prev => ({ ...prev, totalEarnings: total }));
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
                  {/* Orders list */}
                  <div className="space-y-4">
                    {/* Add order items here */}
                  </div>
                </ScrollArea>
              </TabsContent>

              <TabsContent value="menu">
                <ScrollArea className="h-[400px]">
                  {/* Weekly menu management */}
                  <div className="space-y-4">
                    {/* Add menu management here */}
                  </div>
                </ScrollArea>
              </TabsContent>

              <TabsContent value="reviews">
                <ScrollArea className="h-[400px]">
                  {/* Customer reviews */}
                  <div className="space-y-4">
                    {/* Add reviews here */}
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