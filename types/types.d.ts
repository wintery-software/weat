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

export type DistanceUnit = "imperial" | "metric";

export type Profile = Tables<"profiles">;
