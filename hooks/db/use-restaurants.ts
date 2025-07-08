import { fetchRestaurant, fetchRestaurants } from "@/lib/api/restaurant";
import { useSuspenseQuery } from "@tanstack/react-query";

// Query keys for React Query
export const restaurantKeys = {
  all: ["restaurants"] as const,
  lists: () => [...restaurantKeys.all, "list"] as const,
  list: (filters: string) => [...restaurantKeys.lists(), { filters }] as const,
  details: () => [...restaurantKeys.all, "detail"] as const,
  detail: (id: string) => [...restaurantKeys.details(), id] as const,
};

/**
 * The time in milliseconds after data is considered stale. Default is 5 minutes.
 */
export const DEFAULT_STALE_TIME = 5 * 60 * 1000;

/**
 * The time in milliseconds that unused/inactive cache data remains in memory. Default is 10 minutes.
 */
export const DEFAULT_GC_TIME = 10 * 60 * 1000;

export const useSuspenseRestaurants = () => {
  return useSuspenseQuery({
    queryKey: restaurantKeys.lists(),
    queryFn: fetchRestaurants,
    staleTime: DEFAULT_STALE_TIME,
    gcTime: DEFAULT_GC_TIME,
  });
};

export const useSuspenseRestaurant = (id: string) => {
  return useSuspenseQuery({
    queryKey: restaurantKeys.detail(id),
    queryFn: () => fetchRestaurant(id),
    staleTime: DEFAULT_STALE_TIME,
    gcTime: DEFAULT_GC_TIME,
  });
};
