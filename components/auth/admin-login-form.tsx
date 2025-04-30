"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2 } from "lucide-react"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { createClient } from "@/utils/supabase/client"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"

const formSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters.",
  }),
})

export function AdminLoginForm() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log('Starting admin login process...');
    setIsLoading(true)
    const supabase = await createClient()

    try {
      console.log('Attempting to sign in...');
      const { data: { user }, error } = await supabase.auth.signInWithPassword({
        email: values.email,
        password: values.password,
      })
      
      if (error) {
        console.error('Sign in error:', error);
        toast({
          title: "Invalid credentials",
          description: "The email or password you entered is incorrect.",
          variant: "destructive",
        })
        setIsLoading(false);
        return;
      }

      if (!user) {
        console.error('No user returned from sign in');
        toast({
          title: "Sign in error",
          description: "No user returned from authentication.",
          variant: "destructive",
        })
        setIsLoading(false);
        return;
      }

      console.log('User signed in, checking admin status...');
      // Check if user is an admin
      const { data: isAdmin, error: adminError } = await supabase
        .rpc('is_admin', { input_user_id: user.id })

      console.log('Admin check result:', { isAdmin, adminError });

      if (adminError) {
        console.error('Admin check error:', adminError);
        toast({
          title: "Error",
          description: "Failed to verify admin status.",
          variant: "destructive",
        })
        setIsLoading(false);
        return;
      }

      if (!isAdmin) {
        console.log('User is not an admin');
        await supabase.auth.signOut()
        toast({
          title: "Access Denied",
          description: "You do not have admin privileges.",
          variant: "destructive",
        })
        setIsLoading(false);
        return;
      }

      console.log('Admin login successful, redirecting...');
      toast({
        title: "Login successful!",
        description: "Welcome to the admin dashboard.",
      })

      // Force a hard redirect to ensure the middleware runs
      window.location.href = '/admin/dashboard';
    } catch (error) {
      console.error('Unexpected error during login:', error);
      toast({
        title: "Something went wrong.",
        description: "An unknown error occurred.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="admin@example.com" type="email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input placeholder="********" type="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Sign In as Admin
        </Button>
      </form>
    </Form>
  )
} 