import { createSSRClient } from "@/lib/supabase/clients/ssr";
import {
  Address,
  Restaurant,
  RestaurantDish,
  RestaurantSummary,
  RestaurantTag,
  Tag,
} from "@/types/types";
import { NextRequest, NextResponse } from "next/server";

export interface RestaurantData
  extends Omit<Restaurant, "address_id" | "created_at"> {
  address: Address;
  summary: Omit<RestaurantSummary, "id" | "restaurant_id">;
  tags: (Omit<RestaurantTag, "id" | "tag_id"> & { tag: Tag })[];
  dishes: Omit<RestaurantDish, "restaurant_id">[];
}

export const GET = async (
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) => {
  const { id } = await params;
  const supabase = await createSSRClient();
  const { data, error } = await supabase
    .from("restaurants")
    .select(
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
      summary:restaurant_summaries(
        summary,
        top_tags,
        review_count,
        average_rating,
        updated_at
      ), 
      tags:restaurant_tags(
        mention_count,
        tag:tags(*)
      ),
      dishes:restaurant_dishes(
        id,
        name,
        mention_count
      )`,
    )
    .eq("id", id)
    .single();

  if (error) {
    console.error(error);

    // PostgREST error code for 'No rows found' is PGRST116
    if (error.code === "PGRST116") {
      return NextResponse.json(
        { error: "Restaurant not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data as unknown as RestaurantData);
};
