import { DEFAULT_FETCH_LIMIT } from "@/lib/api";
import { RESTAURANT_SORT_OPTIONS } from "@/lib/constants";
import { getHaversineDistance } from "@/lib/navigation";
import { createSSRClient } from "@/lib/supabase/clients/ssr";
import {
  type Address,
  type Paginated,
  type Restaurant,
  type RestaurantSummary,
  type SortOption,
} from "@/types/types";
import { NextResponse, type NextRequest } from "next/server";

export interface RestaurantsData
  extends Omit<Restaurant, "address_id" | "created_at" | "external_links"> {
  address: Address;
  summary: Pick<
    RestaurantSummary,
    "average_rating" | "review_count" | "top_tags"
  >;
  location: {
    lng: number;
    lat: number;
  };
  distance?: number;
}

interface Filters {
  page: number;
  limit: number;
  query: string | null;
  lng: number;
  lat: number;
  distance: number;
  sortBy: SortOption;
}

export const GET = async (request: NextRequest) => {
  const { searchParams } = new URL(request.url);

  const filters: Filters = {
    page: Number(searchParams.get("page")) || 1,
    limit: Number(searchParams.get("limit")) || DEFAULT_FETCH_LIMIT,
    query: searchParams.get("q"),
    lng: Number(searchParams.get("lng")),
    lat: Number(searchParams.get("lat")),
    distance: Number(searchParams.get("distance")) || 0,
    sortBy: searchParams.get("sort_by") as SortOption,
  };

  const hasFilters = Boolean(
    filters.query ||
      filters.distance ||
      (!isNaN(filters.lng) && !isNaN(filters.lat)),
  );

  const supabase = await createSSRClient();
  let queryBuilder = supabase.from("restaurants").select(
    `
      id,
      name_zh,
      name_en,
      location:restaurant_location_geojson,
      phone_number,
      google_maps_place_id,
      updated_at,
      address:addresses(*),
      summary:restaurant_summaries(
        average_rating,
        review_count,
        top_tags
      )
    `,
    { count: "exact" },
  );

  // Search if query is provided
  if (filters.query) {
    queryBuilder = queryBuilder.or(
      `name_zh.ilike.%${filters.query}%,name_en.ilike.%${filters.query}%`,
    );
  }

  // TODO: This is a workaround because supabase doesn't support order by joined tables
  if (!hasFilters) {
    queryBuilder = queryBuilder.range(
      (filters.page - 1) * filters.limit,
      filters.page * filters.limit - 1,
    );
  }

  const { data, error, count } = await queryBuilder;
  let restaurants = (data ?? []) as unknown as RestaurantsData[];

  if (error) {
    console.error(error);

    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Always unwrap address and summary
  restaurants = restaurants.map((restaurant) => ({
    ...restaurant,
    address: Array.isArray(restaurant.address)
      ? restaurant.address[0]
      : restaurant.address,
    summary: Array.isArray(restaurant.summary)
      ? restaurant.summary[0]
      : restaurant.summary,
  }));

  const hasUserLocation = !isNaN(filters.lng) && !isNaN(filters.lat);

  // If user location, add distance property
  if (hasUserLocation) {
    restaurants = restaurants.map((restaurant) => ({
      ...restaurant,
      distance: Number(
        getHaversineDistance(
          filters.lat,
          filters.lng,
          restaurant.location.lat,
          restaurant.location.lng,
        ).toFixed(1),
      ),
    }));

    // If distance filter is greater than 0, filter by distance
    if (filters.distance > 0) {
      restaurants = restaurants.filter(
        (restaurant) =>
          restaurant.distance !== undefined &&
          restaurant.distance <= filters.distance,
      );
    }
  }

  // Always sort if a valid sort option is provided
  if (RESTAURANT_SORT_OPTIONS.includes(filters.sortBy)) {
    restaurants = restaurants.sort((a, b) => {
      switch (filters.sortBy) {
        case "distance:asc":
          if (!hasUserLocation) {
            return 0;
          }

          return a.distance! - b.distance!;
        case "distance:desc":
          if (a.distance === undefined && b.distance === undefined) {
            return 0;
          }

          if (a.distance === undefined) {
            return 1;
          }

          if (b.distance === undefined) {
            return -1;
          }

          return b.distance - a.distance;

        case "rating:asc": {
          const ratingDiff =
            Number(a.summary?.average_rating ?? 0) -
            Number(b.summary?.average_rating ?? 0);

          if (ratingDiff !== 0) {
            return ratingDiff;
          }

          return (
            Number(a.summary?.review_count ?? 0) -
            Number(b.summary?.review_count ?? 0)
          );
        }

        case "rating:desc": {
          const ratingDiff =
            Number(b.summary?.average_rating ?? 0) -
            Number(a.summary?.average_rating ?? 0);

          if (ratingDiff !== 0) {
            return ratingDiff;
          }

          return (
            Number(b.summary?.review_count ?? 0) -
            Number(a.summary?.review_count ?? 0)
          );
        }

        case "review_count:asc": {
          const countDiff =
            Number(a.summary?.review_count ?? 0) -
            Number(b.summary?.review_count ?? 0);

          if (countDiff !== 0) {
            return countDiff;
          }

          return (
            Number(a.summary?.average_rating ?? 0) -
            Number(b.summary?.average_rating ?? 0)
          );
        }

        case "review_count:desc": {
          const countDiff =
            Number(b.summary?.review_count ?? 0) -
            Number(a.summary?.review_count ?? 0);

          if (countDiff !== 0) {
            return countDiff;
          }

          return (
            Number(b.summary?.average_rating ?? 0) -
            Number(a.summary?.average_rating ?? 0)
          );
        }

        default:
          return 0;
      }
    });
  }

  // After filtering and sorting, apply pagination
  const totalCount = hasFilters ? restaurants.length : (count ?? 0);
  const totalPages = Math.ceil(totalCount / filters.limit) || 1;

  // If filters are applied, paginate in memory
  if (hasFilters) {
    const from = (filters.page - 1) * filters.limit;
    const to = filters.page * filters.limit;
    restaurants = restaurants.slice(from, to);
  }

  return NextResponse.json({
    data: restaurants,
    count: totalCount,
    page: filters.page,
    pageSize: filters.limit,
    totalPages,
    query: filters.query ?? null,
  } as Paginated<RestaurantsData[]>);
};
