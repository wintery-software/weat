"use client";

import DevelopmentBanner from "@/components/dev/development_banner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  getCurrentPosition,
  getGeolocationPermissionStatus,
  haversineDistance,
  isCoordinateInBounds,
  metersToLatLngDegrees,
} from "@/lib/maps";
import { cn, fetcher } from "@/lib/utils";
import type {
  MapCameraChangedEvent,
  MapCameraProps,
  MapProps,
} from "@vis.gl/react-google-maps";
import {
  AdvancedMarker,
  CollisionBehavior,
  ControlPosition,
  Map as GoogleMap,
  MapControl,
  useMap,
} from "@vis.gl/react-google-maps";
import {
  EarthIcon,
  LoaderCircleIcon,
  LocateFixedIcon,
  LocateIcon,
  LocateOffIcon,
  RouteIcon,
  UserIcon,
  UtensilsIcon,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
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
  locate: <LocateIcon />,
  located: <LocateFixedIcon />,
  locateOff: <LocateOffIcon />,
  loading: <LoaderCircleIcon className="animate-spin" />,
  mapRoad: <RouteIcon />,
  mapSatellite: <EarthIcon />,
};

export default function Page() {
  const map = useMap();

  const [cameraProps, setCameraProps] = useState<MapCameraProps>();
  const [isLocateButtonDisabled, setIsLocateButtonDisabled] = useState(true);
  const [location, setLocation] = useState<google.maps.LatLng>();
  const [locateUserIcon, setLocateUserIcon] = useState<ReactNode>(
    ICONS.locateOff,
  );
  const [toggleMapTypeIcon, setToggleMapTypeIcon] = useState<ReactNode>(
    ICONS.mapSatellite,
  );
  const [searchThisAreaButtonVisible, setSearchThisAreaButtonVisible] =
    useState(false);
  // To improve performance
  const [renderedData, setRenderedData] = useState<Restaurant[]>();
  // Use useSWRImmutable to disable revalidation
  const { data } = useSWRImmutable<Restaurant[]>("/api/places", fetcher);

  const searchThisArea = useCallback(() => {
    if (!data) {
      throw new Error("Places are not available.");
    }

    const bounds = map?.getBounds();

    if (!bounds) {
      throw new Error("Map bounds are not available.");
    }

    const areaData = data.filter((r) =>
      isCoordinateInBounds({ lat: r.latitude, lng: r.longitude }, bounds),
    );

    setRenderedData(areaData);
    setSearchThisAreaButtonVisible(false);

    toast(
      `Showing ${areaData.length} place${areaData.length !== 1 ? "s" : ""}.`,
      {
        duration: 1000,
      },
    );
  }, [data, map]);

  const locateUserAndSearchArea = useCallback(() => {
    if (!map) {
      throw new Error("Map is not available.");
    }

    setLocateUserIcon(ICONS.loading);

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
        setLocateUserIcon(ICONS.located);
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

      // Reset locate icon to default if camera movement is greater than 100m
      const degree = metersToLatLngDegrees(100);

      if (
        location &&
        (Math.abs(location.lat() - e.detail.center.lat) > degree ||
          Math.abs(location.lng() - e.detail.center.lng) > degree)
      ) {
        setLocateUserIcon(ICONS.locate);
      }
    },
    [location],
  );

  const toggleMapType = () => {
    if (!map) {
      throw new Error("Map is not available.");
    }

    // Do not use useState to manage mapTypeId as it causes delay
    map.setMapTypeId(
      map.getMapTypeId() === google.maps.MapTypeId.ROADMAP
        ? google.maps.MapTypeId.SATELLITE
        : google.maps.MapTypeId.ROADMAP,
    );

    setToggleMapTypeIcon((prev) =>
      prev === ICONS.mapRoad ? ICONS.mapSatellite : ICONS.mapRoad,
    );
  };

  // Extract permission handling logic
  const handlePermissionStatus = (status: PermissionState) => {
    if (status === "granted") {
      setLocateUserIcon(ICONS.locate);
      setIsLocateButtonDisabled(false);
    } else if (status === "denied") {
      setLocateUserIcon(ICONS.locateOff);
      setIsLocateButtonDisabled(true);
      toast.error("Location access denied.");
    } else if (status === "prompt") {
      setLocateUserIcon(ICONS.locateOff);
      setIsLocateButtonDisabled(false);
    }
  };

  // Render once actions
  useEffect(() => {
    if (!map || !data) {
      return;
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
      <DevelopmentBanner>
        <code>googlechrome://</code>&nbsp; URL scheme will not work in
        development due to HTTPS.
      </DevelopmentBanner>
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
        <MapControl position={ControlPosition.TOP}>
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
                  <Button variant="secondary">Search this area</Button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </MapControl>
        <MapControl position={ControlPosition.RIGHT_BOTTOM}>
          <div className="flex flex-col gap-2 p-4">
            <Button
              variant="outline"
              size="icon"
              disabled={isLocateButtonDisabled}
              onClick={locateUserAndSearchArea}
            >
              {locateUserIcon}
            </Button>
            <Button variant="outline" size="icon" onClick={toggleMapType}>
              {toggleMapTypeIcon}
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
            <UserIcon size={12} color="#fff" />
          </div>
        </AdvancedMarker>
        {renderedData?.map((r) => (
          <AdvancedMarker
            key={r.id}
            position={{ lat: r.latitude, lng: r.longitude }}
            collisionBehavior={CollisionBehavior.REQUIRED_AND_HIDES_OPTIONAL}
          >
            <Popover>
              <PopoverTrigger>
                <div
                  className={cn(
                    "flex",
                    "rounded-full",
                    "bg-orange-400",
                    "border-2",
                    "border-white",
                    "size-6",
                    "justify-center",
                    "items-center",
                    "transition",
                    "shadow-sm",
                    "shadow-orange-400",
                    "hover:shadow-md",
                    "hover:shadow-orange-400",
                  )}
                >
                  <UtensilsIcon size={12} color="white" />
                </div>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-2">
                <div className="flex flex-col space-y-2">
                  <div className="flex flex-col space-y-0.5">
                    <p className="text-sm font-semibold">{r.name}</p>
                    {r.name_translation && (
                      <p className="text-xs">{r.name_translation}</p>
                    )}
                  </div>
                  {r.cuisine && (
                    <div className="flex gap-1">
                      <Badge>{r.cuisine}</Badge>
                    </div>
                  )}
                  <div className="flex flex-col space-y-0.5">
                    <Link
                      href={r.google_maps_url}
                      target="_blank"
                      title="Open in Google Maps"
                      className="text-xs text-blue-500 hover:underline hover:underline-offset-2"
                    >
                      {r.address}
                    </Link>
                    {location && (
                      <p className="text-xs text-muted-foreground">
                        {haversineDistance(
                          location.lat(),
                          location.lng(),
                          r.latitude,
                          r.longitude,
                          "mi",
                        ).toFixed(2)}
                        &nbsp;mi away (approx.)
                      </p>
                    )}
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </AdvancedMarker>
        ))}
      </GoogleMap>
    </div>
  );
}
