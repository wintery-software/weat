"use client";

import { RestaurantsData } from "@/app/api/restaurants/route";
import { RestaurantCard } from "@/app/restaurants/restaurant-card";
import { LoadingSpinner } from "@/components/loading-spinner";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useInfiniteScroll } from "@/hooks/use-infinite-scroll";
import { api, DEFAULT_FETCH_LIMIT } from "@/lib/api";
import { DEFAULT_VIEW } from "@/lib/constants";
import type { Paginated, ViewMode } from "@/types/types";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Grid3x3, List } from "lucide-react";
import { useMemo, useState } from "react";

export const RestaurantResults = () => {
  const [view, setView] = useState<ViewMode>(DEFAULT_VIEW);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error,
  } = useInfiniteQuery({
    queryKey: ["restaurants", DEFAULT_FETCH_LIMIT],
    queryFn: async ({ pageParam = 1 }) => {
      const response = await api.get<Paginated<RestaurantsData[]>>(
        `/restaurants?page=${pageParam}&limit=${DEFAULT_FETCH_LIMIT}`,
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

  // Use infinite scroll hook
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-8">
        <p className="text-destructive">加载餐厅时出错了</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Top controls */}
      <div className="flex flex-col justify-between gap-2 md:flex-row md:items-center">
        <p className="text-muted-foreground text-sm">
          找到 {totalCount} 家餐厅
        </p>
        <Tabs
          defaultValue={DEFAULT_VIEW}
          value={view}
          onValueChange={(value) => setView(value as ViewMode)}
        >
          <TabsList>
            <TabsTrigger value="grid" className="cursor-pointer">
              <Grid3x3 className="mr-1 size-4" />
              网格
            </TabsTrigger>
            <TabsTrigger value="list" className="cursor-pointer">
              <List className="mr-1 size-4" />
              列表
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Results */}
      <div
        className={
          view === "grid"
            ? "grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
            : "space-y-4"
        }
      >
        {restaurants.map((restaurant) => (
          <RestaurantCard
            key={restaurant.id}
            restaurant={restaurant}
            view={view}
          />
        ))}
      </div>

      {/* Loading indicator and infinite scroll trigger */}
      {hasNextPage && (
        <div ref={loadingRef} className="flex items-center justify-center py-8">
          {isFetchingNextPage ? (
            <LoadingSpinner />
          ) : (
            <div className="text-muted-foreground text-sm">
              滚动到底部加载更多
            </div>
          )}
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
  );
};
