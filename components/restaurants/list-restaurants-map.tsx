"use client";

import { listRestaurants } from "@/app/restaurants/actions";
import { PlaceMarker } from "@/components/google-maps/place-marker";
import { UserLocationMarker } from "@/components/google-maps/user-location-marker";
import { type RestaurantResultsSortOption } from "@/types/restaurants";
import { useQuery } from "@tanstack/react-query";
import { Map } from "@vis.gl/react-google-maps";
import { useMemo } from "react";

interface RestaurantsMapProps {
  debouncedFilters: {
    sortOption: RestaurantResultsSortOption;
    distance: number;
    query: string;
  };
  userLocation?: GeolocationCoordinates | null;
}

export const ListRestaurantsMap = ({
  debouncedFilters,
  userLocation,
}: RestaurantsMapProps) => {
  // Fetch all restaurant data at once
  const { data } = useQuery({
    queryKey: [
      "restaurants",
      debouncedFilters.query.trim(),
      debouncedFilters.sortOption,
      debouncedFilters.distance,
      userLocation,
    ],
    queryFn: async () =>
      listRestaurants({
        query: debouncedFilters.query,
        sortOption: debouncedFilters.sortOption,
        distance: debouncedFilters.distance,
        lat: userLocation?.latitude,
        lng: userLocation?.longitude,
      }),
    enabled: !!userLocation,
  });

  // Memoize restaurants array to prevent unnecessary re-renders
  const restaurants = useMemo(() => {
    return data?.data || [];
  }, [data]);

  // Calculate map center
  const mapConfig = useMemo(() => {
    return {
      center: userLocation
        ? { lat: userLocation.latitude, lng: userLocation.longitude }
        : { lat: 37.3346443, lng: -122.0269972 },
      zoom: userLocation ? 13 : 10,
    };
  }, [userLocation]);

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
            <UserLocationMarker
              latitude={userLocation.latitude}
              longitude={userLocation.longitude}
            />
          )}

          {/* Restaurant markers */}
          {restaurants.map((restaurant) => (
            <PlaceMarker
              key={restaurant.id}
              latitude={restaurant.place?.latitude || 0}
              longitude={restaurant.place?.longitude || 0}
              title={restaurant.name_zh || restaurant.name_en || ""}
            />
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
