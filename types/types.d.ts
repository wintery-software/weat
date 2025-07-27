import { Enums, Tables } from "@/types/supabase";

// Extract types from Supabase generated types
export type Place = Tables<"places">;
export type Profile = Tables<"profiles">;
export type RestaurantDish = Tables<"restaurant_dishes">;
export type RestaurantSummary = Tables<"restaurant_summaries">;
export type Restaurant = Tables<"restaurants">;
export type ReviewSummary = Tables<"review_summaries">;
export type Review = Tables<"reviews">;
export type Tag = Tables<"tags">;
export type TagCluster = Tables<"tag_clusters">;
export type TaskQueue = Tables<"task_queue">;

export type RestaurantTag = Tables<"restaurant_tags">;
export type TaskStatus = Enums<"task_status">;
export type UserRole = Enums<"user_role">;

// [tag_name, mention_count]
export type TopTag = [string, number];
export type TaskQueueStatus = Record<TaskStatus, number>;

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
  query?: string | null;
}

export interface APIError {
  error: string;
}

export type SortOption = (typeof RESTAURANT_SORT_OPTIONS)[number];

export type DistanceUnit = "imperial" | "metric";
