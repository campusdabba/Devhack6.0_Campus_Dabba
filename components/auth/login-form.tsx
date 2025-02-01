"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2 } from "lucide-react"
import { useForm } from "react-hook-form"
import * as z from "zod"
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
import { createClient } from "@/utils/supabase/client";
=======
<<<<<<< HEAD
=======
import { createClient } from "@/utils/supabase/client";
>>>>>>> a6396a4 (Version lOLZ)
>>>>>>> 3be442bcdc62f9e590e91fd40a9f56038d458aa0
=======
=======
import { createClient } from "@/utils/supabase/client";
>>>>>>> a6396a4 (Version lOLZ)
>>>>>>> origin/main
=======
import { createClient } from "@/utils/supabase/client";
>>>>>>> 071bc5d (v5)
=======
import { createClient } from "@/utils/supabase/client";
>>>>>>> ef737eb (V6)

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
import {  useToast} from "@/components/ui/use-toast"
=======
<<<<<<< HEAD
=======
>>>>>>> origin/main
import { useToast } from "@/components/ui/use-toast"
=======
import {  useToast} from "@/components/ui/use-toast"
>>>>>>> a6396a4 (Version lOLZ)
<<<<<<< HEAD
>>>>>>> 3be442bcdc62f9e590e91fd40a9f56038d458aa0
=======
>>>>>>> origin/main
=======
import {  useToast} from "@/components/ui/use-toast"
>>>>>>> 071bc5d (v5)
=======
import {  useToast} from "@/components/ui/use-toast"
>>>>>>> ef737eb (V6)

const formSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters.",
  }),
})

export function LoginForm() {
  const router = useRouter()
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
=======
<<<<<<< HEAD
=======
>>>>>>> origin/main
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

=======
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
>>>>>>> a6396a4 (Version lOLZ)
<<<<<<< HEAD
>>>>>>> 3be442bcdc62f9e590e91fd40a9f56038d458aa0
=======
>>>>>>> origin/main
=======
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
>>>>>>> 071bc5d (v5)
=======
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
>>>>>>> ef737eb (V6)
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
=======
<<<<<<< HEAD
=======
>>>>>>> origin/main
  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true)

    try {
      // Here we would typically make an API call to authenticate
      // For now, we'll simulate a successful login after a short delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: "Login successful!",
        description: "Welcome back to FoodConnect.",
      })

      router.push("/")
    } catch (error) {
      toast({
        title: "Something went wrong.",
        description: "Please check your credentials and try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
=======
<<<<<<< HEAD
>>>>>>> 3be442bcdc62f9e590e91fd40a9f56038d458aa0
=======
>>>>>>> origin/main
=======
>>>>>>> 071bc5d (v5)
=======
>>>>>>> ef737eb (V6)
  

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true)
    const supabase = await createClient()


    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: values.email,
        password: values.password,
      });
      
      if (error) {
        console.error('Supabase signIn error:', error);

        if (error.message.includes("Invalid login credentials")) {
          toast({
            title: "Invalid credentials",
            description: "The email or password you entered is incorrect.",
            variant: "destructive",
          });
        } else {
          toast({
            title: "Something went wrong.",
            description: error.message,
            variant: "destructive",
          });
        }
        return;
      }

      toast({
        title: "Login successful!",
        description: "Welcome back to CampusDabba.",
      });

      router.push("/");
    } catch (error) {
      console.error('Error during login:', error);
      toast({
        title: "Something went wrong.",
        description: "An unknown error occurred.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> a6396a4 (Version lOLZ)
>>>>>>> 3be442bcdc62f9e590e91fd40a9f56038d458aa0
=======
>>>>>>> a6396a4 (Version lOLZ)
>>>>>>> origin/main
=======
>>>>>>> 071bc5d (v5)
=======
>>>>>>> ef737eb (V6)
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
                <Input placeholder="john@example.com" type="email" {...field} />
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
          Sign In
        </Button>
      </form>
    </Form>
  )
}

