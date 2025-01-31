<<<<<<< HEAD
<<<<<<< HEAD
=======
<<<<<<< HEAD
=======
>>>>>>> origin/main
"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Switch } from "@/components/ui/switch"
import { toast } from "@/components/ui/use-toast"
=======
<<<<<<< HEAD
>>>>>>> 3be442bcdc62f9e590e91fd40a9f56038d458aa0
=======
>>>>>>> origin/main
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useTheme } from "next-themes"; // Add this import
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/components/ui/use-toast";
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> a6396a4 (Version lOLZ)
>>>>>>> 3be442bcdc62f9e590e91fd40a9f56038d458aa0
=======
>>>>>>> a6396a4 (Version lOLZ)
>>>>>>> origin/main

const settingsFormSchema = z.object({
  marketingEmails: z.boolean().default(false).optional(),
  securityEmails: z.boolean(),
  theme: z.enum(["light", "dark"], {
    required_error: "You need to select a theme.",
  }),
<<<<<<< HEAD
<<<<<<< HEAD
=======
<<<<<<< HEAD
=======
>>>>>>> origin/main
})

type SettingsFormValues = z.infer<typeof settingsFormSchema>

// This can come from your database or API.
const defaultValues: Partial<SettingsFormValues> = {
  securityEmails: true,
  marketingEmails: false,
}

export function SettingsForm() {
  const form = useForm<SettingsFormValues>({
    resolver: zodResolver(settingsFormSchema),
    defaultValues,
  })

  function onSubmit(data: SettingsFormValues) {
    toast({
      title: "You submitted the following values:",
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    })
=======
<<<<<<< HEAD
>>>>>>> 3be442bcdc62f9e590e91fd40a9f56038d458aa0
=======
>>>>>>> origin/main
});

type SettingsFormValues = z.infer<typeof settingsFormSchema>;

export function SettingsForm() {
  const { theme, setTheme } = useTheme();
  const form = useForm<SettingsFormValues>({
    resolver: zodResolver(settingsFormSchema),
    defaultValues: {
      theme: (theme as "light" | "dark") || "light",
      securityEmails: true,
      marketingEmails: false,
    },
  });

  function onSubmit(data: SettingsFormValues) {
    setTheme(data.theme);
    toast({
      title: "Settings updated",
      description: "Your preferences have been saved.",
    });
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> a6396a4 (Version lOLZ)
>>>>>>> 3be442bcdc62f9e590e91fd40a9f56038d458aa0
=======
>>>>>>> a6396a4 (Version lOLZ)
>>>>>>> origin/main
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="marketingEmails"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
              <div className="space-y-0.5">
                <FormLabel>Marketing emails</FormLabel>
<<<<<<< HEAD
<<<<<<< HEAD
=======
<<<<<<< HEAD
=======
>>>>>>> origin/main
                <FormDescription>Receive emails about new products, features, and more.</FormDescription>
              </div>
              <FormControl>
                <Switch checked={field.value} onCheckedChange={field.onChange} />
=======
<<<<<<< HEAD
>>>>>>> 3be442bcdc62f9e590e91fd40a9f56038d458aa0
=======
>>>>>>> origin/main
                <FormDescription>
                  Receive emails about new products, features, and more.
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> a6396a4 (Version lOLZ)
>>>>>>> 3be442bcdc62f9e590e91fd40a9f56038d458aa0
=======
>>>>>>> a6396a4 (Version lOLZ)
>>>>>>> origin/main
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="securityEmails"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
              <FormControl>
<<<<<<< HEAD
<<<<<<< HEAD
=======
<<<<<<< HEAD
=======
>>>>>>> origin/main
                <Checkbox checked={field.value} onCheckedChange={field.onChange} />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>Security emails</FormLabel>
                <FormDescription>Receive emails about your account security.</FormDescription>
=======
<<<<<<< HEAD
>>>>>>> 3be442bcdc62f9e590e91fd40a9f56038d458aa0
=======
>>>>>>> origin/main
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>Security emails</FormLabel>
                <FormDescription>
                  Receive emails about your account security.
                </FormDescription>
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> a6396a4 (Version lOLZ)
>>>>>>> 3be442bcdc62f9e590e91fd40a9f56038d458aa0
=======
>>>>>>> a6396a4 (Version lOLZ)
>>>>>>> origin/main
              </div>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="theme"
          render={({ field }) => (
            <FormItem className="space-y-1">
              <FormLabel>Theme</FormLabel>
<<<<<<< HEAD
<<<<<<< HEAD
              <FormDescription>
                Select the theme for the dashboard.
              </FormDescription>
=======
<<<<<<< HEAD
=======
>>>>>>> origin/main
              <FormDescription>Select the theme for the dashboard.</FormDescription>
=======
              <FormDescription>
                Select the theme for the dashboard.
              </FormDescription>
>>>>>>> a6396a4 (Version lOLZ)
<<<<<<< HEAD
>>>>>>> 3be442bcdc62f9e590e91fd40a9f56038d458aa0
=======
>>>>>>> origin/main
              <FormMessage />
              <RadioGroup
                onValueChange={field.onChange}
                defaultValue={field.value}
                className="grid max-w-md grid-cols-2 gap-8 pt-2"
              >
                <FormItem>
                  <FormLabel className="[&:has([data-state=checked])>div]:border-primary">
                    <FormControl>
                      <RadioGroupItem value="light" className="sr-only" />
                    </FormControl>
                    <div className="items-center rounded-md border-2 border-muted p-1 hover:border-accent">
                      <div className="space-y-2 rounded-sm bg-[#ecedef] p-2">
                        <div className="space-y-2 rounded-md bg-white p-2 shadow-sm">
                          <div className="h-2 w-[80px] rounded-lg bg-[#ecedef]" />
                          <div className="h-2 w-[100px] rounded-lg bg-[#ecedef]" />
                        </div>
                        <div className="flex items-center space-x-2 rounded-md bg-white p-2 shadow-sm">
                          <div className="h-4 w-4 rounded-full bg-[#ecedef]" />
                          <div className="h-2 w-[100px] rounded-lg bg-[#ecedef]" />
                        </div>
                        <div className="flex items-center space-x-2 rounded-md bg-white p-2 shadow-sm">
                          <div className="h-4 w-4 rounded-full bg-[#ecedef]" />
                          <div className="h-2 w-[100px] rounded-lg bg-[#ecedef]" />
                        </div>
                      </div>
                    </div>
<<<<<<< HEAD
<<<<<<< HEAD
                    <span className="block w-full p-2 text-center font-normal">
                      Light
                    </span>
=======
<<<<<<< HEAD
=======
>>>>>>> origin/main
                    <span className="block w-full p-2 text-center font-normal">Light</span>
=======
                    <span className="block w-full p-2 text-center font-normal">
                      Light
                    </span>
>>>>>>> a6396a4 (Version lOLZ)
<<<<<<< HEAD
>>>>>>> 3be442bcdc62f9e590e91fd40a9f56038d458aa0
=======
>>>>>>> origin/main
                  </FormLabel>
                </FormItem>
                <FormItem>
                  <FormLabel className="[&:has([data-state=checked])>div]:border-primary">
                    <FormControl>
                      <RadioGroupItem value="dark" className="sr-only" />
                    </FormControl>
                    <div className="items-center rounded-md border-2 border-muted bg-popover p-1 hover:bg-accent hover:text-accent-foreground">
                      <div className="space-y-2 rounded-sm bg-slate-950 p-2">
                        <div className="space-y-2 rounded-md bg-slate-800 p-2 shadow-sm">
                          <div className="h-2 w-[80px] rounded-lg bg-slate-400" />
                          <div className="h-2 w-[100px] rounded-lg bg-slate-400" />
                        </div>
                        <div className="flex items-center space-x-2 rounded-md bg-slate-800 p-2 shadow-sm">
                          <div className="h-4 w-4 rounded-full bg-slate-400" />
                          <div className="h-2 w-[100px] rounded-lg bg-slate-400" />
                        </div>
                        <div className="flex items-center space-x-2 rounded-md bg-slate-800 p-2 shadow-sm">
                          <div className="h-4 w-4 rounded-full bg-slate-400" />
                          <div className="h-2 w-[100px] rounded-lg bg-slate-400" />
                        </div>
                      </div>
                    </div>
<<<<<<< HEAD
<<<<<<< HEAD
                    <span className="block w-full p-2 text-center font-normal">
                      Dark
                    </span>
=======
<<<<<<< HEAD
=======
>>>>>>> origin/main
                    <span className="block w-full p-2 text-center font-normal">Dark</span>
=======
                    <span className="block w-full p-2 text-center font-normal">
                      Dark
                    </span>
>>>>>>> a6396a4 (Version lOLZ)
<<<<<<< HEAD
>>>>>>> 3be442bcdc62f9e590e91fd40a9f56038d458aa0
=======
>>>>>>> origin/main
                  </FormLabel>
                </FormItem>
              </RadioGroup>
            </FormItem>
          )}
        />
        <Button type="submit">Update preferences</Button>
      </form>
    </Form>
<<<<<<< HEAD
<<<<<<< HEAD
  );
}
=======
<<<<<<< HEAD
=======
>>>>>>> origin/main
  )
}

=======
  );
}
>>>>>>> a6396a4 (Version lOLZ)
<<<<<<< HEAD
>>>>>>> 3be442bcdc62f9e590e91fd40a9f56038d458aa0
=======
>>>>>>> origin/main
