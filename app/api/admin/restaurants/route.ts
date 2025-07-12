import { createSSRClient } from "@/lib/supabase/clients/ssr";
import { NextResponse } from "next/server";

export const GET = async () => {
  const supabase = await createSSRClient();
  const { data, error } = await supabase
    .from("restaurants")
    .select(
      `
      *,
      address:addresses(*),
      summary:restaurant_summaries(*),
      reviews:reviews(
        *,
        summary:review_summaries(*)
      ),
      tags:restaurant_tags(
        *,
        tag:tags(*)
      ),
      dishes:restaurant_dishes(*)
    `,
    )
    .order("created_at", { ascending: false });

  if (error) {
    console.error(error);

    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
};
