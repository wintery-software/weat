import type {
  Restaurant,
  RestaurantResponse,
  RestaurantsResponse,
} from "@/types/restaurant";
import axios from "axios";

// Helper function to get base URL safely
const getBaseURL = () => {
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL;
  }

  // Only use window.location in browser environment
  if (typeof window !== "undefined") {
    return window.location.origin;
  }

  // Fallback for server-side rendering
  return "http://localhost:3000";
};

// Create axios instance with default config
const api = axios.create({
  baseURL: getBaseURL(),
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000, // 10 seconds
});

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error);

    return Promise.reject(error);
  },
);

export const fetchRestaurants = async (): Promise<Restaurant[]> => {
  try {
    const response = await api.get<RestaurantsResponse>("/api/restaurants");

    if (!response.data.success) {
      throw new Error("Failed to fetch restaurants");
    }

    return response.data.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.error || "Failed to fetch restaurants",
      );
    }

    throw error;
  }
};

export const fetchRestaurant = async (id: string): Promise<Restaurant> => {
  try {
    const response = await api.get<RestaurantResponse>(
      `/api/restaurants/${id}`,
    );

    if (!response.data.success) {
      throw new Error("Failed to fetch restaurant");
    }

    return response.data.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 404) {
        throw new Error("Restaurant not found");
      }

      throw new Error(
        error.response?.data?.error || "Failed to fetch restaurant",
      );
    }

    throw error;
  }
};
