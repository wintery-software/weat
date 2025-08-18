import type { PathsRestaurantsGetParametersQuerySort_order } from "@/types/openapi";

export type RestaurantResultsViewMode = "grid" | "list" | "map";

export type RestaurantResultsSortBy = "distance" | "rating" | "review";

export type RestaurantResultsSortOption =
  `${RestaurantResultsSortBy}:${RestaurantResultsSortOrder}`;

export type RestaurantResultsSortOrder =
  keyof typeof PathsRestaurantsGetParametersQuerySort_order;
