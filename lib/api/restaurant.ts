import { api } from "@/lib/api";
import { getTableCount } from "@/lib/supabase";
import { createSSRClient } from "@/lib/supabase/clients/ssr";

export const getRestaurant = async (id: string) => {
  const response = await api.get(`/restaurants/${id}`);

  return response.data;
};

export const getRestaurantsCount = async () => getTableCount("restaurants");

/**
 * Get the count of restaurant summaries.
 * Each restaurant can have only one summary, so no RPC function is needed.
 * @returns The count of restaurant summaries
 */
export const getRestaurantSummariesCount = async () =>
  getTableCount("restaurant_summaries");

/**
 * Get the count of tagged restaurants.
 * @returns The count of tagged restaurants
 */
export const getUniqueTaggedRestaurantsCount = async () => {
  const supabase = await createSSRClient();

  const { data, error } = await supabase.rpc(
    "get_unique_tagged_restaurants_count",
  );

  if (error) {
    throw error;
  }

  return data as number;
};

export const getRestaurantsByTag = async (tagId: string) => {
  const supabase = await createSSRClient();

  const { data, error } = await supabase
    .from("restaurants")
    .select(
      `
      id,
      name_en,
      name_zh,
      tags:restaurant_tags!inner(
        mention_count,
        tag:tags(id, name)
      )
    `,
    )
    .eq("restaurant_tags.tag_id", tagId);

  if (error) {
    throw error;
  }

  return data;
};
