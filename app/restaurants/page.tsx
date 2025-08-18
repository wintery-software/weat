"use client";

import { ListRestaurantsFilters } from "@/components/restaurants/list-restaurants-filters";
import { ListRestaurantsMap } from "@/components/restaurants/list-restaurants-map";
import { ListRestaurantsResult } from "@/components/restaurants/list-restaurants-result";
import { DEFAULT_DEBOUNCE_DELAY } from "@/lib/constants";
import {
  DEFAULT_RESTAURANT_RESULT_VIEW,
  DEFAULT_RESTAURANT_SORT_OPTION,
} from "@/lib/constants/restaurants";
import {
  type RestaurantResultsSortOption,
  type RestaurantResultsViewMode,
} from "@/types/restaurants";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useDebounce } from "@uidotdev/usehooks";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { listRestaurants } from "./actions";

const Page = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  // State
  const [view, setView] = useState<RestaurantResultsViewMode>(
    DEFAULT_RESTAURANT_RESULT_VIEW,
  );
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [userLocation, setUserLocation] =
    useState<GeolocationCoordinates | null>(null);
  const [geoPermission, setGeoPermission] = useState<PermissionState | null>(
    null,
  );

  const [filters, setFilters] = useState({
    sortOption:
      (searchParams.get("sort") as RestaurantResultsSortOption) ||
      DEFAULT_RESTAURANT_SORT_OPTION,
    distance: 0,
    query: searchParams.get("q") || "",
  });

  const [sliderValue, setSliderValue] = useState(filters.distance);
  const debouncedQuery = useDebounce(filters.query, DEFAULT_DEBOUNCE_DELAY);

  const debouncedFilters = {
    ...filters,
    query: debouncedQuery,
  };

  // Geolocation
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

  const requestLocation = useCallback(() => {
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
        maximumAge: 300000,
      },
    );
  }, [geoPermission]);

  useEffect(() => {
    if (!userLocation) {
      requestLocation();
    }
  }, [userLocation, requestLocation]);

  // URL sync
  useEffect(() => {
    const params = new URLSearchParams(searchParams);

    if (debouncedQuery?.trim()) {
      params.set("q", debouncedQuery.trim());
    } else {
      params.delete("q");
    }

    if (filters.sortOption !== DEFAULT_RESTAURANT_SORT_OPTION) {
      params.set("sort", filters.sortOption);
    } else {
      params.delete("sort");
    }

    const url = new URL(window.location.href);
    url.search = params.toString();
    router.replace(url.pathname + url.search, { scroll: false });
  }, [debouncedQuery, filters.sortOption, router, searchParams]);

  useEffect(() => {
    setSliderValue(filters.distance);
  }, [filters.distance]);

  const resetFilters = useCallback(() => {
    setFilters({
      sortOption: DEFAULT_RESTAURANT_SORT_OPTION,
      distance: 0,
      query: "",
    });
    setSliderValue(0);
  }, []);

  // Data fetching
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error,
  } = useInfiniteQuery({
    queryKey: [
      "restaurants",
      debouncedFilters.query.trim(),
      debouncedFilters.sortOption,
      debouncedFilters.distance,
      userLocation,
    ],
    queryFn: async ({ pageParam = 1 }) => {
      return listRestaurants({
        page: pageParam,
        query: debouncedFilters.query,
        sortOption: debouncedFilters.sortOption,
        distance: debouncedFilters.distance,
        lat: userLocation?.latitude,
        lng: userLocation?.longitude,
      });
    },
    getNextPageParam: (lastPage) => {
      if (lastPage.page >= lastPage.total_pages) {
        return undefined;
      }

      return lastPage.page + 1;
    },
    initialPageParam: 1,
  });

  const restaurants = useMemo(() => {
    return data?.pages.flatMap((page) => page.data) ?? [];
  }, [data]);

  return (
    <div className="container flex flex-col py-2 md:py-4">
      <div>
        <h1>发现餐厅</h1>
        <p className="text-muted-foreground mt-1 text-sm md:text-base">
          发现你附近的餐厅，并查看它们的评价和评分。
        </p>
      </div>

      <ListRestaurantsFilters
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
        onRequestLocation={requestLocation}
        onResetFilters={resetFilters}
      />

      {view === "map" ? (
        <ListRestaurantsMap
          debouncedFilters={debouncedFilters}
          userLocation={userLocation}
        />
      ) : isLoading ? (
        <div className="flex min-h-full items-center justify-center">
          <div>Loading restaurants...</div>
        </div>
      ) : error ? (
        <div className="flex min-h-full items-center justify-center">
          <div>Error loading restaurants</div>
        </div>
      ) : (
        <ListRestaurantsResult
          restaurants={restaurants}
          view={view}
          hasNextPage={hasNextPage ?? false}
          isFetchingNextPage={isFetchingNextPage}
          onLoadMore={fetchNextPage}
        />
      )}
    </div>
  );
};

export default Page;
