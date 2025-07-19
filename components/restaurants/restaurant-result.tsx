"use client";

import { type RestaurantsData } from "@/app/api/restaurants/route";
import { LoadingSpinner } from "@/components/loading-spinner";
import { RestaurantResultCard } from "@/components/restaurants/restaurant-result-card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { useInfiniteScroll } from "@/hooks/use-infinite-scroll";
import { api, DEFAULT_FETCH_LIMIT } from "@/lib/api";
import { DEFAULT_DEBOUNCE_DELAY, DEFAULT_VIEW } from "@/lib/constants";
import type { Paginated, ViewMode } from "@/types/types";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useDebounce } from "@uidotdev/usehooks";
import { Grid3x3, List, Search, SlidersHorizontal, X } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

export const RestaurantResult = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Search and filter state
  const [searchQuery, setSearchQuery] = useState<string>(
    searchParams.get("q") || "",
  );
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [distance, setDistance] = useState([5]);
  const [view, setView] = useState<ViewMode>(DEFAULT_VIEW);

  // Debounce search query to prevent excessive API calls
  const debouncedSearchQuery = useDebounce(searchQuery, DEFAULT_DEBOUNCE_DELAY);

  // Update URL when search query changes
  useEffect(() => {
    const params = new URLSearchParams(searchParams);

    if (debouncedSearchQuery.trim()) {
      params.set("q", debouncedSearchQuery.trim());
    } else {
      // eslint-disable-next-line drizzle/enforce-delete-with-where
      params.delete("q");
    }

    const newUrl = params.toString() ? `?${params.toString()}` : "";
    router.replace(newUrl, { scroll: false });
  }, [debouncedSearchQuery, router, searchParams]);

  // Data fetching
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error,
  } = useInfiniteQuery({
    queryKey: ["restaurants", debouncedSearchQuery.trim()],
    queryFn: async ({ pageParam = 1 }) => {
      const params = new URLSearchParams({
        page: pageParam.toString(),
        limit: DEFAULT_FETCH_LIMIT.toString(),
      });

      if (debouncedSearchQuery) {
        params.append("q", debouncedSearchQuery);
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

  // Infinite scroll hook
  const { loadingRef } = useInfiniteScroll(
    () => fetchNextPage(),
    hasNextPage ?? false,
    isFetchingNextPage,
  );

  // Flatten all pages into a single array
  const restaurants = useMemo(() => {
    return data?.pages.flatMap((page) => page.data) ?? [];
  }, [data]);

  // Get total count from first page
  const totalCount = data?.pages[0]?.count ?? 0;

  // Filter handlers
  const handleAddFilter = (filter: string) => {
    if (!activeFilters.includes(filter)) {
      setActiveFilters([...activeFilters, filter]);
    }
  };

  const handleRemoveFilter = (filter: string) => {
    setActiveFilters(activeFilters.filter((f) => f !== filter));
  };

  const handleClearFilters = () => {
    setActiveFilters([]);
    setDistance([5]);
    setSearchQuery("");
  };

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
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Filter */}
          <div className="flex items-center gap-2">
            <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2">
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
                  <div className="space-y-2">
                    <Label>距离</Label>
                    <div className="flex items-center gap-4">
                      <Slider
                        value={distance}
                        min={1}
                        max={20}
                        step={1}
                        onValueChange={setDistance}
                      />
                      <span className="w-16 text-center text-sm font-medium">
                        {distance[0]} mi
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Price Range</Label>
                    <div className="flex gap-2">
                      {["$", "$$", "$$$", "$$$$"].map((price) => (
                        <Button
                          key={price}
                          variant={
                            activeFilters.includes(price)
                              ? "default"
                              : "outline"
                          }
                          size="sm"
                          onClick={() =>
                            activeFilters.includes(price)
                              ? handleRemoveFilter(price)
                              : handleAddFilter(price)
                          }
                        >
                          {price}
                        </Button>
                      ))}
                    </div>
                  </div>

                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="cuisine">
                      <AccordionTrigger>菜系</AccordionTrigger>
                      <AccordionContent>
                        <div className="grid grid-cols-2 gap-2">
                          {[
                            "Sichuan",
                            "Cantonese",
                            "Taiwanese",
                            "Shanghainese",
                            "Hunan",
                            "Dim Sum",
                          ].map((cuisine) => (
                            <Button
                              key={cuisine}
                              variant={
                                activeFilters.includes(cuisine)
                                  ? "default"
                                  : "outline"
                              }
                              size="sm"
                              onClick={() =>
                                activeFilters.includes(cuisine)
                                  ? handleRemoveFilter(cuisine)
                                  : handleAddFilter(cuisine)
                              }
                            >
                              {cuisine}
                            </Button>
                          ))}
                        </div>
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="features">
                      <AccordionTrigger>特色</AccordionTrigger>
                      <AccordionContent>
                        <div className="grid grid-cols-2 gap-2">
                          {[
                            "Spicy",
                            "Vegetarian Options",
                            "Authentic",
                            "Family Style",
                            "Hotpot",
                          ].map((feature) => (
                            <Button
                              key={feature}
                              variant={
                                activeFilters.includes(feature)
                                  ? "default"
                                  : "outline"
                              }
                              size="sm"
                              onClick={() =>
                                activeFilters.includes(feature)
                                  ? handleRemoveFilter(feature)
                                  : handleAddFilter(feature)
                              }
                            >
                              {feature}
                            </Button>
                          ))}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </div>

                <SheetFooter className="mt-6 flex-row justify-between sm:space-x-0">
                  <Button variant="outline" onClick={handleClearFilters}>
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
        {(activeFilters.length > 0 || debouncedSearchQuery) && (
          <div className="mt-4 flex flex-wrap gap-2">
            {debouncedSearchQuery && (
              <Badge variant="secondary" className="flex items-center gap-1">
                搜索: {debouncedSearchQuery}
                <X
                  className="h-3 w-3 cursor-pointer"
                  onClick={() => setSearchQuery("")}
                />
              </Badge>
            )}
            {activeFilters.map((filter) => (
              <Badge
                key={filter}
                variant="secondary"
                className="flex items-center gap-1"
              >
                {filter}
                <X
                  className="h-3 w-3 cursor-pointer"
                  onClick={() => handleRemoveFilter(filter)}
                />
              </Badge>
            ))}
            <Button
              variant="ghost"
              size="sm"
              className="h-6 px-2 text-xs"
              onClick={handleClearFilters}
            >
              清除所有
            </Button>
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
        <div className="flex flex-col gap-4">
          {/* Results */}
          <div
            className={
              view === "grid"
                ? "grid gap-2 sm:grid-cols-2 lg:grid-cols-3"
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

          {/* Loading indicator and infinite scroll trigger */}
          {hasNextPage && (
            <div
              ref={loadingRef}
              className="flex items-center justify-center py-8"
            >
              {isFetchingNextPage && <LoadingSpinner />}
            </div>
          )}

          {/* End of results indicator */}
          {!hasNextPage && restaurants.length > 0 && (
            <div className="flex items-center justify-center py-8">
              <div className="text-sm">
                <span className="text-muted-foreground">已显示所有</span>
                &nbsp;
                <span className="font-medium">{totalCount}</span>
                &nbsp;
                <span className="text-muted-foreground">家餐厅</span>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
};
