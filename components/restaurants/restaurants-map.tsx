"use client";

import { type RestaurantsData } from "@/app/api/restaurants/route";
import { api } from "@/lib/api";
import type { Paginated, SortOption } from "@/types/types";
import { useQuery } from "@tanstack/react-query";
import { AdvancedMarker, Map } from "@vis.gl/react-google-maps";
import { useMemo } from "react";

interface RestaurantsMapProps {
  debouncedFilters: {
    sortBy: SortOption;
    distance: number;
    query: string;
  };
  userLocation?: GeolocationCoordinates | null;
}

export const RestaurantsMap = ({
  debouncedFilters,
  userLocation,
}: RestaurantsMapProps) => {
  // Fetch all restaurant data at once
  const { data } = useQuery({
    queryKey: [
      "restaurants",
      debouncedFilters.query.trim(),
      debouncedFilters.sortBy,
      debouncedFilters.distance,
      userLocation,
    ],
    queryFn: async () => {
      const params = new URLSearchParams({
        limit: "100", // Get all restaurants
      });

      if (debouncedFilters.query.trim()) {
        params.append("q", debouncedFilters.query.trim());
      }

      // Add location parameters if available
      if (userLocation) {
        params.append("lat", userLocation.latitude.toString());
        params.append("lng", userLocation.longitude.toString());
      }

      // Add sort and distance as query params
      if (debouncedFilters.sortBy) {
        params.append("sort_by", debouncedFilters.sortBy);
      }

      if (debouncedFilters.distance > 0) {
        params.append("distance", debouncedFilters.distance.toString());
      }

      const response = await api.get<Paginated<RestaurantsData[]>>(
        `/restaurants?${params.toString()}`,
      );

      return response;
    },
    select: (res) => res.data.data,
  });

  // Memoize restaurants array to prevent unnecessary re-renders
  const restaurants = useMemo(() => {
    return data || [];
  }, [data]);

  // Calculate map center and bounds
  const mapConfig = useMemo(() => {
    if (restaurants.length === 0) {
      // Default to user location or fallback
      return {
        center: userLocation
          ? { lat: userLocation.latitude, lng: userLocation.longitude }
          : { lat: 37.7749, lng: -122.4194 }, // Default to San Francisco
        zoom: userLocation ? 12 : 10,
      };
    }

    // Calculate bounds from all restaurant locations
    const validRestaurants = restaurants.filter(
      (restaurant: RestaurantsData) =>
        restaurant.place?.lat != null && restaurant.place?.lng != null,
    );

    if (validRestaurants.length === 0) {
      return {
        center: userLocation
          ? { lat: userLocation.latitude, lng: userLocation.longitude }
          : { lat: 37.7749, lng: -122.4194 },
        zoom: userLocation ? 12 : 10,
      };
    }

    if (validRestaurants.length === 1) {
      return {
        center: {
          lat: validRestaurants[0].place.lat,
          lng: validRestaurants[0].place.lng,
        },
        zoom: 15,
      };
    }

    // Calculate center from all restaurants
    const bounds = validRestaurants.reduce(
      (
        acc: {
          minLat: number;
          maxLat: number;
          minLng: number;
          maxLng: number;
        },
        restaurant: RestaurantsData,
      ) => {
        const lat = restaurant.place.lat;
        const lng = restaurant.place.lng;

        return {
          minLat: Math.min(acc.minLat, lat),
          maxLat: Math.max(acc.maxLat, lat),
          minLng: Math.min(acc.minLng, lng),
          maxLng: Math.max(acc.maxLng, lng),
        };
      },
      {
        minLat: validRestaurants[0].place.lat,
        maxLat: validRestaurants[0].place.lat,
        minLng: validRestaurants[0].place.lng,
        maxLng: validRestaurants[0].place.lng,
      },
    );

    const centerLat = (bounds.minLat + bounds.maxLat) / 2;
    const centerLng = (bounds.minLng + bounds.maxLng) / 2;

    // Calculate zoom level based on bounds
    const latDiff = bounds.maxLat - bounds.minLat;
    const lngDiff = bounds.maxLng - bounds.minLng;
    const maxDiff = Math.max(latDiff, lngDiff);

    // Approximate zoom level calculation
    let zoom = 10;

    if (maxDiff < 0.01) {
      zoom = 16;
    } else if (maxDiff < 0.02) {
      zoom = 15;
    } else if (maxDiff < 0.05) {
      zoom = 14;
    } else if (maxDiff < 0.1) {
      zoom = 13;
    } else if (maxDiff < 0.2) {
      zoom = 12;
    } else if (maxDiff < 0.5) {
      zoom = 11;
    }

    return {
      center: { lat: centerLat, lng: centerLng },
      zoom,
    };
  }, [restaurants, userLocation]);

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="min-h-0 w-full flex-1 overflow-hidden rounded-md border">
        <Map
          defaultZoom={mapConfig.zoom}
          defaultCenter={mapConfig.center}
          mapId="restaurants-map"
          className="h-full w-full"
          gestureHandling="greedy"
          zoomControl={true}
          scrollwheel={true}
          fullscreenControl={true}
          mapTypeControl={false}
          streetViewControl={false}
        >
          {/* User location marker */}
          {userLocation && (
            <AdvancedMarker
              position={{
                lat: userLocation.latitude,
                lng: userLocation.longitude,
              }}
              title="Your Location"
            >
              <div className="h-4 w-4 rounded-full border-2 border-white bg-blue-500 shadow-lg"></div>
            </AdvancedMarker>
          )}

          {/* Restaurant markers */}
          {restaurants
            .filter(
              (restaurant: RestaurantsData) =>
                restaurant.place?.lat != null && restaurant.place?.lng != null,
            )
            .map((restaurant: RestaurantsData) => (
              <AdvancedMarker
                key={restaurant.id}
                position={{
                  lat: restaurant.place.lat,
                  lng: restaurant.place.lng,
                }}
                title={restaurant.name_zh || restaurant.name_en}
              >
                <div className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-white bg-red-500 shadow-lg">
                  <div className="h-2 w-2 rounded-full bg-white"></div>
                </div>
              </AdvancedMarker>
            ))}
        </Map>
      </div>
      {restaurants.length > 0 && (
        <div className="py-2 text-center text-sm">
          <span className="text-muted-foreground">显示了</span>
          &nbsp;
          <span className="font-medium">{restaurants.length}</span>
          &nbsp;
          <span className="text-muted-foreground">家餐厅</span>
        </div>
      )}
    </div>
  );
};
