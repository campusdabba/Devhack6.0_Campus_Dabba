import type { Metadata } from "next"
import { CookSettingsForm } from "@/components/cook/settings/settings-form"

export const metadata: Metadata = {
  title: "Settings",
  description: "Manage your cook account settings and preferences",
}

export default function CookSettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account settings and cooking preferences
        </p>
      </div>
      <CookSettingsForm />
    </div>
  )
}
