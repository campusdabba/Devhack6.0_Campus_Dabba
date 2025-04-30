"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Settings {
  delivery_fee: number;
  tax_percentage: number;
  platform_cut_percentage: number;
  minimum_order_amount: number;
}

interface AdminKey {
  id: string;
  key: string;
  created_at: string;
  expires_at: string;
  used: boolean;
}

export default function AdminSettingsPage() {
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState<Settings>({
    delivery_fee: 20,
    tax_percentage: 5,
    platform_cut_percentage: 10,
    minimum_order_amount: 100,
  });
  const { toast } = useToast();
  const supabase = createClient();
  const [adminKeys, setAdminKeys] = useState<AdminKey[]>([]);

  useEffect(() => {
    async function fetchSettings() {
      try {
        const { data, error } = await supabase
          .from('settings')
          .select('*')
          .single();

        if (error) throw error;
        if (data) {
          setSettings(data);
        }
      } catch (error) {
        console.error('Error fetching settings:', error);
      }
    }

    fetchSettings();
  }, []);

  const handleUpdateSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase
        .from('settings')
        .upsert(settings);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Settings updated successfully",
      });
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

  const fetchAdminKeys = async () => {
    try {
      // Use service role client for admin operations
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from('admin_keys')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAdminKeys(data || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const generateAdminKey = async () => {
    setLoading(true);
    try {
      // Use service role client for admin operations
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("Not authenticated");

      // Generate a random key
      const key = `admin_key_${Math.random().toString(36).substring(2, 15)}`;
      
      // Set expiration to 30 days from now
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 30);

      const { data, error } = await supabase
        .from('admin_keys')
        .insert({
          key,
          expires_at: expiresAt.toISOString(),
          used: false,
          created_by: session.user.id
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Success",
        description: "Admin key generated successfully",
      });

      // Refresh the list
      fetchAdminKeys();
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

  // Fetch admin keys on component mount
  useEffect(() => {
    fetchAdminKeys();
  }, []);

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Business Settings</h1>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Order Settings</CardTitle>
            <CardDescription>Configure order-related business settings</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleUpdateSettings} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="minimumOrderAmount">Minimum Order Amount (₹)</Label>
                <Input
                  id="minimumOrderAmount"
                  type="number"
                  value={settings.minimum_order_amount}
                  onChange={(e) => setSettings({ ...settings, minimum_order_amount: Number(e.target.value) })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="deliveryFee">Delivery Fee (₹)</Label>
                <Input
                  id="deliveryFee"
                  type="number"
                  value={settings.delivery_fee}
                  onChange={(e) => setSettings({ ...settings, delivery_fee: Number(e.target.value) })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="taxPercentage">Tax Percentage (%)</Label>
                <Input
                  id="taxPercentage"
                  type="number"
                  value={settings.tax_percentage}
                  onChange={(e) => setSettings({ ...settings, tax_percentage: Number(e.target.value) })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="platformCut">Platform Cut Percentage (%)</Label>
                <Input
                  id="platformCut"
                  type="number"
                  value={settings.platform_cut_percentage}
                  onChange={(e) => setSettings({ ...settings, platform_cut_percentage: Number(e.target.value) })}
                />
              </div>
              <Button type="submit" disabled={loading}>
                {loading ? "Saving..." : "Save Changes"}
              </Button>
            </form>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Admin Keys</CardTitle>
            <CardDescription>Generate and manage admin registration keys</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-6">
              <Button onClick={generateAdminKey} disabled={loading}>
                {loading ? "Generating..." : "Generate New Admin Key"}
              </Button>
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Key</TableHead>
                  <TableHead>Created At</TableHead>
                  <TableHead>Expires At</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {adminKeys.map((adminKey) => (
                  <TableRow key={adminKey.id}>
                    <TableCell className="font-mono">{adminKey.key}</TableCell>
                    <TableCell>{new Date(adminKey.created_at).toLocaleDateString()}</TableCell>
                    <TableCell>{new Date(adminKey.expires_at).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        adminKey.used 
                          ? 'bg-gray-100 text-gray-800' 
                          : new Date(adminKey.expires_at) > new Date()
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                      }`}>
                        {adminKey.used 
                          ? 'Used' 
                          : new Date(adminKey.expires_at) > new Date()
                            ? 'Active'
                            : 'Expired'
                        }
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 