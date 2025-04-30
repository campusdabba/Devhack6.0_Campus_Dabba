"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useRouter } from "next/navigation";

interface Cook {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  cuisineType: string[];
}

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  available: boolean;
}

interface CartItem {
  menu_id: string;
  quantity: number;
  price: number;
  name: string;
}

export default function OrderPage() {
  const [cooks, setCooks] = useState<Cook[]>([]);
  const [selectedCook, setSelectedCook] = useState<string>("");
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    async function fetchCooks() {
      try {
        const { data, error } = await supabase
          .from('cooks')
          .select('id, first_name, last_name, email, cuisineType')
          .eq('isAvailable', true);

        if (error) throw error;
        setCooks(data || []);
      } catch (error: any) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      }
    }

    fetchCooks();
  }, []);

  useEffect(() => {
    async function fetchMenuItems() {
      if (!selectedCook) return;

      try {
        const { data, error } = await supabase
          .from('menu')
          .select('*')
          .eq('cook_id', selectedCook)
          .eq('available', true);

        if (error) throw error;
        setMenuItems(data || []);
      } catch (error: any) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      }
    }

    fetchMenuItems();
  }, [selectedCook]);

  const handleAddToCart = (item: MenuItem) => {
    const existingItem = cart.find(cartItem => cartItem.menu_id === item.id);
    
    if (existingItem) {
      setCart(cart.map(cartItem =>
        cartItem.menu_id === item.id
          ? { ...cartItem, quantity: cartItem.quantity + 1 }
          : cartItem
      ));
    } else {
      setCart([...cart, {
        menu_id: item.id,
        quantity: 1,
        price: item.price,
        name: item.name
      }]);
    }
  };

  const handleRemoveFromCart = (menuId: string) => {
    setCart(cart.filter(item => item.menu_id !== menuId));
  };

  const handleUpdateQuantity = (menuId: string, quantity: number) => {
    if (quantity < 1) {
      handleRemoveFromCart(menuId);
      return;
    }

    setCart(cart.map(item =>
      item.menu_id === menuId
        ? { ...item, quantity }
        : item
    ));
  };

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const handlePlaceOrder = async () => {
    if (!selectedCook || cart.length === 0) {
      toast({
        title: "Error",
        description: "Please select a cook and add items to your cart",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      // Get current user
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError) throw userError;
      if (!user) throw new Error("User not authenticated");

      const totalAmount = calculateTotal();

      // Create order
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: user.id,
          cook_id: selectedCook,
          status: 'pending',
          total: totalAmount
        })
        .select()
        .single();

      if (orderError) throw orderError;

      // Create order items
      const orderItems = cart.map(item => ({
        order_id: order.id,
        menu_id: item.menu_id,
        quantity: item.quantity,
        price_at_time: item.price
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) throw itemsError;

      // Create payment record
      const { error: paymentError } = await supabase
        .from('payments')
        .insert({
          student_id: user.id,
          cook_id: selectedCook,
          amount: totalAmount,
          status: 'completed',
          payment_method: 'manual'
        });

      if (paymentError) throw paymentError;

      // Create cook payment record
      const { error: cookPaymentError } = await supabase
        .from('cook_payments')
        .insert({
          cook_id: selectedCook,
          order_id: order.id,
          amount: totalAmount,
          status: 'pending'
        });

      if (cookPaymentError) throw cookPaymentError;

      toast({
        title: "Success",
        description: "Order placed successfully",
      });

      // Clear cart and redirect
      setCart([]);
      router.push('/orders');
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Place an Order</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Select Cook</CardTitle>
            <CardDescription>Choose a cook to order from</CardDescription>
          </CardHeader>
          <CardContent>
            <Select value={selectedCook} onValueChange={setSelectedCook}>
              <SelectTrigger>
                <SelectValue placeholder="Select a cook" />
              </SelectTrigger>
              <SelectContent>
                {cooks.map((cook) => (
                  <SelectItem key={cook.id} value={cook.id}>
                    {cook.first_name} {cook.last_name} - {cook.cuisineType.join(', ')}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        {selectedCook && (
          <Card>
            <CardHeader>
              <CardTitle>Menu Items</CardTitle>
              <CardDescription>Select items to add to your cart</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {menuItems.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h3 className="font-medium">{item.name}</h3>
                      <p className="text-sm text-gray-500">{item.description}</p>
                      <p className="text-lg font-semibold">₹{item.price}</p>
                    </div>
                    <Button onClick={() => handleAddToCart(item)}>
                      Add to Cart
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {cart.length > 0 && (
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Your Cart</CardTitle>
              <CardDescription>Review your order before placing it</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {cart.map((item) => (
                  <div key={item.menu_id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h3 className="font-medium">{item.name}</h3>
                      <p className="text-sm text-gray-500">₹{item.price} each</p>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleUpdateQuantity(item.menu_id, item.quantity - 1)}
                        >
                          -
                        </Button>
                        <span>{item.quantity}</span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleUpdateQuantity(item.menu_id, item.quantity + 1)}
                        >
                          +
                        </Button>
                      </div>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleRemoveFromCart(item.menu_id)}
                      >
                        Remove
                      </Button>
                    </div>
                  </div>
                ))}
                <div className="flex justify-between items-center pt-4 border-t">
                  <span className="text-lg font-semibold">Total: ₹{calculateTotal()}</span>
                  <Button onClick={handlePlaceOrder} disabled={loading}>
                    {loading ? "Placing Order..." : "Place Order"}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
} 