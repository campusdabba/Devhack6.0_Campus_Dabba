"use client";

import { useEffect, useState, useRef } from "react";
import { createClient } from "@/utils/supabase/client";
import { useAuth } from "@/components/providers/auth-provider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Navigation, Star, Users, Clock } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

// Extend Window type for MapTiler
declare global {
  interface Window {
    maptilersdk: any;
  }
}

interface MapLocation {
  latitude: number;
  longitude: number;
  source: 'gps' | 'profile' | 'default';
  address?: string;
}

interface CookWithDistance {
  id: string;
  cook_id?: string;
  first_name: string;
  last_name: string;
  region?: string;
  rating?: number;
  latitude?: string;
  longitude?: string;
  address?: any;
  cuisineType?: any;
  profile_image?: string;
  totalorders?: number;
  isAvailable?: boolean;
  distance?: number;
}

const MAPTILER_API_KEY = "XZiubdaky8VdD93jgd6l";
const DEFAULT_ZOOM = 13;
const MAX_DISTANCE_KM = 10; // Maximum distance to show cooks (in kilometers)

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

// Function to geocode address using OpenStreetMap Nominatim API
async function geocodeAddress(address: any): Promise<{lat: number, lng: number} | null> {
  try {
    let addressString = "";
    if (typeof address === 'object' && address !== null) {
      const parts = [
        address.street,
        address.city,
        address.state,
        address.pincode
      ].filter(Boolean);
      addressString = parts.join(", ");
    } else {
      addressString = address;
    }

    console.log("🗺️ Geocoding address:", addressString);
    
    // Using OpenStreetMap Nominatim API (free)
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(addressString)}&limit=1&countrycodes=in`
    );
    
    if (!response.ok) {
      throw new Error('Geocoding failed');
    }
    
    const data = await response.json();
    
    if (data && data.length > 0) {
      return {
        lat: parseFloat(data[0].lat),
        lng: parseFloat(data[0].lon)
      };
    }
    
    return null;
  } catch (error) {
    console.error("🚨 Geocoding error:", error);
    return null;
  }
}

export function NearbyCooksMap() {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<any>(null);
  const [userLocation, setUserLocation] = useState<MapLocation | null>(null);
  const [nearbyCooks, setNearbyCooks] = useState<CookWithDistance[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [locationSource, setLocationSource] = useState<string>("");
  const { user } = useAuth();
  const supabase = createClient();

  // Function to get user's GPS location
  const getCurrentGPSLocation = (): Promise<MapLocation> => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error("Geolocation is not supported by this browser"));
        return;
      }

      console.log("📍 Requesting GPS location...");
      
      navigator.geolocation.getCurrentPosition(
        (position) => {
          console.log("✅ GPS location obtained:", position.coords);
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            source: 'gps'
          });
        },
        (error) => {
          console.error("❌ GPS location error:", error);
          // Handle different GPS errors
          let errorMessage = "GPS location failed";
          switch(error.code) {
            case error.PERMISSION_DENIED:
              errorMessage = "GPS permission denied by user";
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage = "GPS position unavailable";
              break;
            case error.TIMEOUT:
              errorMessage = "GPS request timed out";
              break;
          }
          reject(new Error(errorMessage));
        },
        {
          enableHighAccuracy: false, // Changed to false for better compatibility
          timeout: 8000, // Reduced timeout
          maximumAge: 600000 // 10 minutes
        }
      );
    });
  };

  // Function to get user's location from Supabase profile
  const getUserLocationFromProfile = async (): Promise<MapLocation | null> => {
    if (!user?.id) return null;

    try {
      console.log("👤 Fetching user profile for location...");
      
      const { data: userData, error } = await supabase
        .from('users')
        .select('address')
        .eq('id', user.id)
        .single();

      if (error || !userData?.address) {
        console.error("❌ Error fetching user address:", error);
        return null;
      }

      console.log("📋 User address from profile:", userData.address);
      
      const coordinates = await geocodeAddress(userData.address);
      
      if (coordinates) {
        const addressString = typeof userData.address === 'object' 
          ? `${userData.address.city}, ${userData.address.state}`
          : userData.address;
          
        return {
          latitude: coordinates.lat,
          longitude: coordinates.lng,
          source: 'profile',
          address: addressString
        };
      }
      
      return null;
    } catch (error) {
      console.error("🚨 Error getting location from profile:", error);
      return null;
    }
  };

  // Function to determine user location (GPS first, then profile, then default)
  const determineUserLocation = async (): Promise<MapLocation> => {
    console.log("🎯 Starting location determination process...");
    
    // Default location (Central India coordinates - Nagpur area, more central to actual cook locations)
    const defaultLocation: MapLocation = {
      latitude: 21.1458,
      longitude: 79.0882,
      source: 'default'
    };

    // First, try profile address (more reliable than GPS for web apps)
    try {
      console.log("📋 Trying profile address first...");
      const profileLocation = await getUserLocationFromProfile();
      if (profileLocation) {
        setLocationSource(`� Profile Address: ${profileLocation.address}`);
        console.log("✅ Using profile location:", profileLocation);
        return profileLocation;
      }
    } catch (profileError) {
      console.log("❌ Profile address failed:", profileError);
    }

    // Then try GPS location
    try {
      console.log("📍 Profile failed, trying GPS location...");
      const gpsLocation = await getCurrentGPSLocation();
      setLocationSource("📍 Current GPS Location");
      console.log("✅ Using GPS location:", gpsLocation);
      return gpsLocation;
    } catch (gpsError: any) {
      console.log("�❌ GPS failed:", gpsError?.message);
    }      // If both fail, use default
      console.log("🏙️ Both failed, using default location (Central India)");
      setLocationSource("🏙️ Default Location (Central India)");
      return defaultLocation;
  };

  // Get user's location (Profile first, then GPS fallback)
  useEffect(() => {
    const initializeLocation = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        console.log("🚀 Initializing location detection...");
        const location = await determineUserLocation();
        setUserLocation(location);
        console.log("🎯 Final location set:", location);
        
        // Show a helpful message if using default location
        if (location.source === 'default') {
          console.log("ℹ️ Using default location - users can still see cooks in Mumbai area");
        }
        
      } catch (error) {
        console.error("🚨 Location initialization failed:", error);
        // Even if location fails completely, set a default location so the map still works
        const fallbackLocation: MapLocation = {
          latitude: 21.1458,
          longitude: 79.0882,
          source: 'default'
        };
        setUserLocation(fallbackLocation);
        setLocationSource("🏙️ Default Location (Central India)");
        setError(null); // Don't show error, just use default location
      } finally {
        setIsLoading(false);
      }
    };

    initializeLocation();
  }, [user?.id]);

  // Fetch cooks data
  useEffect(() => {
    async function fetchCooks() {
      try {
        console.log("🍳 Fetching cooks from database...");
        
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
            region,
            cuisineType,
            totalorders
          `)
          .eq('isAvailable', true);

        if (cooksError) {
          throw cooksError;
        }

        console.log(`🍳 Found ${cooksData?.length || 0} total cooks`);
        return cooksData || [];
      } catch (error) {
        console.error("Error fetching cooks:", error);
        setError("Failed to load cooks data");
        return [];
      }
    }

    if (userLocation) {
      fetchCooks().then(async (cooks) => {
        // Process cooks and add coordinates/distance
        const processedCooks = await Promise.all(
          cooks.map(async (cook) => {
            let lat: number | null = null;
            let lng: number | null = null;

            // If cook already has coordinates, use them
            if (cook.latitude && cook.longitude) {
              lat = parseFloat(cook.latitude);
              lng = parseFloat(cook.longitude);
            } else if (cook.address) {
              // Geocode the cook's address
              const coords = await geocodeAddress(cook.address);
              if (coords) {
                lat = coords.lat;
                lng = coords.lng;
              }
            }

            // Calculate distance if we have coordinates
            let distance: number | undefined;
            if (lat && lng) {
              distance = calculateDistance(
                userLocation.latitude,
                userLocation.longitude,
                lat,
                lng
              );
            }

            return {
              ...cook,
              latitude: lat?.toString(),
              longitude: lng?.toString(),
              distance: distance
            } as CookWithDistance;
          })
        );

        // Filter cooks within MAX_DISTANCE_KM and sort by distance
        const nearbyFilteredCooks = processedCooks
          .filter(cook => cook.distance !== undefined && cook.distance <= MAX_DISTANCE_KM)
          .sort((a, b) => (a.distance || 0) - (b.distance || 0));

        console.log(`🎯 Found ${nearbyFilteredCooks.length} cooks within ${MAX_DISTANCE_KM}km`);
        setNearbyCooks(nearbyFilteredCooks);
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
      
      // Add markers when map loads
      newMap.on('load', () => {
        // Add user location marker with different colors based on source
        const userMarkerColor = userLocation.source === 'gps' ? "#10B981" : 
                               userLocation.source === 'profile' ? "#3B82F6" : "#6B7280";
        
        new window.maptilersdk.Marker({
          color: userMarkerColor,
          scale: 1.2
        })
        .setLngLat([userLocation.longitude, userLocation.latitude])
        .addTo(newMap);
        
        // Add cook markers
        nearbyCooks.forEach(cook => {
          if (cook.latitude && cook.longitude) {
            const cookLat = parseFloat(cook.latitude);
            const cookLng = parseFloat(cook.longitude);
            
            if (!isNaN(cookLat) && !isNaN(cookLng)) {
              const popup = new window.maptilersdk.Popup({ offset: 25 })
                .setHTML(`
                  <div style="padding: 8px;">
                    <strong>${cook.first_name} ${cook.last_name}</strong><br>
                    Rating: ${cook.rating || 4.0}⭐<br>
                    Distance: ${cook.distance?.toFixed(1)} km<br>
                    <a href="/cooks/${cook.id}" style="color: blue; text-decoration: underline; margin-top: 4px; display: inline-block;">View Menu</a>
                  </div>
                `);
                
              new window.maptilersdk.Marker({
                color: "#F59E0B"
              })
              .setLngLat([cookLng, cookLat])
              .setPopup(popup)
              .addTo(newMap);
            }
          }
        });
      });
      
      setMap(newMap);
    };

    return () => {
      if (map) {
        map.remove();
        setMap(null);
      }
    };
  }, [userLocation, nearbyCooks]);

  if (isLoading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Nearby Cooks Map
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center h-64 space-y-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <div className="text-center space-y-2">
              <p className="font-medium">Finding your location...</p>
              <p className="text-sm text-gray-600">
                Trying profile address → GPS → Default location
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-600">
            <MapPin className="h-5 w-5" />
            Map Error
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-red-600">{error}</p>
          <Button 
            onClick={() => window.location.reload()} 
            className="mt-4"
          >
            Retry
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="w-full space-y-6">
      {/* Location Info Banner */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Navigation className="h-5 w-5 text-blue-600" />
              <span className="font-medium">{locationSource}</span>
              {userLocation?.source === 'default' && (
                <Badge variant="outline" className="text-orange-600 border-orange-300">
                  Default Area
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="outline" className="flex items-center gap-1">
                <Users className="h-3 w-3" />
                {nearbyCooks.length} cooks nearby
              </Badge>
              {userLocation?.source === 'default' && (
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={async () => {
                    setIsLoading(true);
                    try {
                      const gpsLocation = await getCurrentGPSLocation();
                      setUserLocation(gpsLocation);
                      setLocationSource("📍 Current GPS Location");
                    } catch (error) {
                      console.log("GPS still not available:", error);
                    } finally {
                      setIsLoading(false);
                    }
                  }}
                >
                  📍 Use My Location
                </Button>
              )}
            </div>
          </div>
          {userLocation?.source === 'default' && (
            <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-800">
                💡 <strong>Tip:</strong> We're showing cooks in central India. 
                For more accurate results, you can click "Use My Location" to enable GPS, 
                or update your address in your profile settings.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Map and Cooks List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Map Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Interactive Map
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div 
              ref={mapRef} 
              className="w-full h-96 rounded-lg border border-gray-200"
              style={{ background: '#f8f9fa' }}
            />
            <div className="mt-4 flex items-center gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <div className={`w-4 h-4 rounded-full ${
                  userLocation?.source === 'gps' ? 'bg-green-500' : 
                  userLocation?.source === 'profile' ? 'bg-blue-500' : 'bg-gray-500'
                }`}></div>
                <span>Your Location {userLocation?.source === 'gps' ? '(GPS)' : '(Address)'}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-amber-500 rounded-full"></div>
                <span>Nearby Cooks</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Nearby Cooks List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Nearby Cooks ({nearbyCooks.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {nearbyCooks.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Users className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>No cooks found within {MAX_DISTANCE_KM}km</p>
                  <p className="text-sm">Try expanding your search radius</p>
                </div>
              ) : (
                nearbyCooks.map((cook) => (
                  <div
                    key={cook.id}
                    className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <Image
                          src={cook.profile_image || "/placeholder-chef.jpg"}
                          alt={`${cook.first_name} ${cook.last_name}`}
                          width={48}
                          height={48}
                          className="rounded-full object-cover"
                        />
                        <div className="absolute -bottom-1 -right-1 bg-green-500 w-4 h-4 rounded-full border-2 border-white"></div>
                      </div>
                      <div>
                        <h4 className="font-medium">
                          {cook.first_name} {cook.last_name}
                        </h4>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <MapPin className="h-3 w-3" />
                          <span>{cook.distance?.toFixed(1)} km away</span>
                          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          <span>{cook.rating || 4.0}</span>
                        </div>
                        <div className="flex items-center gap-1 mt-1">
                          {Array.isArray(cook.cuisineType) ? 
                            cook.cuisineType.slice(0, 2).map((cuisine: string, idx: number) => (
                              <Badge key={idx} variant="secondary" className="text-xs">
                                {cuisine}
                              </Badge>
                            )) : 
                            cook.cuisineType && typeof cook.cuisineType === 'string' && (
                              <Badge variant="secondary" className="text-xs">
                                {cook.cuisineType}
                              </Badge>
                            )
                          }
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-1 text-sm text-gray-600 mb-2">
                        <Clock className="h-3 w-3" />
                        <span>{cook.totalorders || 0} orders</span>
                      </div>
                      <Button size="sm" asChild>
                        <Link href={`/cooks/${cook.id}`}>
                          View Menu
                        </Link>
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
