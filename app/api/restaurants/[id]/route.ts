import { createClient } from "@/lib/supabase/server";
import {
  APIError,
  Address,
  Restaurant,
  RestaurantDish,
  RestaurantSummary,
  RestaurantTag,
  TopTag,
} from "@/types/types";
import { PostgrestError } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

export type RestaurantGETResponse = Restaurant & {
  address: Address;
  summary:
    | (RestaurantSummary & {
        top_tags: TopTag[];
      })
    | null;
  tags: (RestaurantTag & {
    tag: {
      id: string;
      name: string;
    };
  })[];
  dishes: RestaurantDish[];
};

export const GET = async (
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) => {
  const { id } = await params;

  try {
    const supabase = await createClient();

    // Fetch restaurant with all its relations
    const { data, error } = (await supabase
      .from("restaurants")
      .select(
        `
        *,
        address:addresses(*),
        summary:restaurant_summaries(*),
        tags:restaurant_tags(
          *,
          tag:tags(*)
        ),
        dishes:restaurant_dishes(*)
      `,
      )
      .eq("id", id)
      .single()) as {
      data: RestaurantGETResponse;
      error: unknown;
    };

    if (error) {
      if ((error as PostgrestError).code === "PGRST116") {
        return NextResponse.json<APIError>(
          { error: "Restaurant not found" },
          { status: 404 },
        );
      }

      throw error;
    }

    if (!data) {
      return NextResponse.json<APIError>(
        { error: "Restaurant not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error(`Failed to fetch restaurant ${id}:`, error);

    return NextResponse.json<APIError>(
      { error: "Failed to fetch restaurant" },
      { status: 500 },
    );
  }
};
