import { fetchRestaurant, fetchRestaurants } from "@/lib/api/restaurant";
import { useSuspenseQuery } from "@tanstack/react-query";

/**
 * The time in milliseconds after data is considered stale. Default is 5 minutes.
 */
export const DEFAULT_STALE_TIME = 5 * 60 * 1000;

export const useSuspenseRestaurants = () => {
  return useSuspenseQuery({
    queryKey: ["restaurants"],
    queryFn: fetchRestaurants,
    staleTime: DEFAULT_STALE_TIME,
  });
};

export const useSuspenseRestaurant = (id: string) => {
  return useSuspenseQuery({
    queryKey: ["restaurants", id],
    queryFn: () => fetchRestaurant(id),
    staleTime: DEFAULT_STALE_TIME,
  });
};
