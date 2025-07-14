import { createSSRClient } from "@/lib/supabase/clients/ssr";
import { SuccessWithoutErrorFromRoute } from "@/types/api";
import { NextRequest, NextResponse } from "next/server";

const RestaurantsCountTypes = ["all", "summarized", "tagged"] as const;

export type RestaurantsCountType = (typeof RestaurantsCountTypes)[number];

const getAllRestaurantsCount = async () => {
  const supabase = await createSSRClient();

  return supabase.from("restaurants").select("*", { count: "exact" });
};

const getSummarizedRestaurantsCount = async () => {
  const supabase = await createSSRClient();

  return supabase.from("restaurant_summaries").select("*", { count: "exact" });
};

const getTaggedRestaurantsCount = async () => {
  const supabase = await createSSRClient();
  const { data, error } = await supabase.rpc("get_tagged_restaurants_count");

  return { count: data as number, error };
};

export const GET = async (request: NextRequest) => {
  const searchParams = request.nextUrl.searchParams;
  const type = (searchParams.get("type") ?? "all") as RestaurantsCountType;

  if (!RestaurantsCountTypes.includes(type)) {
    return NextResponse.json(
      {
        error: `Invalid type: ${type}. Valid types are: ${RestaurantsCountTypes.join(", ")}.`,
      },
      { status: 400 },
    );
  }

  const getCountFunctions = {
    all: getAllRestaurantsCount,
    summarized: getSummarizedRestaurantsCount,
    tagged: getTaggedRestaurantsCount,
  };

  const { count, error } = await getCountFunctions[type]();
  console.log(`${type}=${count}`);

  if (error) {
    console.error(error);

    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ type, count: count as number });
};

export type RestaurantsCountGetResponse = SuccessWithoutErrorFromRoute<
  typeof GET
>;
