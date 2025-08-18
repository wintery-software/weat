import {
  type RestaurantResultsSortBy,
  type RestaurantResultsSortOption,
  type RestaurantResultsSortOrder,
  type RestaurantResultsViewMode,
} from "@/types/restaurants";

export const RESTAURANT_SORT_OPTIONS: RestaurantResultsSortOption[] = [
  "distance:asc",
  "distance:desc",
  "rating:asc",
  "rating:desc",
  "review:asc",
  "review:desc",
] as const;

export const DEFAULT_RESTAURANT_SORT_BY: RestaurantResultsSortBy = "distance";

export const DEFAULT_RESTAURANT_SORT_ORDER: RestaurantResultsSortOrder = "asc";

/**
 * Used for select dropdown.
 */
export const DEFAULT_RESTAURANT_SORT_OPTION: RestaurantResultsSortOption = `${DEFAULT_RESTAURANT_SORT_BY}:${DEFAULT_RESTAURANT_SORT_ORDER}`;

export const DEFAULT_RESTAURANT_RESULT_VIEW: RestaurantResultsViewMode = "grid";
