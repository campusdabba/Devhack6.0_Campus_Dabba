"use client";

import { useEffect, useState, useRef } from "react";
import { createClient } from "@/utils/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Star } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface MapLocation {
  latitude: number;
  longitude: number;
}

interface Address {
  street?: string;
  city?: string;
  state?: string;
  pincode?: string;
}

interface Cook {
  id: string;
  cook_id: string;
  first_name: string;
  last_name: string;
  profile_image: string | null;
  rating: number;
  latitude: string;
  longitude: string;
  isAvailable: boolean;
  distance?: number;
  certification?: any;
  address?: any;
}

interface User {
  id: string;
  email: string;
  address: Address;
  first_name?: string;
  last_name?: string;
}

const MAPTILER_API_KEY = process.env.NEXT_PUBLIC_MAPTILER_API_KEY || "XZiubdaky8VdD93jgd6l";
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

// Geocode address to coordinates
async function geocodeAddress(address: Address): Promise<MapLocation | null> {
  try {
    // Format address as a string
    const addressString = [
      address.street,
      address.city,
      address.state,
      address.pincode
    ].filter(Boolean).join(", ");
    
    if (!addressString) return null;
    
    // Use MapTiler Geocoding API
    const response = await fetch(
      `https://api.maptiler.com/geocoding/${encodeURIComponent(addressString)}.json?key=${MAPTILER_API_KEY}`
    );
    
    const data = await response.json();
    
    if (data.features && data.features.length > 0) {
      const [longitude, latitude] = data.features[0].center;
      return { latitude, longitude };
    }
    
    return null;
  } catch (error) {
    console.error("Geocoding error:", error);
    return null;
  }
}

export function MapPreview() {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<any>(null);
  const [userLocation, setUserLocation] = useState<MapLocation | null>(null);
  const [nearbyCooks, setNearbyCooks] = useState<Cook[]>([]);
  const [selectedCook, setSelectedCook] = useState<Cook | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const supabase = createClient();

  // Get logged-in user data
  useEffect(() => {
    async function fetchUserData() {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session?.user) {
          console.log("No user session found");
          return null;
        }
        
        // Fetch user profile including address
        const { data, error } = await supabase
          .from('users')
          .select('*')
          .eq('id', session.user.id)
          .single();
          
        if (error) {
          console.error("Error fetching user data:", error);
          throw error;
        }
        
        console.log("Fetched user data:", data);
        return data;
      } catch (error) {
        console.error("Failed to fetch user:", error);
        return null;
      }
    }
    
    fetchUserData().then(userData => {
      if (userData) {
        setUser(userData);
        
        // Try to geocode user's address
        if (userData.address) {
          geocodeAddress(userData.address).then(location => {
            if (location) {
              console.log("Geocoded user address to:", location);
              setUserLocation(location);
            } else {
              // Fallback to browser geolocation if geocoding fails
              getBrowserLocation();
            }
          });
        } else {
          // No address, use browser geolocation
          getBrowserLocation();
        }
      } else {
        // No user data, use browser geolocation
        getBrowserLocation();
      }
    });
  }, [supabase]);

  // Fallback to browser geolocation
  const getBrowserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
          console.log("Browser location:", position.coords.latitude, position.coords.longitude);
        },
        (error) => {
          console.error("Geolocation error:", error);
          setError("Could not get your location. Please enable location services.");
          // Fallback to a default location (e.g., Mumbai)
          setUserLocation({
            latitude: 19.0760,
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
  };

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
          console.error("Error fetching cooks:", cooksError);
          throw cooksError;
        }

        console.log("Fetched cooks data:", cooksData);
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

        console.log("Cooks with distance calculated:", cooksWithDistance);
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
      if (!window.maptilersdk) {
        console.error("MapTiler SDK not loaded");
        return;
      }
      
      window.maptilersdk.config.apiKey = MAPTILER_API_KEY;
      
      const newMap = new window.maptilersdk.Map({
        container: mapRef.current!,
        style: window.maptilersdk.MapStyle.STREETS,
        center: [userLocation.longitude, userLocation.latitude],
        zoom: DEFAULT_ZOOM,
        attributionControl: false // Disable attribution control
      });
      
      // Add user marker
      newMap.on('load', () => {
        console.log("Map loaded");

        // Simple pin for user location - no label
        const userMarker = new window.maptilersdk.Marker({
          color: "#3b82f6", // Blue pin
          scale: 0.8 // Slightly smaller
        })
        .setLngLat([userLocation.longitude, userLocation.latitude])
        .addTo(newMap);
        
        // Add cook markers
        nearbyCooks.forEach(cook => {
          const cookLat = parseFloat(cook.latitude);
          const cookLng = parseFloat(cook.longitude);
          
          if (!isNaN(cookLat) && !isNaN(cookLng)) {
            // Create a popup for the cook
            const popup = new window.maptilersdk.Popup({ 
              offset: 25,
              closeButton: false, // Cleaner look
              maxWidth: '200px'
            })
            .setHTML(`
              <div style="padding: 5px;">
                <strong>${cook.first_name} ${cook.last_name}</strong><br>
                Rating: ${cook.rating}⭐<br>
                Distance: ${cook.distance?.toFixed(1)} km
              </div>
            `);
              
            // Simple marker for cooks
            new window.maptilersdk.Marker({
              color: cook.isAvailable ? "#10b981" : "#6b7280", // Green or gray
              scale: 0.8 // Slightly smaller
            })
            .setLngLat([cookLng, cookLat])
            .setPopup(popup)
            .addTo(newMap);
          }
        });

        // Remove attribution elements
        setTimeout(() => {
          const attributionElements = mapRef.current?.querySelectorAll('.maplibregl-ctrl-attrib, .maplibregl-ctrl-logo');
          attributionElements?.forEach(el => {
            el.remove();
          });
        }, 100);
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
  }, [userLocation, nearbyCooks, map, user]);

  return (
    <div className="px-6 mb-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle>Find Cooks Near You</CardTitle>
          </CardHeader>
          <CardContent>
            <div 
              ref={mapRef} 
              className="w-full h-[400px] rounded-md bg-slate-100 relative overflow-hidden"
            >
              {isLoading && (
                <div className="flex h-full items-center justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              )}
              {error && (
                <div className="flex h-full items-center justify-center text-red-500">
                  {error}
                </div>
              )}
              
              {/* Hide all attribution elements */}
              <style jsx global>{`
                .maplibregl-ctrl-attrib,
                .maplibregl-ctrl-logo,
                .maplibregl-ctrl-bottom-right,
                .maplibregl-ctrl-bottom-left {
                  display: none !important;
                }
                
                /* Ensure popups stay within bounds */
                .maplibregl-popup-content {
                  padding: 10px !important;
                  border-radius: 6px !important;
                  box-shadow: 0 2px 6px rgba(0,0,0,0.15) !important;
                  font-size: 12px !important;
                }
                
                /* Make sure markers stay within map */
                .maplibregl-marker {
                  z-index: 1 !important;
                }
              `}</style>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Nearby Dabba Providers</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center h-[360px]">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : nearbyCooks.length === 0 ? (
              <div className="text-center h-[360px] flex items-center justify-center">
                <div>
                  <p className="mb-4">No cooks found near your location.</p>
                  <p className="text-sm text-muted-foreground">Try expanding your search area or check back later.</p>
                </div>
              </div>
            ) : (
              <div className="space-y-4 h-[360px] overflow-y-auto pr-2">
                {nearbyCooks.map(cook => (
                  <div 
                    key={cook.id} 
                    className={`flex items-start gap-3 p-3 border rounded-lg hover:bg-slate-50 cursor-pointer ${selectedCook?.id === cook.id ? 'ring-2 ring-primary' : ''}`}
                    onClick={() => setSelectedCook(cook)}
                  >
                    <div className="flex-shrink-0">
                      <Image 
                        src={cook.profile_image || "/placeholder-chef.jpg"} 
                        alt={`${cook.first_name} ${cook.last_name}`}
                        width={50}
                        height={50}
                        className="rounded-full object-cover h-[50px] w-[50px]"
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
                        <span>{cook.distance?.toFixed(1)} km away</span>
                      </div>
                      <div className="mt-2">
                        <Badge 
                          variant={cook.isAvailable ? "default" : "secondary"}
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
    </div>
  );
}

