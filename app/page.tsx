"use client";

import { PlaceMarker } from "@/components/map/markers/place-marker";
import { Button } from "@/components/ui/button";
import { LOCAL_STORAGE_MAP_MAP_TYPE_ID } from "@/lib/constants";
import { getCurrentPosition, getGeolocationPermissionStatus, metersToLatLngDegrees } from "@/lib/maps";
import { cn, fetcher, getLastUpdated } from "@/lib/utils";
import type { MapCameraChangedEvent, MapCameraProps, MapProps } from "@vis.gl/react-google-maps";
import { AdvancedMarker, ControlPosition, Map as GoogleMap, MapControl, useMap } from "@vis.gl/react-google-maps";
import { LucideEarth, LucideLoaderCircle, LucideLocate, LucideLocateFixed, LucideLocateOff, LucideRoute, LucideUser } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import * as React from "react";
import { type ReactNode, useCallback, useEffect, useState } from "react";
import { flushSync } from "react-dom";
import { toast } from "sonner";
import useSWRImmutable from "swr/immutable";





// Apple Park :)
const DEFAULT_CAMERA_PROPS: Required<
  Pick<MapProps, "defaultCenter" | "defaultZoom">
> = {
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

  const [cameraProps, setCameraProps] = useState<MapCameraProps>();
  const [isLocateButtonDisabled, setIsLocateButtonDisabled] = useState(true);
  const [location, setLocation] = useState<google.maps.LatLng>();
  const [locateIcon, setLocateIcon] = useState<ReactNode>(ICONS.locateOff);
  const [mapTypeIcon, setMapTypeIcon] = useState<ReactNode>(ICONS.mapSatellite);
  const [searchThisAreaButtonVisible, setSearchThisAreaButtonVisible] =
    useState(false);
  // To improve performance
  const [renderedData, setRenderedData] = useState<Place[]>();
  // Use useSWRImmutable to disable revalidation
  const { data } = useSWRImmutable<Place[]>("/api/places", fetcher);

  const searchThisArea = useCallback(() => {
    if (!data) {
      throw new Error("Places are not available.");
    }

    const bounds = map?.getBounds();

    if (!bounds) {
      throw new Error("Map bounds are not available.");
    }

    const visiblePlaces = data.filter((p) => bounds.contains(p.position));

    setRenderedData(visiblePlaces);
    setSearchThisAreaButtonVisible(false);

    toast(
      `Showing ${visiblePlaces.length} place${visiblePlaces.length !== 1 ? "s" : ""}.`,
      {
        duration: 1000,
      },
    );
  }, [data, map]);

  const locateUserAndSearchArea = useCallback(() => {
    if (!map) {
      throw new Error("Map is not available.");
    }

    setLocateIcon(ICONS.loading);

    getCurrentPosition()
      .then((pos) => {
        setLocation(new google.maps.LatLng(pos));

        // Ensure camera is updated synchronously
        // so searchThisArea() works correctly
        flushSync(() =>
          setCameraProps({
            center: pos,
            zoom: DEFAULT_CAMERA_PROPS.defaultZoom,
          }),
        );

        searchThisArea();
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
  }, [map, searchThisArea]);

  const handleCameraChange = useCallback(
    (e: MapCameraChangedEvent) => {
      setCameraProps(e.detail);

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

  const toggleMapType = () => {
    if (!map) {
      throw new Error("Map is not available.");
    }

    // Do not use useState to manage mapTypeId as it causes delay
    const newMapTypeId =
      map.getMapTypeId() === google.maps.MapTypeId.ROADMAP
        ? google.maps.MapTypeId.SATELLITE
        : google.maps.MapTypeId.ROADMAP;

    map.setMapTypeId(newMapTypeId);
    localStorage.setItem(LOCAL_STORAGE_MAP_MAP_TYPE_ID, newMapTypeId);

    setMapTypeIcon((prev) =>
      prev === ICONS.mapRoad ? ICONS.mapSatellite : ICONS.mapRoad,
    );
  };

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

  // Render once actions
  useEffect(() => {
    if (!map || !data) {
      return;
    }

    // Restore map type from local storage if available
    const mapTypeId = localStorage.getItem(LOCAL_STORAGE_MAP_MAP_TYPE_ID);

    if (mapTypeId) {
      map.setMapTypeId(mapTypeId);
    }

    getGeolocationPermissionStatus().then((status) => {
      handlePermissionStatus(status);

      // Run if permission is granted or can be requested
      if (status === "granted" || status === "prompt") {
        locateUserAndSearchArea();
      }
    });
  }, [data, locateUserAndSearchArea, map]);

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
        {...cameraProps}
        onCameraChanged={handleCameraChange}
        onZoomChanged={() => setSearchThisAreaButtonVisible(true)}
        onDrag={() => setSearchThisAreaButtonVisible(true)}
        mapId={process.env.NEXT_PUBLIC_GOOGLE_MAPS_RESTAURANTS_MAP_WEB_ID}
        gestureHandling={"greedy"}
        disableDefaultUI
        reuseMaps
      >
        <MapControl position={ControlPosition.TOP_CENTER}>
          <div className="flex w-screen justify-center pt-4">
            <AnimatePresence>
              {searchThisAreaButtonVisible && (
                <motion.div
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  variants={{
                    hidden: { opacity: 0, y: -16 },
                    visible: { opacity: 1, y: 0 },
                  }}
                  transition={{
                    type: "tween",
                    ease: "easeInOut",
                    duration: 0.2,
                  }}
                  onClick={searchThisArea}
                >
                  <Button variant="outline">Search this area</Button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </MapControl>
        <MapControl position={ControlPosition.RIGHT_BOTTOM}>
          <div className="flex flex-col items-end gap-2 p-4">
            <Button
              variant="outline"
              size="icon"
              disabled={isLocateButtonDisabled}
              onClick={locateUserAndSearchArea}
            >
              {locateIcon}
            </Button>
            <Button variant="outline" size="icon" onClick={toggleMapType}>
              {mapTypeIcon}
            </Button>
            {data && (
              <div className="bg-white/50 px-1.5 py-0.5 text-[10px] text-black">
                Last Updated:&nbsp;{getLastUpdated(data)}
              </div>
            )}
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
        {renderedData?.map((p) => {
          return <PlaceMarker key={p.id} place={p} />;
        })}
      </GoogleMap>
    </div>
  );
}
