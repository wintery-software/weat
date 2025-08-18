"use server";

import { dataApi } from "@/lib/api";
import type { components } from "@/types/openapi";
import { isAxiosError } from "axios";

export type GetRestaurantResponse =
  components["schemas"]["GetRestaurantResponse"];

export const getRestaurant = async (id: string) => {
  try {
    const response = await dataApi.get<GetRestaurantResponse>(
      `/restaurants/${id}`,
    );

    return response.data;
  } catch (error) {
    if (!isAxiosError(error)) {
      console.error(error);
    }

    throw new Error("Failed to fetch restaurant details");
  }
};
