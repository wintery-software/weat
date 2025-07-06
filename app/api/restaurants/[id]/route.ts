import { db } from "@/db";
import { generateRestaurantInsightsById } from "@/lib/ai";
import { APIError } from "@/types/types";
import { NextRequest, NextResponse } from "next/server";

const getRestaurantQuery = (id: string) =>
  db.query.restaurants.findFirst({
    where: (restaurants, { eq }) => eq(restaurants.id, id),
    with: {
      address: true,
      dishes: true,
      summary: true,
      tags: {
        with: {
          tag: true,
        },
      },
    },
  });

export type RestaurantGETResponse = Awaited<
  ReturnType<typeof getRestaurantQuery>
> & {
  summary: string;
};

export const GET = async (
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) => {
  const { id } = await params;

  try {
    const restaurant = await getRestaurantQuery(id);

    if (!restaurant) {
      return NextResponse.json<APIError>(
        { error: "Restaurant not found" },
        { status: 404 },
      );
    }

    restaurant.summary.summary = await generateRestaurantInsightsById(id);

    return NextResponse.json(restaurant);
  } catch (error) {
    console.error(`Failed to fetch restaurant ${id}:`, error);

    return NextResponse.json<APIError>(
      { error: "Failed to fetch restaurant" },
      { status: 500 },
    );
  }
};
