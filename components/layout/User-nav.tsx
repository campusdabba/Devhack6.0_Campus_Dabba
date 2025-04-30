"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { LogOut, UserCircle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import { createClient } from "@/utils/supabase/client";
import { useEffect, useState } from "react";

interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  role?: string;
}

export function UserNav() {
  const router = useRouter();
  const { toast } = useToast();
  const supabase = createClient();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUser() {
      try {
        const { data: { user: authUser } } = await supabase.auth.getUser();
        if (!authUser) return;

        // Check if user is an admin
        const { data: isAdmin } = await supabase
          .rpc('is_admin', { input_user_id: authUser.id });

        if (isAdmin) {
          const { data: adminData } = await supabase
            .from('users')
            .select('first_name, last_name')
            .eq('id', authUser.id)
            .single();
          
          setUser({
            id: authUser.id,
            email: authUser.email || '',
            first_name: adminData?.first_name || '',
            last_name: adminData?.last_name || '',
            role: 'admin'
          });
          return;
        }

        // Check if user is a cook
        const { data: cook } = await supabase
          .from('cooks')
          .select('*')
          .eq('cook_id', authUser.id)
          .single();

        if (cook) {
          setUser({
            id: authUser.id,
            email: authUser.email || '',
            first_name: cook.first_name,
            last_name: cook.last_name,
            role: 'cook'
          });
          return;
        }

        // If not admin or cook, get user details
        const { data: userData } = await supabase
          .from('users')
          .select('*')
          .eq('id', authUser.id)
          .single();

        if (userData) {
          setUser({
            id: authUser.id,
            email: authUser.email || '',
            first_name: userData.first_name,
            last_name: userData.last_name,
            role: 'user'
          });
        }
      } catch (error) {
        console.error('Error fetching user:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchUser();
  }, []);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({
        title: "Error logging out",
        description: error.message,
        variant: "destructive",
      });
      return;
    }
    toast({
      title: "Logged out successfully",
      description: "You have been logged out of your account.",
    });
    router.push("/auth/login");
  };

  if (loading) {
    return (
      <Button variant="ghost" size="sm" disabled>
        <UserCircle className="h-5 w-5" />
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm">
          <UserCircle className="h-5 w-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>
          {user ? (
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">
                {user.first_name} {user.last_name}
              </p>
              <p className="text-xs leading-none text-muted-foreground">
                {user.email}
              </p>
            </div>
          ) : (
            "My Account"
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href={user?.role === 'admin' ? '/admin/dashboard' : user?.role === 'cook' ? '/cook/profile' : '/profile'}>
            Profile
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href={user?.role === 'admin' ? '/admin/settings' : user?.role === 'cook' ? '/cook/settings' : '/settings'}>
            Settings
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
