"use client";

import { PlaceMarker } from "@/components/google-maps/place-marker";
import { UserLocationMarker } from "@/components/google-maps/user-location-marker";
import { Button } from "@/components/ui/button";
import {
  ControlPosition,
  Map,
  MapControl,
  useMap,
} from "@vis.gl/react-google-maps";
import { LocateIcon } from "lucide-react";
import { useEffect, useState } from "react";

interface RestaurantMapProps {
  title: string;
  lat: number;
  lng: number;
}

const DEFAULT_ZOOM = 15;

const ResetCenterButton = ({ lat, lng }: { lat: number; lng: number }) => {
  const map = useMap();

  const handleReset = () => {
    if (map) {
      map.setCenter({ lat, lng });
      map.setZoom(DEFAULT_ZOOM);
    }
  };

  return (
    <div className="mt-2 mr-2">
      <Button
        size="sm"
        variant="secondary"
        onClick={handleReset}
        className="shadow-md"
      >
        <LocateIcon className="h-4 w-4" />
      </Button>
    </div>
  );
};

export const RestaurantMap = ({ title, lat, lng }: RestaurantMapProps) => {
  const [userLocation, setUserLocation] =
    useState<GeolocationCoordinates | null>(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation(position.coords);
        },
        (error) => {
          console.error("Error getting user location:", error);
        },
        {
          enableHighAccuracy: false,
          timeout: 10000,
          maximumAge: 300000,
        },
      );
    }
  }, []);

  return (
    <div className="h-64 w-full md:h-80">
      <Map
        defaultZoom={DEFAULT_ZOOM}
        defaultCenter={{ lat, lng }}
        mapId="restaurant-detail-map"
        gestureHandling="greedy"
        disableDefaultUI={true}
        zoomControl={false}
        fullscreenControl={false}
        mapTypeControl={false}
        streetViewControl={false}
      >
        {/* Restaurant marker */}
        <PlaceMarker latitude={lat} longitude={lng} title={title} />

        {/* User location marker */}
        {userLocation && (
          <UserLocationMarker
            latitude={userLocation.latitude}
            longitude={userLocation.longitude}
          />
        )}

        <MapControl position={ControlPosition.TOP_RIGHT}>
          <ResetCenterButton lat={lat} lng={lng} />
        </MapControl>
      </Map>
    </div>
  );
};
