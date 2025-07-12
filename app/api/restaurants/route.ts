import { DEFAULT_FETCH_LIMIT } from "@/lib/api";
import { createSSRClient } from "@/lib/supabase/clients/ssr";
import {
  Address,
  Paginated,
  Restaurant,
  RestaurantSummary,
  RestaurantTag,
} from "@/types/types";
import { NextRequest, NextResponse } from "next/server";

export interface RestaurantsData
  extends Omit<Restaurant, "address_id" | "created_at" | "external_links"> {
  address: Address;
  summary: RestaurantSummary;
  tags: RestaurantTag[];
}

export const GET = async (request: NextRequest) => {
  const { searchParams } = new URL(request.url);
  const page = Number(searchParams.get("page") ?? "1");
  const limit = Number(searchParams.get("limit") ?? DEFAULT_FETCH_LIMIT);
  const query = searchParams.get("q"); // Add search query parameter
  const from = (page - 1) * limit;
  const to = page * limit - 1;

  const supabase = await createSSRClient();
  let queryBuilder = supabase.from("restaurants").select(
    `
      id,
      name_zh,
      name_en,
      latitude,
      longitude,
      phone_number,
      google_maps_place_id,
      updated_at,
      address:addresses(*),
      summary:restaurant_summaries(*), 
      tags:restaurant_tags(
        *, 
        tag:tags(*)
      )
    `,
    { count: "exact" },
  );

  // Add search filter if query parameter is provided
  if (query) {
    queryBuilder = queryBuilder.or(
      `name_zh.ilike.%${query}%,name_en.ilike.%${query}%`,
    );
  }

  // Apply pagination
  const { data, error, count } = await queryBuilder.range(from, to);

  if (error) {
    console.error(error);

    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const totalPages = count ? Math.ceil(count / limit) : 1;

  return NextResponse.json({
    data: (data ?? []) as unknown as RestaurantsData[],
    count: count ?? 0,
    page,
    pageSize: limit,
    totalPages,
    query: query ?? null,
  } as Paginated<RestaurantsData[]>);
};
