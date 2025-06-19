"use client"

import { useState, useEffect } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Loader2, Upload } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"
import { createClient } from "@/utils/supabase/client"

const profileFormSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  phone: z.string().optional(),
  street: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  pincode: z.string().optional(),
  profile_image: z.string().optional(),
})

type ProfileFormValues = z.infer<typeof profileFormSchema>

export function ProfileForm() {
  const [loading, setLoading] = useState(false)
  const [fetchingData, setFetchingData] = useState(true)
  const [uploadedImage, setUploadedImage] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      email: "",
      first_name: "",
      last_name: "",
      phone: "",
      street: "",
      city: "",
      state: "",
      pincode: "",
      profile_image: "",
    },
    mode: "onChange",
  })

  useEffect(() => {
    fetchUserData()
  }, [])

  const fetchUserData = async () => {
    try {
      const supabase = createClient()
      const { data: { user }, error: authError } = await supabase.auth.getUser()

      if (authError) throw authError
      if (!user) throw new Error("No user found")

      // First check if user exists in users table
      const { data: userData, error: userError } = await supabase
        .from("users")
        .select("*")
        .eq("id", user.id)
        .single()

      if (userData) {
        form.setValue("email", userData.email || user.email || "")
        form.setValue("first_name", userData.first_name || "")
        form.setValue("last_name", userData.last_name || "")
        form.setValue("phone", userData.phone || "")
        form.setValue("profile_image", userData.profile_image || "")
        
        // Handle address object
        const address = userData.address || {}
        form.setValue("street", address.street || "")
        form.setValue("city", address.city || "")
        form.setValue("state", address.state || "")
        form.setValue("pincode", address.pincode || "")
      } else {
        // If user doesn't exist in users table, use auth data as fallback
        form.setValue("email", user.email || "")
      }
    } catch (error) {
      console.error("Error fetching user data:", error)
      toast({
        title: "Error",
        description: "Failed to load profile data",
        variant: "destructive",
      })
    } finally {
      setFetchingData(false)
    }
  }

  const handleImageUpload = async (file: File) => {
    try {
      // Create local preview URL
      const preview = URL.createObjectURL(file)
      setPreviewUrl(preview)
      setUploadedImage(file)
    } catch (error) {
      console.error("Error creating preview:", error)
      toast({
        title: "Error",
        description: "Failed to preview image",
        variant: "destructive",
      })
    }
  }

  async function onSubmit(data: ProfileFormValues) {
    setLoading(true)
    
    try {
      const supabase = createClient()
      const { data: { user }, error: authError } = await supabase.auth.getUser()

      if (authError) throw authError
      if (!user) throw new Error("No user found")

      let finalImageUrl = data.profile_image // Keep existing if no new upload
      if (uploadedImage) {
        const fileExt = uploadedImage.name.split(".").pop()
        const fileName = `${user.id}-${Math.random()}.${fileExt}`

        const { error: uploadError } = await supabase.storage
          .from("user-images")
          .upload(fileName, uploadedImage)

        if (uploadError) {
          console.warn("Image upload failed:", uploadError)
          toast({
            title: "Warning",
            description: "Profile updated but image upload failed",
            variant: "destructive",
          })
        } else {
          const {
            data: { publicUrl },
          } = supabase.storage.from("user-images").getPublicUrl(fileName)
          finalImageUrl = publicUrl
        }
      }

      // Check if user exists in users table
      const { data: existingUser } = await supabase
        .from("users")
        .select("id")
        .eq("id", user.id)
        .single()

      const userData = {
        id: user.id,
        email: data.email,
        first_name: data.first_name,
        last_name: data.last_name,
        phone: data.phone,
        profile_image: finalImageUrl,
        address: {
          street: data.street,
          city: data.city,
          state: data.state,
          pincode: data.pincode,
        },
        role: "customer",
        updated_at: new Date().toISOString(),
      }

      let error
      if (existingUser) {
        // Update existing user
        const updateResult = await supabase
          .from("users")
          .update(userData)
          .eq("id", user.id)
        error = updateResult.error
      } else {
        // Insert new user
        const insertResult = await supabase
          .from("users")
          .insert([{ ...userData, created_at: new Date().toISOString() }])
        error = insertResult.error
      }

      if (error) throw error

      toast({
        title: "Success",
        description: "Profile updated successfully",
      })
    } catch (error) {
      console.error("Error updating profile:", error)
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  if (fetchingData) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading profile...</span>
      </div>
    )
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
        
        <div className="space-y-2">
          <FormLabel>Profile Picture</FormLabel>
          <Input
            type="file"
            accept="image/*"
            onChange={(event) => {
              const file = event.target.files?.[0]
              if (file) {
                handleImageUpload(file)
              }
            }}
          />
          {(previewUrl || form.getValues("profile_image")) && (
            <img
              src={previewUrl || form.getValues("profile_image")}
              alt="Profile preview"
              className="w-24 h-24 rounded-full object-cover"
              onError={(e) => {
                e.currentTarget.src = "/placeholder-user.jpg"
              }}
            />
          )}
        </div>
        
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="example@example.com" {...field} />
              </FormControl>
              <FormDescription>You can manage verified email addresses in your email settings.</FormDescription>
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
                <Input placeholder="+91 9876543210" {...field} />
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
            name="state"
            render={({ field }) => (
              <FormItem>
                <FormLabel>State</FormLabel>
                <FormControl>
                  <Input placeholder="Maharashtra" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
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
        
        <Button type="submit" disabled={loading}>
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Update profile
        </Button>
      </form>
    </Form>
  )
}

