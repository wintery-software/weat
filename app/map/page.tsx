"use client";

import PlaceDetails from "@/app/map/place-details";
import { PlaceMarker } from "@/components/map/markers/place-marker";
import { Button } from "@/components/ui/button";
import { useBasePlacesQuery, usePlaceQuery } from "@/hooks/map/use-places";
import { LOCAL_STORAGE_MAP_MAP_TYPE_ID } from "@/lib/constants";
import { Inter } from "@/lib/font";
import { getCurrentPosition, getGeolocationPermissionStatus, metersToLatLngDegrees } from "@/lib/maps";
import { cn } from "@/lib/utils";
import type { API } from "@/types/api";
import type { MapCameraChangedEvent, MapProps } from "@vis.gl/react-google-maps";
import { AdvancedMarker, ControlPosition, Map as GoogleMap, MapControl, useMap } from "@vis.gl/react-google-maps";
import {
  LucideEarth,
  LucideLoader2,
  LucideLoaderCircle,
  LucideLocate,
  LucideLocateFixed,
  LucideLocateOff,
  LucideRoute,
  LucideSearch,
  LucideUser,
} from "lucide-react";
import { type ReactNode, useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

const DEFAULT_CAMERA_PROPS: Required<Pick<MapProps, "defaultCenter" | "defaultZoom">> = {
  defaultCenter: { lat: 37.3346, lng: -122.009 },
  defaultZoom: 14,
};

const ICONS = {
  locate: <LucideLocate />,
  located: <LucideLocateFixed />,
  locateOff: <LucideLocateOff />,
  loading: <LucideLoaderCircle className="animate-spin" />,
  mapRoad: <LucideRoute />,
  mapSatellite: <LucideEarth />,
};

export default function Page() {
  const map = useMap();

  map?.setOptions({
    draggableCursor: "default",
  });

  const [location, setLocation] = useState<google.maps.LatLng>();
  const [bounds, setBounds] = useState<google.maps.LatLngBounds>();
  const placesQuery = useBasePlacesQuery(bounds, 100);
  const [selectedPlaceId, setSelectedPlaceId] = useState<string | null>(null);
  const selectedPlaceQuery = usePlaceQuery(selectedPlaceId);

  const [canSearchThisArea, setCanSearchThisArea] = useState(true);
  const [locateIcon, setLocateIcon] = useState<ReactNode>(ICONS.locateOff);
  const [mapTypeIcon, setMapTypeIcon] = useState<ReactNode>(ICONS.mapSatellite);

  const zoomAndPanTo = useCallback(
    (lat: number, lng: number, zoom: number) => {
      if (!map) {
        return;
      }

      map.setZoom(zoom);
      map.panTo({ lat, lng });
    },
    [map],
  );

  const locateUser = useCallback(() => {
    if (!map) {
      return;
    }

    setLocateIcon(ICONS.loading);

    getCurrentPosition()
      .then((pos) => {
        zoomAndPanTo(pos.lat, pos.lng, DEFAULT_CAMERA_PROPS.defaultZoom);
        searchPlacesOnIdle();

        setLocation(new google.maps.LatLng(pos));
        setLocateIcon(ICONS.located);
      })
      .catch((err) => {
        console.error(err);

        if (err instanceof GeolocationPositionError) {
          toast.error("GeolocationPositionError", {
            description: err.message,
          });
        } else {
          toast.error(err as never);
        }
      });
  }, [map, zoomAndPanTo]);

  const searchPlacesOnIdle = useCallback(
    (delay: number = 100) => {
      if (!map) {
        return;
      }

      google.maps.event.addListenerOnce(map, "idle", () => {
        setTimeout(() => {
          // Re-fetch data once the map is idle (animation finished)
          placesQuery.refetch().then(() => {
            setCanSearchThisArea(false);
          });
        }, delay);
      });
    },
    [map, placesQuery],
  );

  const toggleMapType = () => {
    if (!map) {
      return;
    }

    // Do not use useState to manage mapTypeId as it causes delay
    const newMapTypeId =
      map.getMapTypeId() === google.maps.MapTypeId.ROADMAP
        ? google.maps.MapTypeId.SATELLITE
        : google.maps.MapTypeId.ROADMAP;

    map.setMapTypeId(newMapTypeId);
    localStorage.setItem(LOCAL_STORAGE_MAP_MAP_TYPE_ID, newMapTypeId);

    setMapTypeIcon((prev) => (prev === ICONS.mapRoad ? ICONS.mapSatellite : ICONS.mapRoad));
  };

  const handleBoundsChange = useCallback(() => {
    if (!map) {
      return;
    }

    setBounds(map.getBounds());
  }, [map]);

  const handleCameraChange = useCallback(
    (e: MapCameraChangedEvent) => {
      if (!location) {
        return;
      }

      // Reset locate icon to default if camera movement is greater than value
      // Required because setting camera props will introduce a tiny offset for some reason
      const degree = metersToLatLngDegrees(1);

      if (
        !(
          Math.abs(location.lat() - e.detail.center.lat) > degree ||
          Math.abs(location.lng() - e.detail.center.lng) > degree
        )
      ) {
        return;
      }

      setLocateIcon(ICONS.locate);
      setCanSearchThisArea(true);
    },
    [location],
  );

  // Extract permission handling logic
  const handlePermissionStatus = (status: PermissionState) => {
    if (status === "granted") {
      setLocateIcon(ICONS.locate);
    } else if (status === "denied") {
      setLocateIcon(ICONS.locateOff);
      toast.error("Location access denied.");
    } else if (status === "prompt") {
      setLocateIcon(ICONS.locateOff);
    }
  };

  const handleSelectedChange = useCallback((id: string) => {
    // Place will be re-fetched on place ID change
    setSelectedPlaceId(id);
  }, []);

  // Actions on first load
  useEffect(() => {
    if (!map) {
      return;
    }

    // Restore map type from local storage if available
    const mapTypeId = localStorage.getItem(LOCAL_STORAGE_MAP_MAP_TYPE_ID);

    if (mapTypeId) {
      map.setMapTypeId(mapTypeId);
    }

    // Locate user and search area if location access is granted
    getGeolocationPermissionStatus().then((status) => {
      handlePermissionStatus(status);

      // Run if permission is granted or can be requested
      if (status === "granted" || status === "prompt") {
        locateUser();
      }
    });
  }, [locateUser, map]);

  useEffect(() => {
    if (!map) {
      return;
    }

    // Initial permission check
    getGeolocationPermissionStatus().then(handlePermissionStatus);

    // Listen for permission changes
    navigator.permissions.query({ name: "geolocation" }).then((status) => {
      status.addEventListener("change", () => {
        handlePermissionStatus(status.state);
      });
    });

    return () => {
      // Cleanup listener
      navigator.permissions.query({ name: "geolocation" }).then((status) => {
        status.removeEventListener("change", () => {
          handlePermissionStatus(status.state);
        });
      });
    };
  }, [map]);

  return (
    <div className="h-[calc(100dvh-3rem)] overflow-hidden">
      <GoogleMap
        {...DEFAULT_CAMERA_PROPS}
        onBoundsChanged={handleBoundsChange}
        onCameraChanged={handleCameraChange}
        mapId={process.env.NEXT_PUBLIC_GOOGLE_MAPS_RESTAURANTS_MAP_WEB_ID}
        gestureHandling={"greedy"}
        disableDefaultUI
        reuseMaps
      >
        <MapControl position={ControlPosition.TOP_LEFT}>
          <PlaceDetails
            isOpen={!!selectedPlaceId}
            isLoading={selectedPlaceQuery.isLoading}
            place={selectedPlaceQuery.data ?? ({} as API.Place)}
            setSelectedPlaceId={setSelectedPlaceId}
          />
        </MapControl>
        <MapControl position={ControlPosition.TOP_CENTER}>
          <div
            className={cn(
              Inter.className,
              "mt-4 transition-all ease-in-out",
              canSearchThisArea ? "translate-y-0 opacity-100" : "pointer-events-none -translate-y-2 opacity-0",
            )}
          >
            <Button
              disabled={placesQuery.isFetching}
              onClick={async () => {
                placesQuery.refetch().then(() => {
                  setCanSearchThisArea(false);
                });
              }}
            >
              {placesQuery.isFetching ? <LucideLoader2 className="animate-spin" /> : <LucideSearch />}
              Search this area
            </Button>
          </div>
        </MapControl>
        <MapControl position={ControlPosition.RIGHT_BOTTOM}>
          <div className="p-4">
            <div className="flex flex-col items-end gap-2">
              <Button
                variant="outline"
                size="icon"
                disabled={location && map?.getCenter()?.equals(location)}
                onClick={locateUser}
              >
                {locateIcon}
              </Button>
              <Button variant="outline" size="icon" onClick={toggleMapType}>
                {mapTypeIcon}
              </Button>
            </div>
          </div>
        </MapControl>
        <AdvancedMarker
          position={location}
          zIndex={999} // Always on top
        >
          <div
            className={cn(
              "flex",
              "rounded-full",
              "bg-blue-500",
              "border-2",
              "border-white",
              "size-6",
              "justify-center",
              "items-center",
              "transition",
              "shadow-sm",
              "shadow-blue-500",
              "hover:shadow-md",
              "hover:shadow-blue-500",
            )}
          >
            <LucideUser size={12} color="#fff" />
          </div>
        </AdvancedMarker>
        {placesQuery.data?.map((p) => <PlaceMarker key={p.id} place={p} onClick={handleSelectedChange} />)}
      </GoogleMap>
    </div>
  );
}
