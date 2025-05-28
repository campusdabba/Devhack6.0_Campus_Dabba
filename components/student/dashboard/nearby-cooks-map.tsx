"use client";

import { useEffect, useState, useRef } from "react";
import { createClient } from "@/utils/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Navigation, Star } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Cook } from "./types";

interface MapLocation {
  latitude: number;
  longitude: number;
}

const MAPTILER_API_KEY = "XZiubdaky8VdD93jgd6l";
const DEFAULT_ZOOM = 13;
const MAX_DISTANCE_KM = 5; // Maximum distance to show cooks (in kilometers)

// Calculate distance between two points using Haversine formula
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Radius of the Earth in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * 
    Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in km
}

export function NearbyCooksMap() {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<any>(null);
  const [userLocation, setUserLocation] = useState<MapLocation | null>(null);
  const [nearbyCooks, setNearbyCooks] = useState<Cook[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();

  // Get user's location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => {
          console.error("Error getting location:", error);
          setError("Could not get your location. Please enable location services.");
          // Fallback to a default location (e.g., city center)
          setUserLocation({
            latitude: 19.0760, // Mumbai
            longitude: 72.8777,
          });
        }
      );
    } else {
      setError("Geolocation is not supported by your browser");
      // Fallback to a default location
      setUserLocation({
        latitude: 19.0760,
        longitude: 72.8777,
      });
    }
  }, []);

  // Fetch cooks data
  useEffect(() => {
    async function fetchCooks() {
      try {
        setIsLoading(true);
        
        const { data: cooksData, error: cooksError } = await supabase
          .from("cooks")
          .select(`
            id,
            cook_id,
            first_name,
            last_name,
            address,
            rating,
            profile_image,
            latitude,
            longitude,
            isAvailable,
            certification
          `);

        if (cooksError) {
          throw cooksError;
        }

        return cooksData || [];
      } catch (error) {
        console.error("Error fetching cooks:", error);
        setError("Failed to load cooks data");
        return [];
      } finally {
        setIsLoading(false);
      }
    }

    if (userLocation) {
      fetchCooks().then(cooks => {
        // Filter cooks with valid coordinates and calculate distance
        const cooksWithDistance = cooks
          .filter(cook => {
            // Check if cook has valid coordinates
            const lat = parseFloat(cook.latitude);
            const lng = parseFloat(cook.longitude);
            return !isNaN(lat) && !isNaN(lng);
          })
          .map(cook => {
            const cookLat = parseFloat(cook.latitude);
            const cookLng = parseFloat(cook.longitude);
            const distance = calculateDistance(
              userLocation.latitude, 
              userLocation.longitude, 
              cookLat, 
              cookLng
            );
            return { ...cook, distance };
          })
          .filter(cook => cook.distance <= MAX_DISTANCE_KM)
          .sort((a, b) => a.distance - b.distance);

        setNearbyCooks(cooksWithDistance);
      });
    }
  }, [userLocation, supabase]);

  // Initialize map when user location and cooks are available
  useEffect(() => {
    if (!mapRef.current || !userLocation || map) return;

    // Load MapTiler GL JS
    const script = document.createElement('script');
    script.src = 'https://cdn.maptiler.com/maptiler-sdk-js/latest/maptiler-sdk.umd.min.js';
    script.async = true;
    
    const stylesheet = document.createElement('link');
    stylesheet.rel = 'stylesheet';
    stylesheet.href = 'https://cdn.maptiler.com/maptiler-sdk-js/latest/maptiler-sdk.css';
    
    document.head.appendChild(stylesheet);
    document.body.appendChild(script);

    script.onload = () => {
      if (!window.maptilersdk) return;
      
      window.maptilersdk.config.apiKey = MAPTILER_API_KEY;
      
      const newMap = new window.maptilersdk.Map({
        container: mapRef.current!,
        style: window.maptilersdk.MapStyle.STREETS,
        center: [userLocation.longitude, userLocation.latitude],
        zoom: DEFAULT_ZOOM
      });
      
      // Add user marker
      newMap.on('load', () => {
        // Add user location marker
        new window.maptilersdk.Marker({
          color: "#FF0000"
        })
        .setLngLat([userLocation.longitude, userLocation.latitude])
        .addTo(newMap);
        
        // Add cook markers
        nearbyCooks.forEach(cook => {
          const cookLat = parseFloat(cook.latitude);
          const cookLng = parseFloat(cook.longitude);
          
          if (!isNaN(cookLat) && !isNaN(cookLng)) {
            const popup = new window.maptilersdk.Popup({ offset: 25 })
              .setHTML(`
                <strong>${cook.first_name} ${cook.last_name}</strong><br>
                Rating: ${cook.rating}⭐<br>
                Distance: ${cook.distance.toFixed(1)} km<br>
                <a href="/cooks/${cook.id}" style="color: blue; text-decoration: underline;">View Menu</a>
              `);
              
            new window.maptilersdk.Marker({
              color: "#4CAF50"
            })
            .setLngLat([cookLng, cookLat])
            .setPopup(popup)
            .addTo(newMap);
          }
        });
      });
      
      setMap(newMap);
    };
    
    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
      if (stylesheet.parentNode) {
        stylesheet.parentNode.removeChild(stylesheet);
      }
      if (map) {
        map.remove();
      }
    };
  }, [userLocation, nearbyCooks, map]);

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Nearby Cooks</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-red-500">{error}</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle>Cooks Near You</CardTitle>
        </CardHeader>
        <CardContent>
          <div 
            ref={mapRef} 
            className="w-full h-[400px] rounded-md bg-slate-100"
          >
            {isLoading && <div className="flex h-full items-center justify-center">Loading map...</div>}
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Nearby Cooks</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center h-[400px]">
              Loading nearby cooks...
            </div>
          ) : nearbyCooks.length === 0 ? (
            <div className="text-center h-[400px] flex items-center justify-center">
              <div>
                <p className="mb-4">No cooks found near your location.</p>
                <p className="text-sm text-muted-foreground">Try expanding your search area or check back later.</p>
              </div>
            </div>
          ) : (
            <div className="space-y-4 h-[400px] overflow-y-auto pr-2">
              {nearbyCooks.map(cook => (
                <div key={cook.id} className="flex items-start gap-3 p-3 border rounded-lg hover:bg-slate-50">
                  <div className="flex-shrink-0">
                    <Image 
                      src={cook.profile_image || "/placeholder-chef.jpg"} 
                      alt={`${cook.first_name} ${cook.last_name}`}
                      width={50}
                      height={50}
                      className="rounded-full"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium truncate">
                      {cook.first_name} {cook.last_name}
                    </h4>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Star className="h-3 w-3 mr-1" />
                      <span>{cook.rating}</span>
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground mt-1">
                      <MapPin className="h-3 w-3 mr-1" />
                      <span>{cook.distance.toFixed(1)} km away</span>
                    </div>
                    <div className="mt-2">
                      <Badge 
                        variant={cook.isAvailable ? "success" : "secondary"}
                        className={cook.isAvailable ? "bg-green-100 text-green-800" : ""}
                      >
                        {cook.isAvailable ? "Available" : "Unavailable"}
                      </Badge>
                    </div>
                  </div>
                  <Button asChild size="sm" className="flex-shrink-0">
                    <Link href={`/cooks/${cook.id}`}>
                      View
                    </Link>
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
