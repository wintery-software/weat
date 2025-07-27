import { createSSRClient } from "@/lib/supabase/clients/ssr";
import type {
  Place,
  Restaurant,
  RestaurantDish,
  RestaurantSummary,
  TagCluster,
} from "@/types/types";
import { NextResponse, type NextRequest } from "next/server";

export interface RestaurantData extends Omit<Restaurant, "created_at"> {
  place: Place & { lat: number; lng: number };
  summary: Pick<
    RestaurantSummary,
    "average_rating" | "review_count" | "summary" | "updated_at"
  >;
  tag_clusters: (TagCluster & { mention_count: number })[];
  dishes: Omit<RestaurantDish, "restaurant_id">[];
}

export const GET = async (
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) => {
  const { id } = await params;
  const supabase = await createSSRClient();
  const { data, error } = await supabase.rpc("get_restaurant_by_id_user_view", {
    id,
  });

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
