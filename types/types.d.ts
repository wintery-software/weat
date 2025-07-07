import { Tables } from "./db";

export interface Paginated<T> {
  success: boolean;
  data: T;
  count?: number;
  page?: number;
  limit?: number;
  totalPages?: number;
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

// [tag_name, mention_count]
export type TopTag = [string, number];
