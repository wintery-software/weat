import { RestaurantGETResponse } from "@/app/api/restaurants/[id]/route";
import { RestaurantsGETResponse } from "@/app/api/restaurants/route";
import { api } from "@/lib/api";
import axios from "axios";

export const fetchRestaurants = async () => {
  try {
    const response = await api.get<RestaurantsGETResponse>("/restaurants");

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.error);
    }

    throw error;
  }
};

export const fetchRestaurant = async (id: string) => {
  try {
    const response = await api.get<RestaurantGETResponse>(`/restaurants/${id}`);

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 404) {
        throw new Error(error.response?.data?.error);
      }

      throw new Error(
        error.response?.data?.error || `Failed to fetch restaurant ${id}`,
      );
    }

    throw error;
  }
};
