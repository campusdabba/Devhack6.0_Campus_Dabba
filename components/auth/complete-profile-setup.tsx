<<<<<<< HEAD
<<<<<<< HEAD
import { ChangeEvent, useEffect, useState } from "react";
=======
import { useEffect, useState } from "react";
>>>>>>> 3be442bcdc62f9e590e91fd40a9f56038d458aa0
=======
import { useEffect, useState } from "react";
>>>>>>> origin/main
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { toast } from "@/components/ui/use-toast";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";

const formSchema = z.object({
  first_name: z.string(),
  last_name: z.string(),
  email: z.string().email(),
  phone: z.string(),
  street: z.string().min(3, "Street address is required"),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State is required"),
  pincode: z.string().min(6, "Valid pincode required"),
<<<<<<< HEAD
<<<<<<< HEAD
  password: z.string().optional(),
=======
>>>>>>> 3be442bcdc62f9e590e91fd40a9f56038d458aa0
=======
>>>>>>> origin/main
});

export default function CompleteProfileSetup() {
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  useEffect(() => {
    const registrationData = localStorage.getItem("registrationData");
    if (registrationData) {
      const parsedData = JSON.parse(registrationData);
      const [firstName, lastName] = parsedData.name.split(" ");
      form.setValue("first_name", firstName);
      form.setValue("last_name", lastName || "");
      form.setValue("email", parsedData.email);
      form.setValue("phone", parsedData.phone);
<<<<<<< HEAD
<<<<<<< HEAD
      form.setValue("password", parsedData.password);
    }
  }, [form]);

  const handleImageUpload = async (file: File) => {
    try {
      if (!file) {
        throw new Error("Please select a file");
      }

      const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
      if (!allowedTypes.includes(file.type)) {
        throw new Error("Please upload a valid image file (JPG or PNG)");
      }

      setIsUploading(true);
      const supabase = createClient();

      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      // Create folder structure with user ID
      const fileExt = file.name.split(".").pop();
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;

      const { error } = await supabase.storage
        .from("profile-images")
        .upload(fileName, file, {
          cacheControl: "3600",
          upsert: true,
        });

      if (error) throw error;

      // Get public URL
      const {
        data: { publicUrl },
      } = supabase.storage.from("profile-images").getPublicUrl(fileName);
=======
=======
>>>>>>> origin/main
    }
  }, [form]);

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const file = event.target.files?.[0];
      if (!file) return;

      setIsUploading(true);
      const supabase = await createClient();

      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;

      const { data, error } = await supabase.storage
        .from('profile-images')
        .upload(fileName, file);

      if (error) throw error;

      const { data: { publicUrl } } = supabase.storage
        .from('profile-images')
        .getPublicUrl(fileName);
<<<<<<< HEAD
>>>>>>> 3be442bcdc62f9e590e91fd40a9f56038d458aa0
=======
>>>>>>> origin/main

      setImageUrl(publicUrl);
      toast({
        title: "Success",
        description: "Profile image uploaded successfully",
      });
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
<<<<<<< HEAD
<<<<<<< HEAD
        description:
          error instanceof Error ? error.message : "Failed to upload image",
        variant: "destructive",
=======
        description: "Failed to upload image",
        variant: "destructive"
>>>>>>> 3be442bcdc62f9e590e91fd40a9f56038d458aa0
=======
        description: "Failed to upload image",
        variant: "destructive"
>>>>>>> origin/main
      });
    } finally {
      setIsUploading(false);
    }
  };
<<<<<<< HEAD
<<<<<<< HEAD
=======

>>>>>>> 3be442bcdc62f9e590e91fd40a9f56038d458aa0
=======

>>>>>>> origin/main
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    try {
      const supabase = await createClient();
<<<<<<< HEAD
<<<<<<< HEAD

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) throw new Error("No user found");

      const { error } = await supabase.from("users").upsert(
        {
          id: user.id, // Explicitly set the id from auth
          email: values.email,
          first_name: values.first_name,
          last_name: values.last_name,
=======
=======
>>>>>>> origin/main
      
      const { error } = await supabase
        .from('users')
        .update({
          first_name: values.first_name,
          last_name: values.last_name,
          email: values.email,
<<<<<<< HEAD
>>>>>>> 3be442bcdc62f9e590e91fd40a9f56038d458aa0
=======
>>>>>>> origin/main
          phone: values.phone,
          profile_image: imageUrl,
          address: {
            street: values.street,
            city: values.city,
            state: values.state,
<<<<<<< HEAD
<<<<<<< HEAD
            pincode: values.pincode,
          },
          user_preferences: {
            theme: "light",
            notifications: true,
          },
          favourites: [],
          password: values.password,
        },
        {
          onConflict: "id",
          returning: "minimal",
        }
      );

      if (error) {
        console.error("Update error:", error);
        throw error;
      }

      localStorage.removeItem("registrationData");
      router.push("/");
=======
=======
>>>>>>> origin/main
            pincode: values.pincode
          },
          user_preferences: {
            theme: 'light',
            notifications: true
          },
          favourites: []
        })
        .eq('email', values.email);

      if (error) throw error;

      localStorage.removeItem("registrationData");
      router.push("/");
      
<<<<<<< HEAD
>>>>>>> 3be442bcdc62f9e590e91fd40a9f56038d458aa0
=======
>>>>>>> origin/main
      toast({
        title: "Profile Updated",
        description: "Your profile has been successfully updated",
      });
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Failed to update profile",
<<<<<<< HEAD
<<<<<<< HEAD
        variant: "destructive",
=======
        variant: "destructive"
>>>>>>> 3be442bcdc62f9e590e91fd40a9f56038d458aa0
=======
        variant: "destructive"
>>>>>>> origin/main
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Complete Your Profile</h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="first_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>First Name</FormLabel>
                  <FormControl>
                    <Input {...field} disabled />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="last_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Last Name</FormLabel>
                  <FormControl>
                    <Input {...field} disabled />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input {...field} disabled />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone</FormLabel>
                <FormControl>
                  <Input {...field} disabled />
                </FormControl>
              </FormItem>
            )}
          />

<<<<<<< HEAD
<<<<<<< HEAD
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone</FormLabel>
                <FormControl>
                  <Input {...field} disabled />
                </FormControl>
              </FormItem>
            )}
          />

=======
>>>>>>> 3be442bcdc62f9e590e91fd40a9f56038d458aa0
=======
>>>>>>> origin/main
          <div className="space-y-2">
            <Label htmlFor="profile-image">Profile Picture</Label>
            <Input
              id="profile-image"
              type="file"
              accept="image/*"
<<<<<<< HEAD
<<<<<<< HEAD
              onChange={(event: ChangeEvent<HTMLInputElement>) => {
                const file = event.target.files?.[0];
                if (file) {
                  handleImageUpload(file);
                }
              }}
              disabled={isUploading}
            />
            {imageUrl && (
              <img
                src={imageUrl}
                alt="Profile preview"
=======
=======
>>>>>>> origin/main
              onChange={handleImageUpload}
              disabled={isUploading}
            />
            {imageUrl && (
              <img 
                src={imageUrl} 
                alt="Profile preview" 
<<<<<<< HEAD
>>>>>>> 3be442bcdc62f9e590e91fd40a9f56038d458aa0
=======
>>>>>>> origin/main
                className="w-24 h-24 rounded-full object-cover"
              />
            )}
          </div>

          <FormField
            control={form.control}
            name="street"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Street Address</FormLabel>
                <FormControl>
                  <Textarea {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>City</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="state"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>State</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="pincode"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Pincode</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

<<<<<<< HEAD
<<<<<<< HEAD
          <Button
            type="submit"
            disabled={isLoading || isUploading}
=======
          <Button 
            type="submit" 
            disabled={isLoading || isUploading} 
>>>>>>> 3be442bcdc62f9e590e91fd40a9f56038d458aa0
=======
          <Button 
            type="submit" 
            disabled={isLoading || isUploading} 
>>>>>>> origin/main
            className="w-full"
          >
            {isLoading ? "Saving..." : "Complete Profile"}
          </Button>
        </form>
      </Form>
    </div>
  );
<<<<<<< HEAD
<<<<<<< HEAD
}
=======
}
>>>>>>> 3be442bcdc62f9e590e91fd40a9f56038d458aa0
=======
}
>>>>>>> origin/main
