"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MapPin } from "lucide-react"

export function NearbyMap() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Cooks Near You</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="aspect-[16/9] relative bg-muted rounded-lg overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center">
            <MapPin className="h-8 w-8 text-muted-foreground" />
            <span className="ml-2 text-muted-foreground">Map view coming soon</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

