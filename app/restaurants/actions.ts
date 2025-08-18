"use server";

import { dataApi } from "@/lib/api";
import {
  DEFAULT_RESTAURANT_SORT_OPTION,
  DEFAULT_RESTAURANT_SORT_ORDER,
} from "@/lib/constants/restaurants";
import type { components } from "@/types/openapi";
import {
  type RestaurantResultsSortBy,
  type RestaurantResultsSortOrder,
} from "@/types/restaurants";
import { isAxiosError } from "axios";
import { z } from "zod";

const inputSchema = z
  .strictObject({
    page: z.number().min(1).prefault(1),
    query: z.string().trim().optional(),
    sortOption: z
      .enum([
        "distance:asc",
        "distance:desc",
        "rating:asc",
        "rating:desc",
        "review:asc",
        "review:desc",
      ])
      .prefault(DEFAULT_RESTAURANT_SORT_OPTION),
    distance: z.number().min(0).optional(),
    lat: z.number().min(-90).max(90).optional(),
    lng: z.number().min(-180).max(180).optional(),
  })
  .refine(({ lat, lng }) => (lat === undefined) === (lng === undefined), {
    error: "Both latitude and longitude must be provided together",
  });

export type ListRestaurantInput = z.input<typeof inputSchema>;

export type ListRestaurantsResponse =
  components["schemas"]["ListRestaurantResponse"];

export type ListRestaurantsResponseData =
  ListRestaurantsResponse["data"][number];

export const listRestaurants = async (input: ListRestaurantInput) => {
  try {
    const { page, query, sortOption, distance, lat, lng } =
      inputSchema.parse(input);

    const params = new URLSearchParams({
      page: page.toString(),
      page_size: "20",
    });

    if (query) {
      params.set("q", query);
    }

    if (sortOption) {
      const [sortBy, sortOrder] = sortOption.split(":") as [
        RestaurantResultsSortBy,
        RestaurantResultsSortOrder,
      ];

      params.set("sort_by", sortBy);

      if (sortOrder !== DEFAULT_RESTAURANT_SORT_ORDER) {
        params.set("sort_order", sortOrder);
      }
    }

    if (distance && distance > 0) {
      params.set("distance", distance.toString());
    }

    if (lat !== undefined && lng !== undefined) {
      params.set("lat", lat.toString());
      params.set("lng", lng.toString());
    }

    const response = await dataApi.get<ListRestaurantsResponse>(
      `/restaurants?${params.toString()}`,
    );

    return response.data;
  } catch (error) {
    if (!isAxiosError(error)) {
      console.error(error);
    }

    throw new Error("Failed to fetch restaurants");
  }
};
