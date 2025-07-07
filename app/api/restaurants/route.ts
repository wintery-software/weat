import { createClient } from "@/lib/supabase/server";
import {
  Address,
  APIError,
  Restaurant,
  RestaurantSummary,
  TopTag,
} from "@/types/types";
import { NextResponse } from "next/server";

export type RestaurantsGETResponse = (Restaurant & {
  address: Address;
  summary:
    | (RestaurantSummary & {
        top_tags: TopTag[];
      })
    | null;
})[];

export const GET = async () => {
  try {
    const supabase = await createClient();

    // Fetch restaurants with their relations
    const { data, error } = (await supabase.from("restaurants").select(`
        *,
        address:addresses(*),
        summary:restaurant_summaries(*)
      `)) as {
      data: RestaurantsGETResponse;
      error: unknown;
    };

    if (error) {
      throw error;
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Failed to fetch restaurants:", error);

    return NextResponse.json<APIError>(
      { error: "Failed to fetch restaurants." },
      { status: 500 },
    );
  }
};
