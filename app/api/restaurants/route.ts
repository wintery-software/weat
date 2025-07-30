import { DEFAULT_FETCH_LIMIT, RESTAURANT_SORT_OPTIONS } from "@/lib/constants";
import { createSSRClient } from "@/lib/supabase/clients/ssr";
import {
  type Paginated,
  type Place,
  type Restaurant,
  type RestaurantSummary,
  type SortOption,
} from "@/types/types";
import { type NextRequest, NextResponse } from "next/server";

export interface RestaurantsResponse
  extends Omit<Restaurant, "place_id" | "created_at" | "external_links"> {
  place: Place & { lat: number; lng: number; distance: number };
  summary: Pick<
    RestaurantSummary,
    "average_rating" | "review_count" | "top_tags"
  >;

  distance_meters?: number;
}

interface Filters {
  page: number;
  limit: number;
  query?: string;
  lng: number;
  lat: number;
  distance?: number;
  sortBy: SortOption;
}

export const GET = async (request: NextRequest) => {
  const { searchParams } = new URL(request.url);

  const filters: Filters = {
    page: Number(searchParams.get("page")) || 1,
    limit: Number(searchParams.get("limit")) || DEFAULT_FETCH_LIMIT,
    query: searchParams.get("q") || undefined,
    lng: Number(searchParams.get("lng")),
    lat: Number(searchParams.get("lat")),
    distance: Number(searchParams.get("distance")),
    sortBy: searchParams.get("sort_by") as SortOption,
  };

  // Validate sortBy
  if (filters.sortBy && !RESTAURANT_SORT_OPTIONS.includes(filters.sortBy)) {
    return NextResponse.json(
      { error: `Invalid sort_by value: ${filters.sortBy}` },
      { status: 400 },
    );
  }

  const supabase = await createSSRClient();

  let queryBuilder = supabase.rpc(
    "get_restaurants_user_view",
    {
      lng: filters.lng,
      lat: filters.lat,
    },
    {
      count: "exact",
    },
  );

  // Search if query is provided
  if (filters.query) {
    queryBuilder = queryBuilder.or(
      `name_zh.ilike.%${filters.query}%,name_en.ilike.%${filters.query}%`,
    );
  }

  // If distance filter is greater than 0, filter by distance
  if (filters.distance && filters.distance > 0) {
    // distance is in km, so convert to meters
    queryBuilder = queryBuilder.lte("distance", filters.distance * 1000);
  }

  // Sort
  if (filters.sortBy) {
    const [field, direction] = filters.sortBy.split(":") as [
      string,
      "asc" | "desc",
    ];

    const ascending = direction === "asc";

    if (field === "distance") {
      queryBuilder = queryBuilder.order("distance", { ascending });
    } else if (field === "rating") {
      queryBuilder = queryBuilder
        .order("summary->>average_rating", {
          ascending,
          nullsFirst: false,
        })
        .order("summary->>review_count", {
          ascending,
          nullsFirst: false,
        });
    } else if (field === "review_count") {
      queryBuilder = queryBuilder
        .order("summary->>review_count", {
          ascending,
          nullsFirst: false,
        })
        .order("summary->>average_rating", {
          ascending,
          nullsFirst: false,
        });
    }
  }

  // Apply pagination
  queryBuilder = queryBuilder.range(
    (filters.page - 1) * filters.limit,
    filters.page * filters.limit - 1,
  );

  // Execute query
  const { data, error, count } = await queryBuilder;

  if (error) {
    console.error(error);

    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const totalPages = Math.ceil((count || 0) / filters.limit) || 1;

  return NextResponse.json({
    data: data as unknown as RestaurantsResponse[],
    count: count ?? 0,
    page: filters.page,
    pageSize: filters.limit,
    totalPages,
    query: filters.query ?? null,
  } as Paginated<RestaurantsResponse[]>);
};
