"use client"

import { useTheme } from "next-themes"
import { Toaster as Sonner } from "sonner"

type ToasterProps = React.ComponentProps<typeof Sonner>

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
          description: "group-[.toast]:text-muted-foreground",
          actionButton:
            "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton:
            "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
<<<<<<< HEAD
<<<<<<< HEAD
          error: "group-[.toast]:border-destructive group-[.toast]:text-destructive", // Add error styling
=======
<<<<<<< HEAD
=======
          error: "group-[.toast]:border-destructive group-[.toast]:text-destructive", // Add error styling
>>>>>>> a6396a4 (Version lOLZ)
>>>>>>> 3be442bcdc62f9e590e91fd40a9f56038d458aa0
=======
=======
          error: "group-[.toast]:border-destructive group-[.toast]:text-destructive", // Add error styling
>>>>>>> a6396a4 (Version lOLZ)
>>>>>>> origin/main
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
