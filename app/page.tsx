"use client";

import { SearchBar } from "@/app/_search_bar";
import DevelopmentBanner from "@/components/dev/development_banner";
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
import { getCurrentPosition } from "@/lib/maps";
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
  MapProps,
  useMap,
} from "@vis.gl/react-google-maps";
import { Earth, Locate, User, Utensils } from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { CustomView, isIOS, isSafari } from "react-device-detect";
import { toast } from "sonner";
import useSWRImmutable from "swr/immutable";

// Apple Park :)
const DEFAULT_CAMERA_PROPS: Required<
  Pick<MapProps, "defaultCenter" | "defaultZoom">
> = {
  defaultCenter: { lat: 37.3346, lng: -122.009 },
  defaultZoom: 14,
};

export default function Page() {
  const showIOSSafariBanner = useRef(false);

  useEffect(() => {
    if (isIOS && isSafari) {
      showIOSSafariBanner.current = true;
    }
  }, []);

  const map = useMap();
  // Required to use AdvancedMarker
  const [mapTypeId, setMapTypeId] = useState<google.maps.MapTypeId>();
  const [cameraProps, setCameraProps] = useState<MapCameraProps>();

  const [location, setLocation] = useState<google.maps.LatLng>();
  // Use useSWRImmutable to disable revalidation
  const { data } = useSWRImmutable<Restaurant[]>("/api/restaurants", fetcher);
  // Data to be rendered on the viewport
  const [renderedData, setRenderedData] = useState<Restaurant[]>();
  // Set once, no need to re-render
  const isCameraFirstCenteredToLocation = useRef(false);

  // Limit rendered data based on the viewport to improve performance
  const limitDataInBound = useCallback(
    (
      data: Restaurant[] | undefined,
      bounds: google.maps.LatLngBounds | undefined,
    ) => {
      if (!data || !bounds) {
        return null;
      }

      return data.filter(
        (r) =>
          r.latitude >= bounds.getSouthWest().lat() &&
          r.latitude <= bounds.getNorthEast().lat() &&
          r.longitude >= bounds.getSouthWest().lng() &&
          r.longitude <= bounds.getNorthEast().lng(),
      );
    },
    [],
  );

  const searchThisArea = useCallback(() => {
    const limitedData = limitDataInBound(data, map?.getBounds());

    if (limitedData !== null) {
      setRenderedData(limitedData);
      toast(
        `Showing ${limitedData.length} place${limitedData.length !== 1 ? "s" : ""}.`,
        {
          duration: 2000,
        },
      );
    }

    setSearchThisAreaButtonVisible(false);
  }, [data, limitDataInBound, map]);

  const locateUser = useCallback(() => {
    getCurrentPosition({ enableHighAccuracy: false })
      .then((pos) => {
        setLocation(new google.maps.LatLng(pos));
        setCameraProps({
          center: pos,
          zoom: DEFAULT_CAMERA_PROPS.defaultZoom,
        });
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
  }, []);

  // 1. On first render - locate user
  useEffect(() => {
    if (!map) {
      return;
    }

    locateUser();
  }, [locateUser, map]);

  // 2. On first user location change - center the map on user location
  useEffect(() => {
    if (!map || !location) {
      return;
    }

    setCameraProps({
      center: location.toJSON(),
      zoom: DEFAULT_CAMERA_PROPS.defaultZoom,
    });

    isCameraFirstCenteredToLocation.current = true;
  }, [location, map]);

  // 3. On first camera change to user location - search this area
  useEffect(() => {
    if (isCameraFirstCenteredToLocation.current) {
      searchThisArea();
    }
  }, [searchThisArea]);

  // Show button the top when the user zooms or STOPS dragging the map
  // DO NOT show it while map is still moving
  const [searchThisAreaButtonVisible, setSearchThisAreaButtonVisible] =
    useState(false);

  const handleCameraChange = useCallback((e: MapCameraChangedEvent) => {
    setCameraProps(e.detail);
  }, []);

  const toggleMapType = () => {
    setMapTypeId(
      mapTypeId === google.maps.MapTypeId.ROADMAP
        ? google.maps.MapTypeId.SATELLITE
        : google.maps.MapTypeId.ROADMAP,
    );
  };

  return (
    <>
      <CustomView condition={showIOSSafariBanner.current}>
        <Banner>
          <BannerIcon icon={SiGooglechrome} />
          <BannerTitle>Use Google Chrome for the best experience.</BannerTitle>
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
        <DevelopmentBanner>
          <code>googlechrome://</code>&nbsp; URL scheme will not work in
          development due to HTTPS.
        </DevelopmentBanner>
      </CustomView>
      <Map
        className="w-dvw h-svh"
        {...DEFAULT_CAMERA_PROPS}
        {...cameraProps}
        onCameraChanged={handleCameraChange}
        onZoomChanged={() => setSearchThisAreaButtonVisible(true)}
        onDrag={() => setSearchThisAreaButtonVisible(true)}
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
              animate={searchThisAreaButtonVisible ? "visible" : "hidden"}
              variants={{
                hidden: { opacity: 0, y: -20 },
                visible: { opacity: 1, y: 0 },
              }}
              transition={{
                type: "tween",
                ease: "easeInOut",
                duration: 0.2,
              }}
              onClick={searchThisArea}
            >
              <Button>Search this area</Button>
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
                    "hover:shadow-md",
                    "hover:shadow-orange-400",
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
                      className="text-xs hover:underline hover:underline-offset-2 text-blue-500"
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
      </Map>
    </>
  );
}
