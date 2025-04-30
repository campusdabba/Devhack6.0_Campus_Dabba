"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { createClient } from "@/utils/supabase/client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";

// Stricter password requirements for admin accounts
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{12,}$/;

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email.",
  }),
  password: z.string().min(12, {
    message: "Password must be at least 12 characters.",
  }).regex(passwordRegex, {
    message: "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.",
  }),
  confirmPassword: z.string(),
  adminKey: z.string().min(1, {
    message: "Admin key is required.",
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export function AdminRegisterForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      adminKey: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log('Form submitted with values:', values);
    setIsLoading(true);

    try {
      console.log('Starting admin registration process...');
      const supabase = await createClient();
      console.log('Supabase client created');

      // First verify the admin key
      console.log('Verifying admin key:', values.adminKey);
      const { data: keyValid, error: keyError } = await supabase
        .rpc('verify_admin_key', { key_to_verify: values.adminKey });

      console.log('Key verification response:', { keyValid, keyError });

      if (keyError) {
        console.error('Admin key verification error:', keyError);
        toast({
          title: "Admin Key Error",
          description: keyError.message,
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      if (!keyValid) {
        console.error('Invalid admin key');
        toast({
          title: "Invalid Admin Key",
          description: "The admin key you provided is invalid or has expired.",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      console.log('Admin key verified, creating user account...');

      // Create the user account
      const { data: { user }, error: signUpError } = await supabase.auth.signUp({
        email: values.email,
        password: values.password,
        options: {
          data: {
            name: values.name,
            role: 'admin',
          },
          emailRedirectTo: `${window.location.origin}/auth/verify`,
        },
      });

      console.log('Sign up response:', { user, signUpError });

      if (signUpError) {
        console.error('Sign up error:', signUpError);
        toast({
          title: "Sign Up Error",
          description: signUpError.message,
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      if (!user) {
        console.error('No user returned from sign up');
        toast({
          title: "Sign Up Error",
          description: "Failed to create user account",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      console.log('User created, creating admin record...');

      // Create admin record
      const { error: adminError } = await supabase
        .rpc('create_admin', {
          admin_key: values.adminKey,
          user_id: user.id
        });

      console.log('Admin creation response:', { adminError });

      if (adminError) {
        console.error('Admin creation error:', adminError);
        toast({
          title: "Admin Creation Error",
          description: adminError.message,
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      console.log('Admin account created successfully');

      toast({
        title: "Admin account created",
        description: "Please check your email to verify your account.",
      });

      // Add resend verification button
      toast({
        title: "Didn't receive the email?",
        description: (
          <Button
            variant="link"
            className="p-0 h-auto"
            onClick={async () => {
              const { error } = await supabase.auth.resend({
                type: 'signup',
                email: values.email,
                options: {
                  emailRedirectTo: `${window.location.origin}/auth/verify`,
                },
              });
              if (error) {
                toast({
                  title: "Error resending email",
                  description: error.message,
                  variant: "destructive",
                });
              } else {
                toast({
                  title: "Verification email resent",
                  description: "Please check your inbox again.",
                });
              }
            }}
          >
            Click here to resend verification email
          </Button>
        ),
      });

      router.push("/auth/login");
    } catch (error) {
      console.error('Registration error:', error);
      if (error instanceof Error) {
        toast({
          title: "Something went wrong.",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Something went wrong.",
          description: "An unknown error occurred.",
          variant: "destructive",
        });
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name</FormLabel>
              <FormControl>
                <Input placeholder="John Doe" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
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
              <FormDescription>
                Password must be at least 12 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm Password</FormLabel>
              <FormControl>
                <Input placeholder="********" type="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="adminKey"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Admin Key</FormLabel>
              <FormControl>
                <Input placeholder="Enter admin key" type="password" {...field} />
              </FormControl>
              <FormDescription>
                This key is required to create an admin account.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Create Admin Account
        </Button>
      </form>
    </Form>
  );
} 