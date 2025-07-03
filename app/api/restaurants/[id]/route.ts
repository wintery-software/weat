import restaurantsData from "@/data/restaurants.json";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) => {
  try {
    const { id } = await params;

    // Simulate a small delay to mimic real API behavior
    await new Promise((resolve) => setTimeout(resolve, 100));

    // Find the restaurant by ID in the static data
    const restaurant = restaurantsData.restaurants.find((r) => r.id === id);

    if (!restaurant) {
      return NextResponse.json(
        {
          success: false,
          error: "Restaurant not found",
        },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      data: restaurant,
    });
  } catch (error) {
    console.error("Failed to fetch restaurant:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch restaurant",
      },
      { status: 500 },
    );
  }
};
