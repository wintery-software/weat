"use client";

import SearchResult from "./sidebar/search-result";
import { PlaceMarker } from "@/components/map/markers/place-marker";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInput,
  SidebarMenuBadge,
  SidebarSeparator,
  useSidebar,
} from "@/components/ui/sidebar";
import { backendAPI, frontendAPI } from "@/lib/api";
import { LOCAL_STORAGE_MAP_MAP_TYPE_ID } from "@/lib/constants";
import { getCurrentPosition, getGeolocationPermissionStatus, metersToLatLngDegrees } from "@/lib/maps";
import { cn } from "@/lib/utils";
import { API } from "@/types/api";
import { useQuery } from "@tanstack/react-query";
import { useDebounce } from "@uidotdev/usehooks";
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

// Delay (ms) before fetching places after bounds/query change
const DEBOUNCE_DELAY = 500;

const listPlaces = async ({ bounds }: { bounds?: google.maps.LatLngBounds }) => {
  if (!bounds) {
    return null;
  }

  const { lat: south, lng: west } = bounds.getSouthWest().toJSON();
  const { lat: north, lng: east } = bounds.getNorthEast().toJSON();

  const response = await frontendAPI.get<API.Paginated<API.Place>>(`/places`, {
    params: { bounds: `${west},${south},${east},${north}`, page_size: 9999 },
  });

  return response.data;
};

const searchPlaces = async ({ q }: { q?: string }) => {
  if (!q) {
    return null;
  }

  const response = await backendAPI.get<API.Paginated<API.Place>>(`/places/search`, {
    params: { q, page_size: 9999 },
  });

  return response.data;
};

export default function Page() {
  const map = useMap();
  map?.setOptions({
    draggableCursor: "default",
  });

  const { toggleSidebar } = useSidebar();

  const [location, setLocation] = useState<google.maps.LatLng>();

  const [bounds, setBounds] = useState<google.maps.LatLngBounds>();

  const [places, setPlaces] = useState<API.Place[]>();
  const [query, setQuery] = useState("");
  // Wait for user to stop typing before searching
  const debouncedQuery = useDebounce(query, DEBOUNCE_DELAY);

  const placesQuery = useQuery({
    queryKey: ["places"],
    queryFn: async () => {
      const result = await listPlaces({ bounds });
      return result?.items;
    },
    enabled: false,
  });
  const searchQuery = useQuery({
    queryKey: ["places", "search", debouncedQuery],
    queryFn: () => searchPlaces({ q: debouncedQuery }),
    enabled: !!debouncedQuery,
  });

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

  const handleSelectedChange = (item: API.Place) => {
    if (!map) {
      return;
    }

    zoomAndPanTo(item.location.latitude, item.location.longitude, DEFAULT_CAMERA_PROPS.defaultZoom);

    // Listen for the 'idle' event once after the animation starts
    google.maps.event.addListenerOnce(map, "idle", () => {
      setTimeout(() => {
        // Re-fetch data once the map is idle (animation finished)
        placesQuery.refetch().then((res) => {
          setPlaces(res.data);
        });
      }, 100);
    });
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
    <div className="flex h-dvh w-full overflow-hidden">
      <Sidebar>
        <SidebarHeader />
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupContent className="relative">
              <Label htmlFor="search" className="sr-only">
                Search
              </Label>
              <SidebarInput
                type="text"
                id="search"
                placeholder="Search places..."
                tabIndex={-1}
                className="pl-8"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                }}
              />
              <LucideSearch className="pointer-events-none absolute left-2 top-1/2 size-4 -translate-y-1/2 select-none opacity-50" />
              {searchQuery.isLoading && (
                <LucideLoader2 className="pointer-events-none absolute right-2 top-1/4 size-4 animate-spin select-none opacity-50" />
              )}
            </SidebarGroupContent>
          </SidebarGroup>
          <SidebarSeparator />
          <SidebarGroup>
            <SidebarGroupLabel>Filter</SidebarGroupLabel>
            <SidebarGroupContent></SidebarGroupContent>
          </SidebarGroup>
          <SidebarSeparator />
          <SidebarGroup>
            <SidebarGroupLabel>Results</SidebarGroupLabel>
            <SidebarGroupAction title="Total results" asChild>
              <SidebarMenuBadge>{searchQuery.data?.items.length}</SidebarMenuBadge>
            </SidebarGroupAction>
            <SidebarGroupContent>
              <SearchResult items={searchQuery.data?.items} onSelectedChange={handleSelectedChange} />
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter />
      </Sidebar>
      <main className="flex-1">
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
            <div className="p-4">
              <Button size={"icon"} variant={"outline"} onClick={toggleSidebar}>
                <LucideSearch />
              </Button>
            </div>
          </MapControl>
          <MapControl position={ControlPosition.TOP_CENTER}>
            <div className="p-4">
              <Button
                onClick={() => {
                  if (bounds) {
                    placesQuery.refetch().then((res) => {
                      setPlaces(res.data);
                    });
                  }
                }}
              >
                Search This Area
              </Button>
            </div>
          </MapControl>
          <MapControl position={ControlPosition.RIGHT_BOTTOM}>
            <div className="p-4">
              <div className="flex flex-col items-end gap-2">
                <Button variant="outline" size="icon" disabled={isLocateButtonDisabled} onClick={locateUser}>
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
          {places?.map((p) => <PlaceMarker key={p.id} place={p} />)}
        </GoogleMap>
      </main>
    </div>
  );
}
