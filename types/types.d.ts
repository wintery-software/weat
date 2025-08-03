import { type SORT_BY } from "@/lib/constants";
import { type PathsRestaurantsGetParametersQuerySort_order } from "@/types/openapi";
import type { Tables } from "@/types/supabase";

export type SearchParams = Promise<{
  [key: string]: string | string[] | undefined;
}>;

export interface Paginated<T> {
  readonly count: number;
  readonly data: T;
  readonly page: number;
  readonly page_size: number;
  readonly total_pages: number;
}

export interface APIError {
  error: string | null;
}

export type RestaurantsViewMode = "grid" | "list";

export type DistanceUnit = "imperial" | "metric";

export type SortBy = typeof SORT_BY;

export type SortOrder =
  keyof typeof PathsRestaurantsGetParametersQuerySort_order;

export type Profile = Tables<"profiles">;
