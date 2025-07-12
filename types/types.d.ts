import { Enums, Tables } from "./db";

export type SearchParams = Promise<{
  [key: string]: string | string[] | undefined;
}>;

export type ViewMode = (typeof VIEW_MODES)[number];

export interface PaginatedParams {
  page?: number;
  pageSize?: number;
}
export interface Paginated<T> {
  data: T;
  count: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface APIError {
  error: string;
}

// Extract types from Supabase generated types (types/db.d.ts)
export type Restaurant = Tables<"restaurants">;

export type Address = Tables<"addresses">;

export type RestaurantSummary = Tables<"restaurant_summaries">;

export type RestaurantTag = Tables<"restaurant_tags">;

export type Tag = Tables<"tags">;

export type RestaurantDish = Tables<"restaurant_dishes">;

export type Review = Tables<"reviews">;

export type TaskStatus = Enums<"task_status">;

// [tag_name, mention_count]
export type TopTag = [string, number];

export type TaskQueueStatus = Record<TaskStatus, number>;
