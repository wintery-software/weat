import { RestaurantGETResponse } from "@/app/api/restaurants/[id]/route";
import { RestaurantsGETResponse } from "@/app/api/restaurants/route";
import { api } from "@/lib/api";
import { cache } from "react";

export const fetchRestaurant = cache(async (id: string) => {
  const response = await api.get<RestaurantGETResponse>(`/restaurants/${id}`);

  return response.data;
});

export const fetchRestaurants = cache(async () => {
  const response = await api.get<RestaurantsGETResponse>("/restaurants");

  return response.data;
});
