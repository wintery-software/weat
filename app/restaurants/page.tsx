"use client";

import { type RestaurantsData } from "@/app/api/restaurants/route";
import { SuspenseWrapper } from "@/components/layouts/suspense-wrapper";
import { RestaurantsFilters } from "@/components/restaurants/restaurants-filters";
import { RestaurantsResult } from "@/components/restaurants/restaurants-result";
import { api } from "@/lib/api";
import {
  DEFAULT_DEBOUNCE_DELAY,
  DEFAULT_FETCH_LIMIT,
  DEFAULT_RESTAURANT_QUERY,
  DEFAULT_RESTAURANT_SORT_BY,
  DEFAULT_VIEW,
} from "@/lib/constants";
import type { Paginated, SortOption, ViewMode } from "@/types/types";
import { useSuspenseInfiniteQuery } from "@tanstack/react-query";
import { useDebounce } from "@uidotdev/usehooks";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

const title = "发现餐厅";
const description = "发现你附近的餐厅，并查看它们的评价和评分。";

// Component that only handles data fetching and results rendering
const RestaurantsResults = ({
  debouncedFilters,
  userLocation,
  view,
}: {
  debouncedFilters: {
    sortBy: SortOption;
    distance: number;
    query: string;
  };
  userLocation: GeolocationCoordinates | null;
  view: ViewMode;
}) => {
  // Data fetching
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useSuspenseInfiniteQuery({
      queryKey: [
        "restaurants",
        debouncedFilters.query.trim(),
        debouncedFilters.sortBy,
        debouncedFilters.distance,
        userLocation,
      ],
      queryFn: async ({ pageParam = 1 }) => {
        const params = new URLSearchParams({
          page: pageParam.toString(),
          limit: DEFAULT_FETCH_LIMIT.toString(),
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

        return response.data;
      },
      getNextPageParam: (lastPage) => {
        if (lastPage.page >= lastPage.totalPages) {
          return undefined;
        }

        return lastPage.page + 1;
      },
      initialPageParam: 1,
    });

  // Flatten all pages into a single array
  const restaurants = useMemo(() => {
    return data?.pages.flatMap((page) => page.data) ?? [];
  }, [data]);

  return (
    <RestaurantsResult
      restaurants={restaurants}
      view={view}
      hasNextPage={hasNextPage ?? false}
      isFetchingNextPage={isFetchingNextPage}
      onLoadMore={fetchNextPage}
    />
  );
};

const Page = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Shared state between filters and result
  const [filters, setFilters] = useState<{
    sortBy: SortOption;
    distance: number;
    query: string;
  }>({
    sortBy:
      (searchParams.get("sort") as SortOption) || DEFAULT_RESTAURANT_SORT_BY,
    distance: 0,
    query: searchParams.get("q") || DEFAULT_RESTAURANT_QUERY,
  });

  const [sliderValue, setSliderValue] = useState(filters.distance);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [view, setView] = useState<ViewMode>(DEFAULT_VIEW);
  const [userLocation, setUserLocation] =
    useState<GeolocationCoordinates | null>(null);
  const [geoPermission, setGeoPermission] = useState<PermissionState | null>(
    null,
  );

  // Check geolocation permission on mount
  useEffect(() => {
    if (typeof window !== "undefined" && navigator.permissions) {
      navigator.permissions.query({ name: "geolocation" }).then((result) => {
        setGeoPermission(result.state);
        result.addEventListener("change", () => {
          setGeoPermission(result.state);
        });
      });
    }
  }, []);

  // Update slider value when filters change
  useEffect(() => {
    setSliderValue(filters.distance);
  }, [filters.distance]);

  // Debounce only the query property
  const debouncedQuery = useDebounce(filters.query, DEFAULT_DEBOUNCE_DELAY);
  const debouncedFilters = { ...filters, query: debouncedQuery };

  // Request user location
  const getLocation = useCallback(() => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by this browser");

      return;
    }

    if (geoPermission === "denied") {
      toast.error("Location permission denied", {
        description: "Please enable location access in your browser settings.",
      });

      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation(position.coords);
      },
      (error) => {
        toast.error("Location error", {
          description: "Unable to retrieve your location",
        });
        console.error(error);
      },
      {
        enableHighAccuracy: false,
        timeout: 10000,
        maximumAge: 300000, // 5 minutes
      },
    );
  }, [geoPermission]);

  // Manual relocation trigger
  const handleRequestLocation = useCallback(() => {
    getLocation();
  }, [getLocation]);

  // Request location on component mount
  useEffect(() => {
    if (!userLocation) {
      getLocation();
    }
  }, [userLocation, getLocation]);

  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams(searchParams);

    // Update query parameter
    if (debouncedQuery && debouncedQuery.trim()) {
      params.set("q", debouncedQuery.trim());
    } else {
      params.delete("q");
    }

    // Update sort parameter
    if (
      debouncedFilters.sortBy &&
      debouncedFilters.sortBy !== DEFAULT_RESTAURANT_SORT_BY
    ) {
      params.set("sort", debouncedFilters.sortBy);
    } else {
      params.delete("sort");
    }

    const url = new URL(window.location.href);
    url.search = params.toString();
    router.replace(url.pathname + url.search, { scroll: false });
  }, [debouncedQuery, debouncedFilters.sortBy, router, searchParams]);

  return (
    <div className="container flex flex-col py-2 md:py-4">
      <div>
        <h1>{title}</h1>
        <p className="text-muted-foreground mt-1 text-sm md:text-base">
          {description}
        </p>
      </div>

      <RestaurantsFilters
        filters={filters}
        setFilters={setFilters}
        sliderValue={sliderValue}
        setSliderValue={setSliderValue}
        isFilterOpen={isFilterOpen}
        setIsFilterOpen={setIsFilterOpen}
        view={view}
        setView={setView}
        userLocation={userLocation}
        geoPermission={geoPermission}
        onRequestLocation={handleRequestLocation}
      />

      <SuspenseWrapper>
        <RestaurantsResults
          debouncedFilters={debouncedFilters}
          userLocation={userLocation}
          view={view}
        />
      </SuspenseWrapper>
    </div>
  );
};

export default Page;
