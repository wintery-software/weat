"use client";

import { SearchBar } from "@/app/_search_bar";
import DevelopmentOnly from "@/components/development_only";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Banner,
  BannerAction,
  BannerClose,
  BannerIcon,
  BannerTitle,
} from "@/components/ui/kibo-ui/banner";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { getCurrentLocation } from "@/lib/maps";
import {
  cn,
  fetcher,
  getGoogleChromeURLScheme,
  haversineDistance,
} from "@/lib/utils";
import { SiGooglechrome } from "@icons-pack/react-simple-icons";
import {
  AdvancedMarker,
  CollisionBehavior,
  ControlPosition,
  Map,
  MapCameraChangedEvent,
  MapCameraProps,
  MapControl,
  useMap,
} from "@vis.gl/react-google-maps";
import { Braces, Earth, Locate, User, Utensils } from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { CustomView, isIOS, isSafari } from "react-device-detect";
import { toast } from "sonner";
import useSWR from "swr";

// Apple Park :)
const DEFAULT_CENTER = { lat: 37.3346, lng: -122.009 };
const DEFAULT_ZOOM = 14;

export default function Page() {
  const map = useMap();

  useEffect(() => {
    if (!map) return;
  }, [map]);

  const [mapTypeId, setMapTypeId] = useState<google.maps.MapTypeId>();
  const [currentLocation, setCurrentLocation] =
    useState<google.maps.LatLngLiteral>();

  const [cameraProps, setCameraProps] = useState<MapCameraProps>({
    center: DEFAULT_CENTER,
    zoom: DEFAULT_ZOOM - 2,
  });

  const { data } = useSWR<Restaurant[]>("/api/restaurants", fetcher);

  // Limit rendered data based on the viewport to improve performance
  const limitDataInBound = useCallback(
    (
      data: Restaurant[] | undefined,
      bounds: google.maps.LatLngBounds | undefined,
    ) => {
      if (!data || !bounds) {
        return [];
      }

      const limitedData = data.filter(
        (r) =>
          r.latitude >= bounds.getSouthWest().lat() &&
          r.latitude <= bounds.getNorthEast().lat() &&
          r.longitude >= bounds.getSouthWest().lng() &&
          r.longitude <= bounds.getNorthEast().lng(),
      );

      console.log(limitedData.length);
      return limitedData;
    },
    [],
  );

  const handleCameraChange = useCallback((e: MapCameraChangedEvent) => {
    setCameraProps(e.detail);
    setSearchInThisAreaButtonVisible(true);
  }, []);

  const [searchInThisAreaButtonVisible, setSearchInThisAreaButtonVisible] =
    useState(false);
  const [renderedData, setRenderedData] = useState<Restaurant[]>([]);

  const locateUser = useCallback(() => {
    getCurrentLocation()
      .then((pos) => {
        setCurrentLocation(pos);
        setCameraProps({
          center: pos,
          zoom: DEFAULT_ZOOM,
        });
      })
      .catch((err) => {
        console.error(err);

        if (err instanceof GeolocationPositionError) {
          toast.error("GeolocationPositionError", { description: err.message });
        } else {
          toast.error(err);
        }
      });
  }, []);

  // Locate user on first render
  useEffect(() => {
    setRenderedData(limitDataInBound(data, map?.getBounds()));
    locateUser();
  }, [data, limitDataInBound, locateUser, map]);

  const toggleMapType = useCallback(() => {
    setMapTypeId((current) =>
      current === google.maps.MapTypeId.ROADMAP
        ? google.maps.MapTypeId.SATELLITE
        : google.maps.MapTypeId.ROADMAP,
    );
  }, []);

  return (
    <>
      <CustomView condition={isIOS && isSafari}>
        <Banner>
          <BannerIcon icon={SiGooglechrome} />
          <BannerTitle>Use Google Chrome for the best experience</BannerTitle>
          <BannerAction>
            <Link
              href={getGoogleChromeURLScheme()}
              rel="noopener noreferrer"
              target="_blank"
            >
              Open
            </Link>
          </BannerAction>
          <BannerClose />
        </Banner>
        <DevelopmentOnly>
          <Banner>
            <BannerIcon icon={Braces} />
            <BannerTitle>
              <code>googlechrome://</code>&nbsp; URL scheme will not work in
              development due to HTTPS.
            </BannerTitle>
            <BannerClose />
          </Banner>
        </DevelopmentOnly>
      </CustomView>
      <Map
        className="w-dvw h-svh"
        {...cameraProps}
        onCameraChanged={handleCameraChange}
        mapId={process.env.NEXT_PUBLIC_GOOGLE_MAPS_RESTAURANTS_MAP_WEB_ID}
        mapTypeId={mapTypeId}
        gestureHandling="greedy"
        disableDefaultUI
        reuseMaps
      >
        <MapControl position={ControlPosition.TOP_LEFT}>
          <div className="p-4">
            <SearchBar />
          </div>
        </MapControl>
        <MapControl position={ControlPosition.TOP_CENTER}>
          <div className="pt-4">
            <motion.div
              initial="hidden"
              animate={searchInThisAreaButtonVisible ? "visible" : "hidden"}
              variants={{
                hidden: { opacity: 0, y: -20 },
                visible: { opacity: 1, y: 0 },
              }}
              transition={{
                type: "tween",
                ease: "easeInOut",
                duration: 0.2,
              }}
              onClick={() => {
                setRenderedData(limitDataInBound(data, map?.getBounds()));
                setSearchInThisAreaButtonVisible(false);
              }}
            >
              <Button>Search in this area</Button>
            </motion.div>
          </div>
        </MapControl>
        <MapControl position={ControlPosition.RIGHT_BOTTOM}>
          <div className="p-4 flex flex-col gap-2">
            <Button variant="outline" size="icon" onClick={locateUser}>
              <Locate />
            </Button>
            <Button variant="outline" size="icon" onClick={toggleMapType}>
              <Earth />
            </Button>
          </div>
        </MapControl>
        <AdvancedMarker
          position={currentLocation}
          onMouseEnter={(e) => e.preventDefault()}
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
              "hover:shadow-blue-50",
            )}
          >
            <User size={12} color="#fff" />
          </div>
        </AdvancedMarker>
        {renderedData?.map((r, zIndex) => (
          <AdvancedMarker
            key={r.id}
            position={{ lat: r.latitude, lng: r.longitude }}
            collisionBehavior={CollisionBehavior.REQUIRED_AND_HIDES_OPTIONAL}
            zIndex={zIndex}
            onMouseEnter={(e) => e.preventDefault()}
            onMouseLeave={(e) => e.preventDefault()}
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
                    "hover:shadow-lg",
                    "hover:shadow-orange-40",
                  )}
                >
                  <Utensils size={12} color="white" />
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
                  <div className="flex gap-1">
                    <Badge>{r.cuisine}</Badge>
                  </div>
                  <div className="flex flex-col space-y-0.5">
                    <Link
                      href={r.google_maps_url}
                      target="_blank"
                      title="Open in Google Maps"
                      className="text-xs hover:underline hover:underline-offset-2 text-blue-500"
                    >
                      {r.address}
                    </Link>
                    {currentLocation && (
                      <p className="text-xs text-muted-foreground">
                        {haversineDistance(
                          currentLocation.lat,
                          currentLocation.lng,
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
      </Map>
    </>
  );
}
