import type { Metadata } from "next"
import { SettingsForm } from "@/components/student/settings/settings-form"

export const metadata: Metadata = {
  title: "Settings",
  description: "Manage your account settings and preferences",
}

export default function SettingsPage() {
  return (
    <div className="container mx-auto max-w-4xl space-y-6 p-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account settings, preferences, and privacy options.
        </p>
      </div>
      <SettingsForm />
    </div>
  )
}

