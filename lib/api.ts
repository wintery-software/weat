import { RestaurantGETResponse } from "@/app/api/restaurants/[id]/route";
import { RestaurantsGETResponse } from "@/app/api/restaurants/route";
import axios from "axios";

// Create axios instance with default config
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000, // 10 seconds
});

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("Weat API Error:", error);

    return Promise.reject(error);
  },
);

export const fetchRestaurants = async () => {
  try {
    const response = await api.get<RestaurantsGETResponse>("/restaurants");

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.error || "Failed to fetch restaurants",
      );
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
        throw new Error(`Restaurant ${id} not found`);
      }

      throw new Error(
        error.response?.data?.error || `Failed to fetch restaurant ${id}`,
      );
    }

    throw error;
  }
};
