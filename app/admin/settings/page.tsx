"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"

export default function Settings() {
  const [settings, setSettings] = useState({
    siteName: "CampusDabba",
    contactEmail: "support@campusdabba.com",
    enableNotifications: true,
    maintenanceMode: false,
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setSettings((prev) => ({ ...prev, [name]: value }))
  }

  const handleToggle = (name: string) => {
    setSettings((prev) => ({ ...prev, [name]: !prev[name as keyof typeof prev] }))
  }

  const saveSettings = () => {
    console.log("Settings saved:", settings)
    // Here you would typically send these settings to your backend
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Settings</h1>
      <div className="space-y-4">
        <div>
          <Label htmlFor="siteName">Site Name</Label>
          <Input id="siteName" name="siteName" value={settings.siteName} onChange={handleChange} />
        </div>
        <div>
          <Label htmlFor="contactEmail">Contact Email</Label>
          <Input id="contactEmail" name="contactEmail" value={settings.contactEmail} onChange={handleChange} />
        </div>
        <div className="flex items-center space-x-2">
          <Switch
            id="enableNotifications"
            checked={settings.enableNotifications}
            onCheckedChange={() => handleToggle("enableNotifications")}
          />
          <Label htmlFor="enableNotifications">Enable Notifications</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Switch
            id="maintenanceMode"
            checked={settings.maintenanceMode}
            onCheckedChange={() => handleToggle("maintenanceMode")}
          />
          <Label htmlFor="maintenanceMode">Maintenance Mode</Label>
        </div>
        <Button onClick={saveSettings}>Save Settings</Button>
      </div>
    </div>
  )
}

