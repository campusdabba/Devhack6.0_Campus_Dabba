"use client";
import { useState } from "react"
import { MapPin } from "lucide-react"

interface MapPreviewProps {
  address?: string
  latitude?: number
  longitude?: number
}

export function MapPreview({ address, latitude, longitude }: MapPreviewProps) {
  const [loading, setLoading] = useState(false)

  const defaultCoordinates = {
    lat: latitude || 15.4577,  // Dharwad, Karnataka (default)
    lng: longitude || 75.0078,
  }

  // Static map URL using OpenStreetMap
  const mapUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${defaultCoordinates.lng - 0.01},${defaultCoordinates.lat - 0.01},${defaultCoordinates.lng + 0.01},${defaultCoordinates.lat + 0.01}&layer=mapnik`

  return (
    <div className="space-y-2">
      <label className="text-sm font-semibold">Location on Map</label>
      <div className="relative">
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/10 rounded-md">
            <MapPin className="h-6 w-6 animate-pulse text-primary" />
          </div>
        )}
        <iframe
          src={mapUrl}
          width="600"
          height="300"
          className="rounded-md"
          onLoad={() => setLoading(false)}
          style={{ border: 0 }}
          title="Static Map"
        />
      </div>
    </div>
  )
}
