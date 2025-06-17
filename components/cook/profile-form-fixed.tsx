"use client";

import { ChangeEvent, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Upload } from "lucide-react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Label } from "@/components/ui/label";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import { createClient } from "@/utils/supabase/client";

const INDIAN_STATES = [
  "Andhra Pradesh",
  "Arunachal Pradesh", 
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
];

const CUISINE_TYPES = [
  "North Indian",
  "South Indian", 
  "Bengali",
  "Gujarati",
  "Punjabi",
  "Maharashtrian",
  "Tamil",
  "Kerala",
  "Rajasthani",
  "Street Food",
  "Continental",
  "Chinese",
  "Italian",
  "Multi-cuisine"
];

const formSchema = z.object({
  first_name: z.string().min(2, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  email: z.string().email("Valid email is required"),
  phone: z.string().min(10, "Valid phone number is required"),
  street: z.string().min(3, "Street address is required"),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State is required"),
  pincode: z.string().min(6, "Valid pincode required"),
  cuisineType: z.string().min(1, "Please select a cuisine type"),
  description: z.string().min(50, "Bio must be at least 50 characters"),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  profile_picture: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export function CookProfileForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      email: "",
      phone: "",
      street: "",
      city: "",
      state: "",
      pincode: "",
      cuisineType: "",
      description: "",
      latitude: undefined,
      longitude: undefined,
      profile_picture: "",
    },
  });

  // Load data from localStorage on component mount
  useEffect(() => {
    const registrationData = localStorage.getItem("registrationData");
    if (registrationData) {
      try {
        const data = JSON.parse(registrationData);
        if (data.cook_name) {
          const nameParts = data.cook_name.split(" ");
          form.setValue("first_name", nameParts[0] || "");
          form.setValue("last_name", nameParts.slice(1).join(" ") || "");
        }
        if (data.cook_email) form.setValue("email", data.cook_email);
        if (data.cook_phone) form.setValue("phone", data.cook_phone);
      } catch (error) {
        console.error("Error loading registration data:", error);
      }
    }
  }, [form]);

  const handleImageUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please select an image smaller than 10MB",
        variant: "destructive",
      });
      return;
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast({
        title: "Invalid file type",
        description: "Please select an image file",
        variant: "destructive",
      });
      return;
    }

    try {
      // Create preview URL
      const preview = URL.createObjectURL(file);
      setPreviewUrl(preview);
      setUploadedImage(file);
    } catch (error) {
      console.error("Error creating preview:", error);
      toast({
        title: "Error",
        description: "Failed to preview image",
        variant: "destructive",
      });
    }
  };

  const handleLocationSelect = (lat: number, lng: number) => {
    form.setValue("latitude", lat);
    form.setValue("longitude", lng);
  };

  async function onSubmit(values: FormValues) {
    setIsLoading(true);

    try {
      const supabase = await createClient();

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) throw new Error("No user found");

      // Upload image if available
      let finalImageUrl = values.profile_picture;
      if (uploadedImage) {
        const fileExt = uploadedImage.name.split(".").pop();
        const fileName = `${user.id}-${Math.random()}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from("cook-images")
          .upload(fileName, uploadedImage);

        if (uploadError) throw uploadError;

        const {
          data: { publicUrl },
        } = supabase.storage.from("cook-images").getPublicUrl(fileName);

        finalImageUrl = publicUrl;
      }

      // Insert cook profile
      const cookData = {
        id: user.id,
        user_id: user.id,
        auth_user_id: user.id,
        cook_id: user.id,
        email: values.email,
        first_name: values.first_name,
        last_name: values.last_name,
        name: `${values.first_name} ${values.last_name}`,
        phone: values.phone,
        profile_image: finalImageUrl,
        address: {
          street: values.street,
          city: values.city,
          state: values.state,
          pincode: values.pincode,
        },
        city: values.city,
        state: values.state,
        pincode: values.pincode,
        region: values.state,
        cuisineType: values.cuisineType,
        cuisine_type: values.cuisineType,
        description: values.description,
        rating: 0.0,
        total_orders: 0,
        totalorders: 0,
        is_available: true,
        isAvailable: true,
        certification: [],
        specialties: [],
        business_name: null,
        password: null,
        latitude: values.latitude || null,
        longitude: values.longitude || null,
        weeklySchedule: null,
        created_at: new Date().toISOString(),
      };

      console.log('Creating cook with data:', cookData);

      const { error } = await supabase.from("cooks").upsert(cookData);

      if (error) {
        console.error("Insert error:", error);
        throw error;
      }

      // Set user role to cook
      const { error: roleError } = await supabase.rpc('set_user_role', {
        user_id: user.id,
        new_role: 'cook'
      });

      if (roleError) {
        console.warn("Role update error:", roleError);
        // Don't fail the entire process if role update fails
      }

      localStorage.removeItem("registrationData");
      
      toast({
        title: "Profile Created Successfully!",
        description: "Welcome to CampusDabba! You can now start adding menu items.",
      });
      
      router.push("/cook/dashboard");
    } catch (error: any) {
      console.error("Profile creation error:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to create profile",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {/* Profile Image */}
          <div className="space-y-4">
            <Label>Profile Picture</Label>
            <div className="flex items-center space-x-4">
              {previewUrl ? (
                <img
                  src={previewUrl}
                  alt="Profile preview"
                  className="w-20 h-20 rounded-full object-cover"
                />
              ) : (
                <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center">
                  <Upload className="w-8 h-8 text-gray-400" />
                </div>
              )}
              <Input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="max-w-xs"
              />
            </div>
          </div>

          {/* Personal Information */}
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="first_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>First Name</FormLabel>
                  <FormControl>
                    <Input placeholder="John" {...field} />
                  </FormControl>
                  <FormMessage />
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
                    <Input placeholder="Doe" {...field} />
                  </FormControl>
                  <FormMessage />
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

          {/* Address */}
          <FormField
            control={form.control}
            name="street"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Street Address</FormLabel>
                <FormControl>
                  <Input placeholder="123 Main Street" {...field} />
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
                    <Input placeholder="Mumbai" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="pincode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Pincode</FormLabel>
                  <FormControl>
                    <Input placeholder="400001" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="state"
            render={({ field }) => (
              <FormItem>
                <FormLabel>State</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your state" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {INDIAN_STATES.map((state) => (
                      <SelectItem key={state} value={state}>
                        {state}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Cuisine Type */}
          <FormField
            control={form.control}
            name="cuisineType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cuisine Type</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your cuisine specialty" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {CUISINE_TYPES.map((cuisine) => (
                      <SelectItem key={cuisine} value={cuisine}>
                        {cuisine}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Description */}
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>About You</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Tell us about yourself, your cooking experience, and what makes your food special..."
                    className="min-h-[100px]"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Minimum 50 characters. This will be shown to customers.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Map for location - simplified for now */}
          <div className="space-y-4">
            <Label>Location</Label>
            <p className="text-sm text-muted-foreground">
              Your address will be used to show your location to customers
            </p>
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Complete Registration
          </Button>
        </form>
      </Form>
    </div>
  );
}
