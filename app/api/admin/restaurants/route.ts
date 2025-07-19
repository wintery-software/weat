import { createSSRClient } from "@/lib/supabase/clients/ssr";
import { NextResponse } from "next/server";

export const GET = async (request: Request) => {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get("page") || "1");
  const pageSize = parseInt(searchParams.get("pageSize") || "10");
  const offset = (page - 1) * pageSize;

  const supabase = await createSSRClient();

  // Get paginated data with count in one query
  const { data, error, count } = await supabase
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
      { count: "exact" },
    )
    .order("created_at", { ascending: false })
    .range(offset, offset + pageSize - 1);

  if (error) {
    console.error(error);

    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const totalPages = Math.ceil((count || 0) / pageSize);

  return NextResponse.json({
    data,
    count: count || 0,
    page,
    pageSize,
    totalPages,
  });
};
