<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> 071bc5d (v5)
=======
>>>>>>> ef737eb (V6)
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import * as z from "zod";

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
import { createClient } from "@/utils/supabase/client";
<<<<<<< HEAD
<<<<<<< HEAD
=======
=======
>>>>>>> origin/main
"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2 } from "lucide-react"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { toast } from "@/components/ui/use-toast"

<<<<<<< HEAD
>>>>>>> 3be442bcdc62f9e590e91fd40a9f56038d458aa0
=======
>>>>>>> origin/main
=======
>>>>>>> 071bc5d (v5)
=======
>>>>>>> ef737eb (V6)
const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email.",
  }),
  phone: z.string().min(10, {
    message: "Please enter a valid phone number.",
  }),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters.",
  }),
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> 071bc5d (v5)
=======
>>>>>>> ef737eb (V6)
});

export function CookRegistrationForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
<<<<<<< HEAD
<<<<<<< HEAD
=======
=======
>>>>>>> origin/main
})

export function CookRegistrationForm() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
<<<<<<< HEAD
>>>>>>> 3be442bcdc62f9e590e91fd40a9f56038d458aa0
=======
>>>>>>> origin/main
=======
>>>>>>> 071bc5d (v5)
=======
>>>>>>> ef737eb (V6)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      password: "",
    },
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> 071bc5d (v5)
=======
>>>>>>> ef737eb (V6)
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);

    try {
      const supabase = await createClient();
      const { error } = await supabase.auth.signUp({
        email: values.email,
        password: values.password,
        options: {
          data: {
            first_name: values.name.split(" ")[0],
            last_name: values.name.split(" ")[1],
            phone: values.phone,
          },
        },
      });

      if (error) {
        throw error;
      }
      // Store registration data in localStorage
      const registrationData = {
        cook_name: values.name,
        cook_email: values.email,
        cook_phone: values.phone,
        cook_password: values.password,
      };
      localStorage.setItem(
        "registrationData",
        JSON.stringify(registrationData)
      );

      toast({
        title: "Registration started",
        description: "Please complete your profile setup.",
      });
      // Sign in the user immediately after registration
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: values.email,
        password: values.password,
      });

      if (signInError) {
        throw signInError;
      }

      // Redirect to the additional information page
      router.push("/cook/registration");
<<<<<<< HEAD
<<<<<<< HEAD
=======
=======
>>>>>>> origin/main
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true)

    try {
      // Here we would typically make an API call to register the cook
      await new Promise((resolve) => setTimeout(resolve, 2000))

      toast({
        title: "Registration successful!",
        description: "Please check your email to verify your account.",
      })

      router.push("/cook/verify")
<<<<<<< HEAD
>>>>>>> 3be442bcdc62f9e590e91fd40a9f56038d458aa0
=======
>>>>>>> origin/main
=======
>>>>>>> 071bc5d (v5)
=======
>>>>>>> ef737eb (V6)
    } catch (error) {
      toast({
        title: "Something went wrong.",
        description: "Please try again later.",
        variant: "destructive",
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
      });
    } finally {
      setIsLoading(false);
=======
      })
    } finally {
      setIsLoading(false)
>>>>>>> 3be442bcdc62f9e590e91fd40a9f56038d458aa0
=======
      })
    } finally {
      setIsLoading(false)
>>>>>>> origin/main
=======
      });
    } finally {
      setIsLoading(false);
>>>>>>> 071bc5d (v5)
=======
      });
    } finally {
      setIsLoading(false);
>>>>>>> ef737eb (V6)
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
              <FormLabel>Name</FormLabel>
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
                <Input placeholder="john@example.com" type="email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone Number</FormLabel>
              <FormControl>
                <Input placeholder="1234567890" {...field} />
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
              <FormDescription>At least 8 characters</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Create account
        </Button>
      </form>
    </Form>
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
  );
}
=======
  )
}

>>>>>>> 3be442bcdc62f9e590e91fd40a9f56038d458aa0
=======
  )
}

>>>>>>> origin/main
=======
  );
}
>>>>>>> 071bc5d (v5)
=======
  );
}
>>>>>>> ef737eb (V6)
