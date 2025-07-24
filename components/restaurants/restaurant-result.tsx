"use client";

import { type RestaurantsData } from "@/app/api/restaurants/route";
import { InfiniteScroll } from "@/components/infinite-scroll";
import { LoadingSpinner } from "@/components/loading-spinner";
import { RestaurantResultCard } from "@/components/restaurants/restaurant-result-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { api } from "@/lib/api";
import {
  DEFAULT_DEBOUNCE_DELAY,
  DEFAULT_FETCH_LIMIT,
  DEFAULT_RESTAURANT_QUERY,
  DEFAULT_RESTAURANT_SORT_BY,
  DEFAULT_VIEW,
} from "@/lib/constants";
import { kilometersToMiles } from "@/lib/navigation";
import type { Paginated, SortOption, ViewMode } from "@/types/types";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useDebounce } from "@uidotdev/usehooks";
import {
  ChevronDownIcon,
  ChevronUpIcon,
  Grid3x3,
  List,
  Loader2,
  MapPin,
  MapPinOff,
  MessageSquareIcon,
  RouteIcon,
  Search,
  SlidersHorizontal,
  StarIcon,
  X,
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { type ReactNode, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

interface UserLocation {
  latitude: number;
  longitude: number;
}

const SORT_OPTIONS: { label: string; icon?: ReactNode; value: string }[] = [
  { label: "默认排序", value: "default" },
  {
    label: "距离最近",
    icon: (
      <>
        <RouteIcon />
        <ChevronDownIcon />
      </>
    ),
    value: "distance:asc",
  },
  {
    label: "距离最远",
    icon: (
      <>
        <RouteIcon />
        <ChevronUpIcon />
      </>
    ),
    value: "distance:desc",
  },

  {
    label: "评分最低",
    icon: (
      <>
        <StarIcon />
        <ChevronDownIcon />
      </>
    ),
    value: "rating:asc",
  },
  {
    label: "评分最高",
    icon: (
      <>
        <StarIcon />
        <ChevronUpIcon />
      </>
    ),
    value: "rating:desc",
  },

  {
    label: "评价最少",
    icon: (
      <>
        <MessageSquareIcon />
        <ChevronDownIcon />
      </>
    ),
    value: "review_count:asc",
  },
  {
    label: "评价最多",
    icon: (
      <>
        <MessageSquareIcon />
        <ChevronUpIcon />
      </>
    ),
    value: "review_count:desc",
  },
];

export const RestaurantResult = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Search and filter state
  // Replace separate searchQuery state with filters object including query
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

  // Use state for slider value to enable dragging
  const [sliderValue, setSliderValue] = useState(filters.distance);

  // Update slider value when filters change
  useEffect(() => {
    setSliderValue(filters.distance);
  }, [filters.distance]);

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [view, setView] = useState<ViewMode>(DEFAULT_VIEW);

  // Location state
  const [locationState, setLocationState] = useState<{
    userLocation: UserLocation | null;
    isLoading: boolean;
    hasRequested: boolean;
    hasError: boolean;
  }>({
    userLocation: null,
    isLoading: false,
    hasRequested: false,
    hasError: false,
  });

  // Debounce only the query property
  const debouncedQuery = useDebounce(filters.query, DEFAULT_DEBOUNCE_DELAY);
  const debouncedFilters = { ...filters, query: debouncedQuery };

  // Request user location
  const getLocation = () => {
    setLocationState((prev) => ({ ...prev, isLoading: true, hasError: false }));

    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by this browser");
      setLocationState((prev) => ({
        ...prev,
        isLoading: false,
        hasError: true,
      }));

      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocationState((prev) => ({
          ...prev,
          userLocation: {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          },
          isLoading: false,
          hasError: false,
        }));
      },
      (error) => {
        toast.error("Location error", {
          description: "Unable to retrieve your location",
        });
        setLocationState((prev) => ({
          ...prev,
          isLoading: false,
          hasError: true,
        }));
        console.error(error);
      },
      {
        enableHighAccuracy: false, // Not really needed
        timeout: 10000,
        maximumAge: 300000, // 5 minutes
      },
    );
  };

  // Request location on component mount
  useEffect(() => {
    if (!locationState.hasRequested) {
      setLocationState((prev) => ({ ...prev, hasRequested: true }));
      getLocation();
    }
  }, [locationState.hasRequested]);

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
      debouncedFilters.sortBy,
      debouncedFilters.distance,
      locationState.userLocation,
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
      if (locationState.userLocation) {
        params.append("lat", locationState.userLocation.latitude.toString());
        params.append("lng", locationState.userLocation.longitude.toString());
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

  // Get total count from first page
  const totalCount = data?.pages[0]?.count ?? 0;

  return (
    <>
      {/* Search and Filters - Becomes sticky when reaching top */}
      <div
        id="search-filters"
        className="bg-background sticky top-(--header-height) z-10 py-2 md:py-4"
      >
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
            <Input
              placeholder="搜索餐厅名称..."
              className="pl-9 text-sm"
              value={filters.query}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, query: e.target.value }))
              }
            />
          </div>

          {/* Location Button */}
          <Button
            variant="outline"
            size="icon"
            onClick={getLocation}
            disabled={locationState.isLoading}
            className="cursor-pointer disabled:cursor-not-allowed"
            title={
              locationState.hasError
                ? "Error"
                : locationState.userLocation
                  ? "Located"
                  : "Locate me"
            }
          >
            {locationState.isLoading ? (
              <Loader2 className="size-4 animate-spin" />
            ) : locationState.hasError ? (
              <MapPinOff className="size-4 text-red-600" />
            ) : (
              <MapPin
                className={`size-4 ${
                  locationState.userLocation ? "text-green-600" : ""
                }`}
              />
            )}
          </Button>

          {/* Filter */}
          <div className="flex items-center gap-2">
            <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="outline"
                  className="flex cursor-pointer items-center gap-2"
                >
                  <SlidersHorizontal className="size-4" />
                  <span className="hidden sm:inline">筛选</span>
                  <span className="text-muted-foreground">{totalCount}</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <SheetHeader>
                  <SheetTitle>筛选餐厅</SheetTitle>
                  <SheetDescription>
                    使用这些筛选条件缩小搜索范围
                  </SheetDescription>
                </SheetHeader>

                <div className="mt-6 space-y-6 px-4">
                  {/* Sort Dropdown */}
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="sort-by">排序方式</Label>
                    <Select
                      value={filters.sortBy ?? ""}
                      onValueChange={(value) => {
                        setFilters((prev) => ({
                          ...prev,
                          sortBy: value as SortOption,
                        }));
                      }}
                    >
                      <SelectTrigger id="sort-by" className="w-full">
                        <SelectValue placeholder="选择排序方式" />
                      </SelectTrigger>
                      <SelectContent>
                        {SORT_OPTIONS.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.icon}
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  {/* Distance Filter */}
                  <div className="flex flex-col gap-3">
                    <Label htmlFor="distance-slider">距离</Label>
                    <Slider
                      id="distance-slider"
                      value={[sliderValue]}
                      min={0}
                      max={100}
                      step={5}
                      onValueChange={(value) => {
                        setSliderValue(value[0]);
                      }}
                      onValueCommit={(value) => {
                        setFilters((prev) => ({
                          ...prev,
                          distance: value[0],
                        }));
                      }}
                    />
                    <div className="flex items-center gap-2">
                      <span className="text-sm">
                        {sliderValue === 0
                          ? "All"
                          : `${kilometersToMiles(sliderValue).toFixed(1)} mi`}
                      </span>
                      <span className="text-muted-foreground text-xs">
                        {sliderValue !== 0 && `${sliderValue} km`}
                      </span>
                    </div>
                  </div>
                </div>

                <SheetFooter className="mt-6 flex-row justify-between sm:space-x-0">
                  <Button
                    variant="outline"
                    onClick={() =>
                      setFilters({
                        sortBy: DEFAULT_RESTAURANT_SORT_BY,
                        distance: 0,
                        query: DEFAULT_RESTAURANT_QUERY,
                      })
                    }
                  >
                    清除
                  </Button>
                  <Button onClick={() => setIsFilterOpen(false)}>应用</Button>
                </SheetFooter>
              </SheetContent>
            </Sheet>

            <Tabs
              defaultValue={DEFAULT_VIEW}
              value={view}
              onValueChange={(value) => setView(value as ViewMode)}
              className="flex-shrink-0"
            >
              <TabsList>
                <TabsTrigger value="grid" className="cursor-pointer">
                  <Grid3x3 className="size-4" />
                  <span className="hidden sm:inline">网格</span>
                </TabsTrigger>
                <TabsTrigger value="list" className="cursor-pointer">
                  <List className="size-4" />
                  <span className="hidden sm:inline">列表</span>
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>

        {/* Active Filters */}
        {(filters.sortBy !== DEFAULT_RESTAURANT_SORT_BY ||
          filters.query ||
          filters.distance > 0) && (
          <div className="mt-4 flex flex-wrap gap-2">
            {filters.query && (
              <Badge
                variant="secondary"
                className="flex cursor-pointer items-center gap-1 select-none"
                onClick={() => setFilters((prev) => ({ ...prev, query: "" }))}
              >
                搜索:&nbsp;{filters.query}
                <X className="h-3 w-3" />
              </Badge>
            )}
            {filters.sortBy &&
              filters.sortBy !== DEFAULT_RESTAURANT_SORT_BY && (
                <Badge
                  variant="secondary"
                  className="flex cursor-pointer items-center gap-1 select-none"
                  onClick={() => {
                    setFilters((prev) => ({ ...prev, sortBy: "default" }));
                  }}
                >
                  排序:&nbsp;
                  {
                    SORT_OPTIONS.find(
                      (option) => option.value === filters.sortBy,
                    )?.label
                  }
                  <X className="h-3 w-3" />
                </Badge>
              )}
            {filters.distance > 0 && (
              <Badge
                variant="secondary"
                className="flex cursor-pointer items-center gap-1 select-none"
                onClick={() => {
                  setFilters((prev) => ({
                    ...prev,
                    distance: 0,
                  }));
                  setSliderValue(0);
                }}
              >
                距离:&nbsp;&le;&nbsp;
                {kilometersToMiles(filters.distance).toFixed(1)} mi
                <X className="h-3 w-3" />
              </Badge>
            )}
            {filters.sortBy !== DEFAULT_RESTAURANT_SORT_BY ||
            filters.query ||
            filters.distance > 0 ? (
              <Badge
                variant={"outline"}
                className="flex cursor-pointer items-center gap-1 select-none"
                onClick={() =>
                  setFilters({
                    sortBy: DEFAULT_RESTAURANT_SORT_BY,
                    distance: 0,
                    query: DEFAULT_RESTAURANT_QUERY,
                  })
                }
              >
                清除所有
              </Badge>
            ) : null}
          </div>
        )}
      </div>

      {/* Results Section */}
      {isLoading ? (
        <div className="flex items-center justify-center py-8">
          <LoadingSpinner />
        </div>
      ) : error ? (
        <div className="flex items-center justify-center py-8">
          <p className="text-destructive">加载餐厅时出错了</p>
        </div>
      ) : (
        <InfiniteScroll
          hasNextPage={hasNextPage ?? false}
          isFetchingNextPage={isFetchingNextPage}
          onLoadMore={fetchNextPage}
          endMessage={
            restaurants.length > 0 ? (
              <div className="text-sm">
                <span className="text-muted-foreground">已显示所有</span>
                &nbsp;
                <span className="font-medium">{totalCount}</span>
                &nbsp;
                <span className="text-muted-foreground">家餐厅</span>
              </div>
            ) : undefined
          }
          className="flex flex-col gap-4"
        >
          {/* Results */}
          <div
            className={
              view === "grid"
                ? "grid gap-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                : "flex flex-col gap-2"
            }
          >
            {restaurants.map((restaurant) => (
              <RestaurantResultCard
                key={restaurant.id}
                restaurant={restaurant}
                view={view}
              />
            ))}
          </div>
        </InfiniteScroll>
      )}
    </>
  );
};
