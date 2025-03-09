"use client";

import DevelopmentView from "@/components/dev/development_view";
import { PlaceMarker } from "@/components/map/markers/place-marker";
import { Button } from "@/components/ui/button";
import { LOCAL_STORAGE_MAP_MAP_TYPE_ID } from "@/lib/constants";
import { getCurrentPosition, getGeolocationPermissionStatus, metersToLatLngDegrees } from "@/lib/maps";
import { cn, fetcher, getLastUpdated } from "@/lib/utils";
import { useDebounce } from "@uidotdev/usehooks";
import type { MapCameraChangedEvent, MapProps } from "@vis.gl/react-google-maps";
import { AdvancedMarker, ControlPosition, Map as GoogleMap, MapControl, useMap } from "@vis.gl/react-google-maps";
import {
  LucideEarth,
  LucideLoaderCircle,
  LucideLocate,
  LucideLocateFixed,
  LucideLocateOff,
  LucideRoute,
  LucideUser,
} from "lucide-react";
import { type ReactNode, useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import useSWRImmutable from "swr/immutable";

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
  const [location, setLocation] = useState<google.maps.LatLng>();
  // Use useSWRImmutable to disable revalidation
  const { data } = useSWRImmutable<Weat.Place[]>("/api/places", fetcher);
  const { data: dataSource } = useSWRImmutable<{ source: string }>("/api/places/source", fetcher);

  const [bounds, setBounds] = useState<google.maps.LatLngBounds>();
  // Wait for bounds to stabilize before updating visible places
  const debouncedBounds = useDebounce(bounds, 500);
  // Only render places within bounds to prevent lag
  const [placesInBounds, setVisiblePlaces] = useState<Weat.Place[]>([]);

  const [isLocateButtonDisabled, setIsLocateButtonDisabled] = useState(true);
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
        // Animated
        zoomAndPanTo(pos.lat, pos.lng, DEFAULT_CAMERA_PROPS.defaultZoom);

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

  const checkPlacesInBounds = useCallback(() => {
    if (!map || !data) {
      return;
    }

    const bounds = map.getBounds();

    if (!bounds) {
      return;
    }

    const inBounds = data.filter((p) => bounds.contains(p.position));
    setVisiblePlaces(inBounds);
  }, [map, data]);

  // TODO: Use it
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const fitBoundsToMarkers = () => {
    if (!map) {
      return;
    }

    const bounds = new google.maps.LatLngBounds();
    placesInBounds.forEach((p) => bounds.extend(p.position));

    // Animate the zoom to fit all markers
    map.fitBounds(bounds, 50);
  };

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
      // Reset locate icon to default if camera movement is greater than value
      // Required because setting camera props will introduce a tiny offset for some reason
      const degree = metersToLatLngDegrees(1);

      if (
        location &&
        (Math.abs(location.lat() - e.detail.center.lat) > degree ||
          Math.abs(location.lng() - e.detail.center.lng) > degree)
      ) {
        setLocateIcon(ICONS.locate);
      }
    },
    [location],
  );

  // Extract permission handling logic
  const handlePermissionStatus = (status: PermissionState) => {
    if (status === "granted") {
      setLocateIcon(ICONS.locate);
      setIsLocateButtonDisabled(false);
    } else if (status === "denied") {
      setLocateIcon(ICONS.locateOff);
      setIsLocateButtonDisabled(true);
      toast.error("Location access denied.");
    } else if (status === "prompt") {
      setLocateIcon(ICONS.locateOff);
      setIsLocateButtonDisabled(false);
    }
  };

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

  // Refresh visible markers when bounds change
  useEffect(() => {
    if (!debouncedBounds || !data) {
      return;
    }

    const visible = data.filter((marker) => debouncedBounds.contains(marker.position));

    setVisiblePlaces(visible);
  }, [debouncedBounds, data]);

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
    <div className="flex h-full w-full flex-col">
      <GoogleMap
        className="grow"
        {...DEFAULT_CAMERA_PROPS}
        onBoundsChanged={handleBoundsChange}
        onCameraChanged={handleCameraChange}
        onIdle={checkPlacesInBounds}
        mapId={process.env.NEXT_PUBLIC_GOOGLE_MAPS_RESTAURANTS_MAP_WEB_ID}
        gestureHandling={"greedy"}
        disableDefaultUI
        reuseMaps
      >
        <MapControl position={ControlPosition.TOP_RIGHT}>
          <DevelopmentView style={true}>
            <div className="text-right text-xs text-black">
              <p>Data source: {dataSource?.source}</p>
              {data && (
                <>
                  <p>Count: {data.length}</p>
                  <p>Last updated:&nbsp;{getLastUpdated(data)}</p>
                </>
              )}
            </div>
          </DevelopmentView>
        </MapControl>
        <MapControl position={ControlPosition.RIGHT_BOTTOM}>
          <div className="flex flex-col items-end gap-2 p-4">
            <Button variant="outline" size="icon" disabled={isLocateButtonDisabled} onClick={locateUser}>
              {locateIcon}
            </Button>
            <Button variant="outline" size="icon" onClick={toggleMapType}>
              {mapTypeIcon}
            </Button>
          </div>
        </MapControl>
        <AdvancedMarker
          position={location}
          onMouseEnter={(e) => e.preventDefault()}
          onMouseLeave={(e) => e.preventDefault()}
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
        {placesInBounds?.map((p) => {
          return <PlaceMarker key={p.id} place={p} />;
        })}
      </GoogleMap>
    </div>
  );
}
