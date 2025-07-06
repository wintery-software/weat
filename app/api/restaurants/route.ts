import { db } from "@/db";
import { APIError } from "@/types/types";
import { sql } from "drizzle-orm";
import { NextResponse } from "next/server";

// Extract the query outside the function
const getRestaurantsQuery = () =>
  db.query.restaurants.findMany({
    with: {
      address: true,
      summary: true,
      tags: {
        with: {
          tag: true,
        },
      },
    },
    extras: {
      reviewCount:
        sql<number>`(SELECT COUNT(*)::int FROM reviews WHERE reviews.restaurant_id = restaurants.id)`.as(
          "reviewCount",
        ),
      dishCount:
        sql<number>`(SELECT COUNT(*)::int FROM restaurant_dishes WHERE restaurant_dishes.restaurant_id = restaurants.id)`.as(
          "dishCount",
        ),
    },
  });

// Type inferred from the extracted query
export type RestaurantsGETResponse = Awaited<
  ReturnType<typeof getRestaurantsQuery>
>;

export const GET = async () => {
  try {
    const data = await getRestaurantsQuery();

    return NextResponse.json(data);
  } catch (error) {
    console.error("Failed to fetch restaurants:", error);

    return NextResponse.json<APIError>(
      { error: "Failed to fetch restaurants" },
      { status: 500 },
    );
  }
};
