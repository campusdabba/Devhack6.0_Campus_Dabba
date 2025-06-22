"use client";

import { useEffect, useState, useRef } from "react";
import { createClient } from "@/utils/supabase/client";
import { useAuth } from "@/components/providers/auth-provider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Navigation, Star, Users, Clock, User } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Cook } from "./types";

interface MapLocation {
  latitude: number;
  longitude: number;
  source: 'gps' | 'profile' | 'default';
  address?: string;
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
  const [nearbyCooks, setNearbyCooks] = useState<Cook[]>([]);
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
          reject(error);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000 // 5 minutes
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
    // Default location (Mumbai coordinates as fallback)
    const defaultLocation: MapLocation = {
      latitude: 19.0760,
      longitude: 72.8777,
      source: 'default'
    };

    try {
      // First, try to get GPS location
      console.log("🎯 Attempting to get GPS location...");
      const gpsLocation = await getCurrentGPSLocation();
      setLocationSource("📍 Current GPS Location");
      return gpsLocation;
    } catch (gpsError) {
      console.log("📍➡️📋 GPS failed, trying profile address...", gpsError.message);
      
      try {
        // If GPS fails, try profile address
        const profileLocation = await getUserLocationFromProfile();
        if (profileLocation) {
          setLocationSource(`📋 Profile Address: ${profileLocation.address}`);
          return profileLocation;
        }
      } catch (profileError) {
        console.log("📋❌ Profile address failed:", profileError);
      }
      
      // If both fail, use default
      console.log("🏙️ Using default location (Mumbai)");
      setLocationSource("🏙️ Default Location (Mumbai)");
      return defaultLocation;
    }
  };

  // Get user's location (GPS first, then profile fallback)
  useEffect(() => {
    const initializeLocation = async () => {
      try {
        setIsLoading(true);
        const location = await determineUserLocation();
        setUserLocation(location);
        console.log("🎯 Final location set:", location);
      } catch (error) {
        console.error("🚨 Location initialization failed:", error);
        setError("Unable to determine your location");
      } finally {
        setIsLoading(false);
      }
    };

    initializeLocation();
  }, [user?.id]);

  // Initialize map when location is available
  useEffect(() => {
    if (!userLocation || !mapRef.current) return;

    const initializeMap = async () => {
      try {
        const { Map } = await import('ol/Map');
        const { View } = await import('ol/View');
        const { fromLonLat } = await import('ol/proj');
        const { Tile: TileLayer, Vector: VectorLayer } = await import('ol/layer');
        const { XYZ } = await import('ol/source');
        const { Vector: VectorSource } = await import('ol/source');
        const { Point } = await import('ol/geom');
        const { Feature } = await import('ol');
        const { Style, Icon } = await import('ol/style');

        // Create map
        const newMap = new Map({
          target: mapRef.current,
          layers: [
            new TileLayer({
              source: new XYZ({
                url: `https://api.maptiler.com/maps/streets/{z}/{x}/{y}.png?key=${MAPTILER_API_KEY}`,
                attributions: '© MapTiler © OpenStreetMap contributors',
              }),
            }),
          ],
          view: new View({
            center: fromLonLat([userLocation.longitude, userLocation.latitude]),
            zoom: DEFAULT_ZOOM,
          }),
        });

        // Create vector source for markers
        const vectorSource = new VectorSource();

        // Add user location marker with appropriate icon
        const userMarker = new Feature({
          geometry: new Point(fromLonLat([userLocation.longitude, userLocation.latitude])),
          type: 'user',
          name: 'Your Location',
          source: userLocation.source
        });

        // Different icons based on location source
        const getUserIcon = () => {
          const color = userLocation.source === 'gps' ? '#10B981' : 
                       userLocation.source === 'profile' ? '#3B82F6' : '#6B7280';
          return new Style({
            icon: new Icon({
              src: `data:image/svg+xml;base64,${btoa(`
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="${color}">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                  <circle cx="12" cy="9" r="1.5" fill="white"/>
                </svg>
              `)}`,
              anchor: [0.5, 1],
              scale: 1.2
            })
          });
        };

        userMarker.setStyle(getUserIcon());
        vectorSource.addFeature(userMarker);

        // Add cook markers
        nearbyCooks.forEach((cook, index) => {
          if (cook.latitude && cook.longitude) {
            const cookMarker = new Feature({
              geometry: new Point(fromLonLat([parseFloat(cook.longitude), parseFloat(cook.latitude)])),
              type: 'cook',
              cook: cook
            });

            const cookIcon = new Style({
              icon: new Icon({
                src: `data:image/svg+xml;base64,${btoa(`
                  <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="#F59E0B">
                    <path d="M8.1 13.34l2.83-2.83L3.91 3.5c-1.56 1.56-1.56 4.09 0 5.66l4.19 4.18zm6.78-1.81c1.53.71 3.68.21 5.27-1.38 1.91-1.91 2.28-4.65.81-6.12-1.46-1.46-4.20-1.10-6.12.81-1.59 1.59-2.09 3.74-1.38 5.27L3.7 19.87l1.41 1.41L12 14.41l6.88 6.88 1.41-1.41L13.41 13l1.47-1.47z"/>
                  </svg>
                `)}`,
                anchor: [0.5, 1],
                scale: 1
              })
            });

            cookMarker.setStyle(cookIcon);
            vectorSource.addFeature(cookMarker);
          }
        });

        // Add vector layer to map
        const vectorLayer = new VectorLayer({
          source: vectorSource,
        });

        newMap.addLayer(vectorLayer);
        setMap(newMap);

        // Add click handler for cook markers
        newMap.on('click', (event) => {
          const feature = newMap.forEachFeatureAtPixel(event.pixel, (feature) => feature);
          if (feature && feature.get('type') === 'cook') {
            const cook = feature.get('cook');
            console.log('Clicked cook:', cook);
            // You can add a popup or navigation here
          }
        });

      } catch (error) {
        console.error('Error initializing map:', error);
        setError('Failed to load map');
      }
    };

    initializeMap();

    return () => {
      if (map) {
        map.setTarget(null);
      }
    };
  }, [userLocation, nearbyCooks]);

  // Fetch nearby cooks
  useEffect(() => {
    if (!userLocation) return;

    const fetchNearbyCooks = async () => {
      try {
        console.log("🍳 Fetching cooks from database...");
        
        const { data: cooksData, error } = await supabase
          .from("cooks")
          .select("*")
          .eq('isAvailable', true);

        if (error) {
          console.error("Error fetching cooks:", error);
          return;
        }

        if (!cooksData) {
          console.log("No cooks found");
          return;
        }

        console.log(`🍳 Found ${cooksData.length} total cooks`);

        // Process cooks and add coordinates
        const processedCooks = await Promise.all(
          cooksData.map(async (cook) => {
            let lat = null;
            let lng = null;
            let distance = null;

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
            };
          })
        );

        // Filter cooks within MAX_DISTANCE_KM and sort by distance
        const nearbyFilteredCooks = processedCooks
          .filter(cook => cook.distance !== null && cook.distance <= MAX_DISTANCE_KM)
          .sort((a, b) => (a.distance || 0) - (b.distance || 0));

        console.log(`🎯 Found ${nearbyFilteredCooks.length} cooks within ${MAX_DISTANCE_KM}km`);
        setNearbyCooks(nearbyFilteredCooks);
      } catch (error) {
        console.error("Error fetching nearby cooks:", error);
        setError("Failed to fetch nearby cooks");
      }
    };

    fetchNearbyCooks();
  }, [userLocation]);

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
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <span className="ml-2">Loading map and finding your location...</span>
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
            </div>
            <Badge variant="outline" className="flex items-center gap-1">
              <Users className="h-3 w-3" />
              {nearbyCooks.length} cooks nearby
            </Badge>
          </div>
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
                <div className="w-4 h-4 bg-green-500 rounded-full"></div>
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
                            cook.cuisineType.slice(0, 2).map((cuisine, idx) => (
                              <Badge key={idx} variant="secondary" className="text-xs">
                                {cuisine}
                              </Badge>
                            )) : 
                            cook.cuisineType && (
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
